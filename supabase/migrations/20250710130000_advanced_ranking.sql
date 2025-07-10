-- Enhanced notes table with ranking factors
-- This extends the existing table to support advanced ranking

-- Add new columns for ranking factors
ALTER TABLE notes ADD COLUMN IF NOT EXISTS purchase_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE notes ADD COLUMN IF NOT EXISTS creator_trust_score DECIMAL(3,2) DEFAULT 0.5; -- 0.0 to 1.0
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_verified_creator BOOLEAN DEFAULT FALSE;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS trending_score DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS last_purchased_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_purchase_count ON notes(purchase_count DESC);
CREATE INDEX IF NOT EXISTS idx_notes_view_count ON notes(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_notes_trending_score ON notes(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_rating ON notes(rating DESC);

-- Table for user interactions (for personalized ranking)
CREATE TABLE IF NOT EXISTS user_interactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  note_id BIGINT REFERENCES notes(id),
  interaction_type TEXT NOT NULL, -- 'view', 'purchase', 'like', 'share'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_interactions_user_note ON user_interactions(user_id, note_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);

-- Table for tracking search queries and results
CREATE TABLE IF NOT EXISTS search_analytics (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  results_count INTEGER DEFAULT 0,
  clicked_note_id BIGINT REFERENCES notes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to calculate recency factor (fresher content gets boost)
CREATE OR REPLACE FUNCTION calculate_recency_factor(created_date TIMESTAMP WITH TIME ZONE)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  days_old INTEGER;
  recency_factor DECIMAL(3,2);
BEGIN
  days_old := EXTRACT(DAY FROM NOW() - created_date);
  
  -- Recency scoring: newer content gets higher score
  CASE 
    WHEN days_old <= 7 THEN recency_factor := 1.0;    -- Very fresh (1 week)
    WHEN days_old <= 30 THEN recency_factor := 0.8;   -- Fresh (1 month)
    WHEN days_old <= 90 THEN recency_factor := 0.6;   -- Recent (3 months)
    WHEN days_old <= 180 THEN recency_factor := 0.4;  -- Older (6 months)
    ELSE recency_factor := 0.2;                        -- Old (6+ months)
  END CASE;
  
  RETURN recency_factor;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate popularity factor
CREATE OR REPLACE FUNCTION calculate_popularity_factor(
  purchase_cnt INTEGER, 
  view_cnt INTEGER,
  rating_val DECIMAL(3,2),
  review_cnt INTEGER
)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  popularity_factor DECIMAL(3,2);
  purchase_score DECIMAL(3,2);
  view_score DECIMAL(3,2);
  rating_score DECIMAL(3,2);
BEGIN
  -- Normalize purchase count (log scale to prevent outliers from dominating)
  purchase_score := LEAST(1.0, LOG(1 + purchase_cnt) / LOG(101)); -- Max at 100 purchases
  
  -- Normalize view count
  view_score := LEAST(1.0, LOG(1 + view_cnt) / LOG(1001)); -- Max at 1000 views
  
  -- Rating score (weighted by review count)
  IF review_cnt > 0 THEN
    rating_score := (rating_val / 5.0) * LEAST(1.0, review_cnt / 10.0);
  ELSE
    rating_score := 0.0;
  END IF;
  
  -- Combine factors: 50% purchases, 30% rating, 20% views
  popularity_factor := (purchase_score * 0.5) + (rating_score * 0.3) + (view_score * 0.2);
  
  RETURN LEAST(1.0, popularity_factor);
END;
$$ LANGUAGE plpgsql;

-- Enhanced search function with advanced ranking
CREATE OR REPLACE FUNCTION advanced_search_notes(
  query_embedding vector(384),
  search_query TEXT,
  user_id UUID DEFAULT NULL,
  match_threshold DECIMAL(3,2) DEFAULT 0.3,
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
  price DECIMAL,
  purchase_count INTEGER,
  view_count INTEGER,
  rating DECIMAL(3,2),
  review_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  is_verified_creator BOOLEAN,
  creator_trust_score DECIMAL(3,2),
  
  -- Ranking factors
  content_similarity DECIMAL(3,2),
  popularity_score DECIMAL(3,2),
  recency_score DECIMAL(3,2),
  creator_score DECIMAL(3,2),
  personalization_score DECIMAL(3,2),
  final_score DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
  search_query_lower TEXT;
BEGIN
  search_query_lower := LOWER(search_query);
  
  RETURN QUERY
  WITH scored_results AS (
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
      
      -- Content similarity (semantic + keyword matching)
      GREATEST(
        1 - (n.embedding <=> query_embedding), -- Semantic similarity
        CASE 
          WHEN LOWER(n.title) LIKE '%' || search_query_lower || '%' THEN 0.9
          WHEN LOWER(n.body) LIKE '%' || search_query_lower || '%' THEN 0.7
          WHEN LOWER(n.category) LIKE '%' || search_query_lower || '%' THEN 0.6
          ELSE 0.0
        END
      ) AS content_similarity,
      
      -- Popularity score
      calculate_popularity_factor(
        n.purchase_count, 
        n.view_count, 
        n.rating, 
        n.review_count
      ) AS popularity_score,
      
      -- Recency score
      calculate_recency_factor(n.created_at) AS recency_score,
      
      -- Creator trust score
      CASE 
        WHEN n.is_verified_creator THEN n.creator_trust_score * 1.2
        ELSE n.creator_trust_score
      END AS creator_score,
      
      -- Personalization score (based on user's past interactions)
      COALESCE((
        SELECT AVG(
          CASE ui.interaction_type
            WHEN 'purchase' THEN 1.0
            WHEN 'like' THEN 0.8
            WHEN 'view' THEN 0.3
            ELSE 0.1
          END
        )
        FROM user_interactions ui
        WHERE ui.user_id = advanced_search_notes.user_id
          AND ui.note_id IN (
            SELECT n2.id 
            FROM notes n2 
            WHERE n2.category = n.category 
               OR n2.author = n.author
          )
        LIMIT 10
      ), 0.0) AS personalization_score
      
    FROM notes n
    WHERE n.is_public = true
  )
  SELECT 
    sr.*,
    -- Final weighted score calculation
    (
      sr.content_similarity * 0.35 +      -- 35% content match
      sr.popularity_score * 0.25 +        -- 25% popularity
      sr.recency_score * 0.15 +           -- 15% recency
      sr.creator_score * 0.15 +           -- 15% creator trust
      sr.personalization_score * 0.10     -- 10% personalization
    ) AS final_score
  FROM scored_results sr
  WHERE sr.content_similarity > match_threshold
  ORDER BY final_score DESC, sr.content_similarity DESC
  LIMIT match_count;
END;
$$;

-- Function to update trending scores (run periodically)
CREATE OR REPLACE FUNCTION update_trending_scores()
RETURNS VOID AS $$
BEGIN
  UPDATE notes SET trending_score = (
    -- Trending calculation based on recent activity
    COALESCE(
      (
        SELECT 
          (COUNT(*) * 10.0) * -- Base score from recent purchases
          calculate_recency_factor(MAX(ui.created_at)) * -- Recency boost
          (1 + (n.rating / 5.0)) -- Rating boost
        FROM user_interactions ui
        WHERE ui.note_id = notes.id
          AND ui.interaction_type IN ('purchase', 'view')
          AND ui.created_at >= NOW() - INTERVAL '7 days'
      ), 0.0
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(note_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE notes SET 
    view_count = view_count + 1,
    updated_at = NOW()
  WHERE id = note_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track user interactions
CREATE OR REPLACE FUNCTION track_user_interaction(
  p_user_id UUID,
  p_note_id BIGINT,
  p_interaction_type TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_interactions (user_id, note_id, interaction_type)
  VALUES (p_user_id, p_note_id, p_interaction_type);
  
  -- Update note stats based on interaction
  CASE p_interaction_type
    WHEN 'purchase' THEN
      UPDATE notes SET 
        purchase_count = purchase_count + 1,
        last_purchased_at = NOW(),
        updated_at = NOW()
      WHERE id = p_note_id;
    WHEN 'view' THEN
      PERFORM increment_view_count(p_note_id);
    ELSE
      -- Other interactions don't update note stats directly
      NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql;
