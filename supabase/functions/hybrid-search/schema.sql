-- Create necessary tables and functions for hybrid search

-- Search performance analytics table
CREATE TABLE IF NOT EXISTS search_performance (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  search_type TEXT DEFAULT 'hybrid',
  results_count INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table for search suggestions
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  note_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table for search suggestions
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add embedding column to notes table if it doesn't exist
ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(384);
ALTER TABLE notes ADD COLUMN IF NOT EXISTS trending_score REAL DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_embedding ON notes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_notes_trending ON notes (trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes (category);
CREATE INDEX IF NOT EXISTS idx_notes_rating ON notes (rating);
CREATE INDEX IF NOT EXISTS idx_notes_price ON notes (price);
CREATE INDEX IF NOT EXISTS idx_search_performance_query ON search_performance (query);
CREATE INDEX IF NOT EXISTS idx_search_performance_created_at ON search_performance (created_at);

-- Hybrid search function
CREATE OR REPLACE FUNCTION hybrid_search_notes(
  search_query TEXT,
  query_embedding vector(384) DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  min_rating REAL DEFAULT 0,
  max_price REAL DEFAULT 999999,
  match_threshold REAL DEFAULT 0.3,
  match_count INTEGER DEFAULT 20,
  search_type TEXT DEFAULT 'hybrid'
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  body TEXT,
  tags TEXT[],
  category TEXT,
  author TEXT,
  price REAL,
  rating REAL,
  review_count INTEGER,
  created_at TIMESTAMPTZ,
  semantic_score REAL,
  fulltext_score REAL,
  fuzzy_score REAL,
  combined_score REAL,
  trending_score REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  semantic_weight REAL := CASE WHEN search_type = 'semantic' THEN 1.0 
                               WHEN search_type = 'hybrid' THEN 0.4 
                               ELSE 0.0 END;
  fulltext_weight REAL := CASE WHEN search_type = 'fulltext' THEN 1.0 
                               WHEN search_type = 'hybrid' THEN 0.3 
                               ELSE 0.0 END;
  fuzzy_weight REAL := CASE WHEN search_type = 'fuzzy' THEN 1.0 
                            WHEN search_type = 'hybrid' THEN 0.2 
                            ELSE 0.0 END;
  trending_weight REAL := 0.1;
BEGIN
  RETURN QUERY
  WITH semantic_search AS (
    SELECT 
      n.id,
      n.title,
      n.body,
      n.tags,
      n.category,
      n.author,
      n.price,
      n.rating,
      n.review_count,
      n.created_at,
      n.trending_score,
      CASE 
        WHEN query_embedding IS NOT NULL AND n.embedding IS NOT NULL 
        THEN 1 - (n.embedding <=> query_embedding)
        ELSE 0 
      END AS semantic_score
    FROM notes n
    WHERE n.is_public = true
      AND (category_filter IS NULL OR n.category = category_filter)
      AND n.rating >= min_rating
      AND n.price <= max_price
  ),
  fulltext_search AS (
    SELECT 
      s.*,
      CASE 
        WHEN search_type IN ('fulltext', 'hybrid') 
        THEN ts_rank(to_tsvector('english', s.title || ' ' || s.body), plainto_tsquery('english', search_query))
        ELSE 0 
      END AS fulltext_score
    FROM semantic_search s
  ),
  fuzzy_search AS (
    SELECT 
      f.*,
      CASE 
        WHEN search_type IN ('fuzzy', 'hybrid') 
        THEN GREATEST(
          similarity(f.title, search_query),
          similarity(f.body, search_query)
        )
        ELSE 0 
      END AS fuzzy_score
    FROM fulltext_search f
  )
  SELECT 
    fs.id,
    fs.title,
    fs.body,
    fs.tags,
    fs.category,
    fs.author,
    fs.price,
    fs.rating,
    fs.review_count,
    fs.created_at,
    fs.semantic_score,
    fs.fulltext_score,
    fs.fuzzy_score,
    (
      fs.semantic_score * semantic_weight + 
      fs.fulltext_score * fulltext_weight + 
      fs.fuzzy_score * fuzzy_weight +
      (fs.trending_score / 100.0) * trending_weight
    ) AS combined_score,
    fs.trending_score
  FROM fuzzy_search fs
  WHERE (
    fs.semantic_score >= match_threshold OR
    fs.fulltext_score > 0 OR
    fs.fuzzy_score >= match_threshold
  )
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Sample data for testing (optional)
INSERT INTO categories (name, note_count) VALUES 
  ('Technology', 150),
  ('Business', 120),
  ('Education', 200),
  ('Health', 80),
  ('Entertainment', 90)
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name, usage_count) VALUES 
  ('javascript', 45),
  ('python', 38),
  ('react', 42),
  ('ai', 35),
  ('machine-learning', 28),
  ('web-development', 55),
  ('data-science', 32),
  ('mobile', 25)
ON CONFLICT (name) DO NOTHING;

-- Function to update trending scores (run periodically)
CREATE OR REPLACE FUNCTION update_trending_scores()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE notes 
  SET trending_score = (
    -- Base score from rating and reviews
    (rating * 20) + 
    (LEAST(review_count, 100) * 0.5) +
    -- Recency bonus (newer notes get higher scores)
    (CASE 
      WHEN created_at > NOW() - INTERVAL '7 days' THEN 30
      WHEN created_at > NOW() - INTERVAL '30 days' THEN 15
      WHEN created_at > NOW() - INTERVAL '90 days' THEN 5
      ELSE 0
    END) +
    -- Category popularity bonus
    (CASE 
      WHEN category IN ('Technology', 'Business', 'Education') THEN 10
      ELSE 0
    END)
  );
END;
$$;

-- Grant necessary permissions
GRANT SELECT ON search_performance TO anon, authenticated;
GRANT INSERT ON search_performance TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON tags TO anon, authenticated;
GRANT EXECUTE ON FUNCTION hybrid_search_notes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_trending_scores TO authenticated;
