-- Advanced Search Indexing Strategy for GhostNote
-- Optimized for 100k+ notes with minimal search lag
-- Date: July 10, 2025

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- Trigram matching for fuzzy search
CREATE EXTENSION IF NOT EXISTS btree_gin; -- GIN indexes for better performance
CREATE EXTENSION IF NOT EXISTS btree_gist; -- GIST indexes for complex queries

-- =====================================================
-- CORE SCHEMA OPTIMIZATIONS
-- =====================================================

-- Add missing columns for comprehensive indexing
ALTER TABLE notes ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS language_code VARCHAR(5) DEFAULT 'en';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS last_indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Full-text search column (tsvector for fast text search)
ALTER TABLE notes ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- =====================================================
-- ADVANCED INDEXING STRATEGY
-- =====================================================

-- 1. PRIMARY SEARCH INDEXES
-- Full-text search index using GIN (fastest for text search)
CREATE INDEX IF NOT EXISTS idx_notes_search_vector_gin ON notes USING gin(search_vector);

-- Vector similarity index using ivfflat for semantic search
CREATE INDEX IF NOT EXISTS idx_notes_embedding_ivfflat ON notes 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 2. FUZZY SEARCH INDEXES (using trigrams)
-- Title trigram index for fuzzy matching
CREATE INDEX IF NOT EXISTS idx_notes_title_trgm ON notes USING gin (title gin_trgm_ops);

-- Body trigram index for content fuzzy matching
CREATE INDEX IF NOT EXISTS idx_notes_body_trgm ON notes USING gin (body gin_trgm_ops);

-- Author trigram index for author fuzzy matching
CREATE INDEX IF NOT EXISTS idx_notes_author_trgm ON notes USING gin (author gin_trgm_ops);

-- 3. CATEGORICAL INDEXES
-- Category index for exact matching
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category) WHERE is_public = true;

-- Language index for multi-language support
CREATE INDEX IF NOT EXISTS idx_notes_language ON notes(language_code) WHERE is_public = true;

-- 4. ARRAY INDEXES (for tags and keywords)
-- GIN index for tags array (supports ANY/ALL operations)
CREATE INDEX IF NOT EXISTS idx_notes_tags_gin ON notes USING gin(tags);

-- GIN index for keywords array
CREATE INDEX IF NOT EXISTS idx_notes_keywords_gin ON notes USING gin(keywords);

-- 5. COMPOSITE INDEXES FOR COMMON QUERIES
-- Most common search pattern: public + category + popularity
CREATE INDEX IF NOT EXISTS idx_notes_public_category_popularity ON notes(is_public, category, purchase_count DESC, view_count DESC) 
WHERE is_public = true;

-- Price range queries
CREATE INDEX IF NOT EXISTS idx_notes_price_range ON notes(price, is_public) WHERE is_public = true;

-- Recent popular notes
CREATE INDEX IF NOT EXISTS idx_notes_recent_popular ON notes(created_at DESC, trending_score DESC) 
WHERE is_public = true;

-- 6. PARTIAL INDEXES FOR OPTIMIZATION
-- Index only public notes for most queries
CREATE INDEX IF NOT EXISTS idx_notes_public_only ON notes(id, title, category, author, price, rating) 
WHERE is_public = true;

-- High-performing notes index
CREATE INDEX IF NOT EXISTS idx_notes_high_quality ON notes(rating DESC, review_count DESC) 
WHERE is_public = true AND rating >= 4.0;

-- =====================================================
-- TAG AND CATEGORY OPTIMIZATION
-- =====================================================

-- Normalized tags table for better performance and consistency
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for note-tag relationships
CREATE TABLE IF NOT EXISTS note_tags (
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Categories table for better organization
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  note_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for tag/category tables
CREATE INDEX IF NOT EXISTS idx_tags_usage ON tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_tags_name_trgm ON tags USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_note_tags_note ON note_tags(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_categories_note_count ON categories(note_count DESC);

-- =====================================================
-- SEARCH OPTIMIZATION FUNCTIONS
-- =====================================================

-- Function to update search vector automatically
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS trigger AS $$
BEGIN
  -- Create weighted search vector (title has higher weight)
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.body, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.author, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'D') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  
  -- Update word count and reading time
  NEW.word_count := array_length(string_to_array(COALESCE(NEW.body, ''), ' '), 1);
  NEW.reading_time_minutes := GREATEST(1, NEW.word_count / 200); -- Average 200 WPM
  NEW.last_indexed_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
DROP TRIGGER IF EXISTS trigger_update_search_vector ON notes;
CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE OF title, body, author, category, tags
  ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

-- =====================================================
-- HYBRID SEARCH FUNCTION (Combines semantic + full-text + fuzzy)
-- =====================================================

CREATE OR REPLACE FUNCTION hybrid_search_notes(
  search_query TEXT,
  query_embedding vector(384) DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  min_rating DECIMAL(3,2) DEFAULT 0.0,
  max_price DECIMAL(10,2) DEFAULT 999999.99,
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 20,
  search_type TEXT DEFAULT 'hybrid' -- 'semantic', 'fulltext', 'fuzzy', 'hybrid'
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  body TEXT,
  tags TEXT[],
  category TEXT,
  author TEXT,
  price DECIMAL(10,2),
  rating DECIMAL(3,2),
  review_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  
  -- Search scores
  semantic_score FLOAT,
  fulltext_score FLOAT,
  fuzzy_score FLOAT,
  combined_score FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
  search_tsquery tsquery;
BEGIN
  -- Prepare full-text search query
  search_tsquery := plainto_tsquery('english', search_query);
  
  RETURN QUERY
  WITH semantic_results AS (
    -- Semantic search using embeddings
    SELECT 
      n.id, n.title, n.body, n.tags, n.category, n.author, n.price, 
      n.rating, n.review_count, n.created_at,
      CASE WHEN query_embedding IS NOT NULL 
           THEN GREATEST(0, 1 - (n.embedding <=> query_embedding))
           ELSE 0 END as semantic_score
    FROM notes n
    WHERE n.is_public = true
      AND (category_filter IS NULL OR n.category = category_filter)
      AND n.rating >= min_rating
      AND n.price <= max_price
      AND (query_embedding IS NULL OR 1 - (n.embedding <=> query_embedding) > match_threshold)
  ),
  fulltext_results AS (
    -- Full-text search results
    SELECT 
      n.id,
      ts_rank_cd(n.search_vector, search_tsquery) as fulltext_score
    FROM notes n
    WHERE n.is_public = true
      AND n.search_vector @@ search_tsquery
      AND (category_filter IS NULL OR n.category = category_filter)
      AND n.rating >= min_rating
      AND n.price <= max_price
  ),
  fuzzy_results AS (
    -- Fuzzy search results using trigrams
    SELECT 
      n.id,
      GREATEST(
        similarity(n.title, search_query),
        similarity(n.author, search_query),
        similarity(n.body, search_query)
      ) as fuzzy_score
    FROM notes n
    WHERE n.is_public = true
      AND (
        n.title % search_query OR 
        n.author % search_query OR 
        n.body % search_query
      )
      AND (category_filter IS NULL OR n.category = category_filter)
      AND n.rating >= min_rating
      AND n.price <= max_price
  )
  SELECT 
    sr.id, sr.title, sr.body, sr.tags, sr.category, sr.author, sr.price,
    sr.rating, sr.review_count, sr.created_at,
    COALESCE(sr.semantic_score, 0) as semantic_score,
    COALESCE(ftr.fulltext_score, 0) as fulltext_score,
    COALESCE(fzr.fuzzy_score, 0) as fuzzy_score,
    -- Combined score with weights: 50% semantic, 30% fulltext, 20% fuzzy
    (COALESCE(sr.semantic_score, 0) * 0.5 + 
     COALESCE(ftr.fulltext_score, 0) * 0.3 + 
     COALESCE(fzr.fuzzy_score, 0) * 0.2) as combined_score
  FROM semantic_results sr
  LEFT JOIN fulltext_results ftr ON sr.id = ftr.id
  LEFT JOIN fuzzy_results fzr ON sr.id = fzr.id
  WHERE 
    CASE search_type
      WHEN 'semantic' THEN sr.semantic_score > 0
      WHEN 'fulltext' THEN ftr.fulltext_score > 0
      WHEN 'fuzzy' THEN fzr.fuzzy_score > 0
      ELSE (sr.semantic_score > 0 OR ftr.fulltext_score > 0 OR fzr.fuzzy_score > 0)
    END
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- =====================================================
-- ANALYTICS AND PERFORMANCE TRACKING
-- =====================================================

-- Enhanced search analytics table
CREATE TABLE IF NOT EXISTS search_performance (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  search_type TEXT NOT NULL, -- 'semantic', 'fulltext', 'fuzzy', 'hybrid'
  results_count INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_performance_query ON search_performance(query);
CREATE INDEX IF NOT EXISTS idx_search_performance_time ON search_performance(created_at DESC);

-- =====================================================
-- MAINTENANCE FUNCTIONS FOR SCALABILITY
-- =====================================================

-- Function to update popularity metrics (run periodically)
CREATE OR REPLACE FUNCTION update_popularity_metrics()
RETURNS void AS $$
BEGIN
  -- Update trending scores based on recent activity
  UPDATE notes SET trending_score = (
    -- Weighted calculation: 40% recent purchases, 30% recent views, 30% rating
    COALESCE((
      SELECT COUNT(*) * 40 
      FROM user_interactions ui 
      WHERE ui.note_id = notes.id 
        AND ui.interaction_type = 'purchase'
        AND ui.created_at > NOW() - INTERVAL '7 days'
    ), 0) +
    COALESCE((
      SELECT COUNT(*) * 0.3 
      FROM user_interactions ui 
      WHERE ui.note_id = notes.id 
        AND ui.interaction_type = 'view'
        AND ui.created_at > NOW() - INTERVAL '7 days'
    ), 0) +
    (rating * review_count * 0.3)
  );
  
  -- Update tag usage counts
  UPDATE tags SET usage_count = (
    SELECT COUNT(*) FROM note_tags nt 
    JOIN notes n ON nt.note_id = n.id 
    WHERE nt.tag_id = tags.id AND n.is_public = true
  );
  
  -- Update category note counts
  UPDATE categories SET note_count = (
    SELECT COUNT(*) FROM notes n 
    WHERE n.category = categories.name AND n.is_public = true
  );
END;
$$ LANGUAGE plpgsql;

-- Function to reindex search vectors (run weekly)
CREATE OR REPLACE FUNCTION reindex_search_vectors()
RETURNS void AS $$
BEGIN
  UPDATE notes SET last_indexed_at = NOW()
  WHERE last_indexed_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VACUUM AND ANALYZE AUTOMATION
-- =====================================================

-- Create function to maintain index health
CREATE OR REPLACE FUNCTION maintain_search_indexes()
RETURNS void AS $$
BEGIN
  -- Analyze tables for query optimization
  ANALYZE notes;
  ANALYZE user_interactions;
  ANALYZE search_analytics;
  ANALYZE tags;
  ANALYZE note_tags;
  ANALYZE categories;
  
  -- Reindex if fragmentation is high (can be checked with pg_stat_user_indexes)
  REINDEX INDEX CONCURRENTLY idx_notes_search_vector_gin;
  REINDEX INDEX CONCURRENTLY idx_notes_embedding_ivfflat;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Development', 'development', 'Programming and software development guides'),
  ('AI/ML', 'ai-ml', 'Artificial intelligence and machine learning content'),
  ('Design', 'design', 'UI/UX design and creative content'),
  ('Business', 'business', 'Business strategy and entrepreneurship'),
  ('Writing', 'writing', 'Creative writing and storytelling')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
  ('React', 'react'),
  ('JavaScript', 'javascript'),
  ('Python', 'python'),
  ('Machine Learning', 'machine-learning'),
  ('UI Design', 'ui-design'),
  ('Typography', 'typography'),
  ('Startup', 'startup'),
  ('Marketing', 'marketing'),
  ('Fiction', 'fiction'),
  ('Non-fiction', 'non-fiction')
ON CONFLICT (name) DO NOTHING;
