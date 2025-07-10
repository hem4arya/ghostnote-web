-- Create the advanced search function and supporting database elements

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Analytics table for search tracking
CREATE TABLE IF NOT EXISTS search_analytics (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  results_count INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make sure notes table has necessary columns
ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(384);
ALTER TABLE notes ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS purchase_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_verified_creator BOOLEAN DEFAULT false;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS creator_trust_score REAL DEFAULT 0.5;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS trending_score REAL DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_embedding ON notes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes (category);
CREATE INDEX IF NOT EXISTS idx_notes_keywords ON notes USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_notes_rating ON notes (rating);
CREATE INDEX IF NOT EXISTS idx_notes_trending ON notes (trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics (query);

-- User preferences table for personalization
CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_creators TEXT[] DEFAULT '{}',
  preferred_keywords TEXT[] DEFAULT '{}',
  search_history TEXT[] DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create the advanced search function
CREATE OR REPLACE FUNCTION advanced_search_notes(
  query_embedding vector(384),
  search_query TEXT,
  user_id UUID DEFAULT NULL,
  match_threshold REAL DEFAULT 0.3,
  match_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  body TEXT,
  tags TEXT[],
  category TEXT,
  author TEXT,
  keywords TEXT[],
  price REAL,
  purchase_count INTEGER,
  view_count INTEGER,
  rating REAL,
  review_count INTEGER,
  created_at TIMESTAMPTZ,
  is_verified_creator BOOLEAN,
  creator_trust_score REAL,
  content_similarity REAL,
  popularity_score REAL,
  recency_score REAL,
  creator_score REAL,
  personalization_score REAL,
  final_score REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  user_prefs record;
  one_month_ago TIMESTAMPTZ := NOW() - INTERVAL '30 days';
  three_months_ago TIMESTAMPTZ := NOW() - INTERVAL '90 days';
BEGIN
  -- Get user preferences if user_id is provided
  IF user_id IS NOT NULL THEN
    SELECT * INTO user_prefs FROM user_preferences WHERE user_preferences.user_id = advanced_search_notes.user_id;
  END IF;

  RETURN QUERY
  WITH content_match AS (
    SELECT 
      n.id,
      n.title,
      n.body,
      n.tags,
      n.category,
      n.author,
      n.keywords,
      n.price,
      n.purchase_count,
      n.view_count,
      n.rating,
      n.review_count,
      n.created_at,
      n.is_verified_creator,
      n.creator_trust_score,
      -- Content similarity score from embedding
      CASE 
        WHEN n.embedding IS NOT NULL 
        THEN 1 - (n.embedding <=> query_embedding)
        ELSE 0
      END AS content_similarity
    FROM notes n
    WHERE n.is_public = true
      AND (
        -- Vector similarity search
        (n.embedding IS NOT NULL AND 1 - (n.embedding <=> query_embedding) > match_threshold)
        OR 
        -- Text search fallback
        (to_tsvector('english', n.title || ' ' || n.body) @@ plainto_tsquery('english', search_query))
        OR
        -- Keyword match
        (n.keywords && string_to_array(search_query, ' '))
      )
  ),
  scored_results AS (
    SELECT
      cm.*,
      -- Popularity score based on purchases, views, and reviews
      (
        LEAST(cm.purchase_count, 1000) * 0.0005 + 
        LEAST(cm.view_count, 10000) * 0.00005 +
        LEAST(cm.review_count, 500) * 0.001 +
        LEAST(cm.rating, 5.0) * 0.1
      ) AS popularity_score,
      
      -- Recency score based on creation date
      CASE
        WHEN cm.created_at > one_month_ago THEN 1.0
        WHEN cm.created_at > three_months_ago THEN 0.7
        ELSE 0.4
      END AS recency_score,
      
      -- Creator credibility score
      (
        cm.creator_trust_score + 
        CASE WHEN cm.is_verified_creator THEN 0.3 ELSE 0 END
      ) AS creator_score,
      
      -- Personalization score based on user preferences
      CASE
        WHEN user_id IS NULL THEN 0.5 -- Neutral score if no user
        WHEN user_prefs IS NULL THEN 0.5 -- Neutral score if no preferences
        ELSE (
          -- Category match
          CASE WHEN user_prefs.preferred_categories IS NULL THEN 0
               WHEN cardinality(user_prefs.preferred_categories) = 0 THEN 0
               WHEN cm.category = ANY(user_prefs.preferred_categories) THEN 0.4
               ELSE 0
          END +
          -- Creator match
          CASE WHEN user_prefs.preferred_creators IS NULL THEN 0
               WHEN cardinality(user_prefs.preferred_creators) = 0 THEN 0
               WHEN cm.author = ANY(user_prefs.preferred_creators) THEN 0.3
               ELSE 0
          END +
          -- Keywords match
          CASE WHEN user_prefs.preferred_keywords IS NULL THEN 0
               WHEN cardinality(user_prefs.preferred_keywords) = 0 THEN 0
               WHEN cm.keywords && user_prefs.preferred_keywords THEN 0.3
               ELSE 0
          END
        )
      END AS personalization_score
    FROM content_match cm
  )
  SELECT
    sr.*,
    -- Final weighted score
    (
      sr.content_similarity * 0.35 +
      sr.popularity_score * 0.25 +
      sr.recency_score * 0.15 +
      sr.creator_score * 0.15 +
      sr.personalization_score * 0.1
    ) AS final_score
  FROM scored_results sr
  ORDER BY final_score DESC
  LIMIT match_count;
END;
$$;

-- Function to update trending scores (run periodically)
CREATE OR REPLACE FUNCTION update_trending_scores()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE notes 
  SET trending_score = (
    -- Base score from rating and activity
    (COALESCE(rating, 0) * 10) + 
    (LEAST(COALESCE(purchase_count, 0), 1000) * 0.05) +
    (LEAST(COALESCE(review_count, 0), 500) * 0.1) +
    (LEAST(COALESCE(view_count, 0), 10000) * 0.005) +
    -- Recency bonus
    (CASE 
      WHEN created_at > NOW() - INTERVAL '7 days' THEN 30
      WHEN created_at > NOW() - INTERVAL '30 days' THEN 15
      WHEN created_at > NOW() - INTERVAL '90 days' THEN 5
      ELSE 0
    END) +
    -- Creator credibility bonus
    (CASE 
      WHEN is_verified_creator THEN 10
      ELSE creator_trust_score * 5
    END)
  );
END;
$$;

-- Grant necessary permissions
GRANT SELECT ON search_analytics TO anon, authenticated;
GRANT INSERT ON search_analytics TO authenticated;
GRANT SELECT ON user_preferences TO authenticated;
GRANT UPDATE ON user_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION advanced_search_notes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_trending_scores TO authenticated;
