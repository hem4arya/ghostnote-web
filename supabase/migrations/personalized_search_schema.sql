-- Personalized Search Database Schema
-- This schema supports behavioral tracking and personalized search recommendations

-- User behavior tracking tables
CREATE TABLE IF NOT EXISTS user_behavior (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'purchase', 'search', 'like', 'share', 'download')),
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  search_query TEXT, -- For search actions
  metadata JSONB DEFAULT '{}', -- Additional context
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT, -- To group related actions
  
  -- Indexes for performance
  CONSTRAINT user_behavior_check CHECK (
    (action_type IN ('view', 'purchase', 'like', 'share', 'download') AND note_id IS NOT NULL) OR
    (action_type = 'search' AND search_query IS NOT NULL)
  )
);

-- User preferences and following
CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_tags TEXT[] DEFAULT '{}',
  followed_creators UUID[] DEFAULT '{}',
  blocked_creators UUID[] DEFAULT '{}',
  preferred_price_range NUMRANGE DEFAULT '[0,999999]',
  preferred_difficulty_level TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interaction summaries for fast lookups
CREATE TABLE IF NOT EXISTS user_interaction_summary (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  liked BOOLEAN DEFAULT FALSE,
  shared_count INTEGER DEFAULT 0,
  interaction_score REAL DEFAULT 0, -- Computed score based on all interactions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, note_id)
);

-- Collaborative filtering similarity matrix
CREATE TABLE IF NOT EXISTS user_similarity (
  id BIGSERIAL PRIMARY KEY,
  user_a UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  similarity_score REAL NOT NULL,
  common_purchases INTEGER DEFAULT 0,
  common_views INTEGER DEFAULT 0,
  common_creators INTEGER DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_a, user_b),
  CHECK (user_a < user_b) -- Ensure consistent ordering
);

-- Note popularity and trending metrics
CREATE TABLE IF NOT EXISTS note_popularity_metrics (
  id BIGSERIAL PRIMARY KEY,
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE UNIQUE,
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  trending_score REAL DEFAULT 0,
  popularity_rank INTEGER,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_action_type ON user_behavior(action_type);
CREATE INDEX IF NOT EXISTS idx_user_behavior_note_id ON user_behavior(note_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_created_at ON user_behavior(created_at);
CREATE INDEX IF NOT EXISTS idx_user_behavior_search_query ON user_behavior(search_query) WHERE action_type = 'search';

CREATE INDEX IF NOT EXISTS idx_user_interaction_summary_user_id ON user_interaction_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interaction_summary_note_id ON user_interaction_summary(note_id);
CREATE INDEX IF NOT EXISTS idx_user_interaction_summary_score ON user_interaction_summary(interaction_score DESC);

CREATE INDEX IF NOT EXISTS idx_user_similarity_user_a ON user_similarity(user_a);
CREATE INDEX IF NOT EXISTS idx_user_similarity_score ON user_similarity(similarity_score DESC);

CREATE INDEX IF NOT EXISTS idx_note_popularity_trending ON note_popularity_metrics(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_note_popularity_rank ON note_popularity_metrics(popularity_rank);

-- Functions for behavioral scoring

-- Function to calculate user interaction score for a note
CREATE OR REPLACE FUNCTION calculate_interaction_score(
  views INTEGER,
  purchased BOOLEAN,
  liked BOOLEAN,
  shared_count INTEGER
) RETURNS REAL AS $$
BEGIN
  RETURN (
    LEAST(views, 10) * 0.1 +  -- Cap views at 10 for scoring
    CASE WHEN purchased THEN 5.0 ELSE 0.0 END +
    CASE WHEN liked THEN 2.0 ELSE 0.0 END +
    LEAST(shared_count, 5) * 1.0  -- Cap shares at 5 for scoring
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update interaction summary
CREATE OR REPLACE FUNCTION update_interaction_summary(
  p_user_id UUID,
  p_note_id BIGINT,
  p_action_type TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO user_interaction_summary (user_id, note_id, total_views, last_viewed_at, purchased, purchased_at, liked)
  VALUES (p_user_id, p_note_id, 
    CASE WHEN p_action_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN p_action_type = 'view' THEN NOW() ELSE NULL END,
    p_action_type = 'purchase',
    CASE WHEN p_action_type = 'purchase' THEN NOW() ELSE NULL END,
    p_action_type = 'like'
  )
  ON CONFLICT (user_id, note_id) DO UPDATE SET
    total_views = user_interaction_summary.total_views + CASE WHEN p_action_type = 'view' THEN 1 ELSE 0 END,
    last_viewed_at = CASE WHEN p_action_type = 'view' THEN NOW() ELSE user_interaction_summary.last_viewed_at END,
    purchased = CASE WHEN p_action_type = 'purchase' THEN TRUE ELSE user_interaction_summary.purchased END,
    purchased_at = CASE WHEN p_action_type = 'purchase' THEN NOW() ELSE user_interaction_summary.purchased_at END,
    liked = CASE WHEN p_action_type = 'like' THEN TRUE WHEN p_action_type = 'unlike' THEN FALSE ELSE user_interaction_summary.liked END,
    shared_count = user_interaction_summary.shared_count + CASE WHEN p_action_type = 'share' THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  -- Update the computed interaction score
  UPDATE user_interaction_summary 
  SET interaction_score = calculate_interaction_score(total_views, purchased, liked, shared_count)
  WHERE user_id = p_user_id AND note_id = p_note_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get personalized search results
CREATE OR REPLACE FUNCTION get_personalized_search_results(
  p_user_id UUID,
  p_query_embedding vector(384),
  p_search_query TEXT,
  p_match_threshold REAL DEFAULT 0.3,
  p_match_count INTEGER DEFAULT 20,
  p_include_behavioral BOOLEAN DEFAULT TRUE
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
  behavioral_score REAL,
  popularity_score REAL,
  final_score REAL,
  interaction_count INTEGER,
  is_purchased BOOLEAN,
  recommendation_reason TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  user_prefs RECORD;
  behavioral_weight REAL := CASE WHEN p_include_behavioral AND p_user_id IS NOT NULL THEN 0.3 ELSE 0.0 END;
  semantic_weight REAL := 0.5;
  popularity_weight REAL := 0.2;
BEGIN
  -- Get user preferences if available
  IF p_user_id IS NOT NULL THEN
    SELECT * INTO user_prefs FROM user_preferences WHERE user_preferences.user_id = p_user_id;
  END IF;

  RETURN QUERY
  WITH semantic_results AS (
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
      CASE 
        WHEN n.embedding IS NOT NULL 
        THEN 1 - (n.embedding <=> p_query_embedding)
        ELSE 0
      END AS semantic_score
    FROM notes n
    WHERE n.is_public = true
      AND (
        n.embedding IS NOT NULL AND 1 - (n.embedding <=> p_query_embedding) > p_match_threshold
        OR to_tsvector('english', n.title || ' ' || n.body) @@ plainto_tsquery('english', p_search_query)
      )
  ),
  with_behavioral AS (
    SELECT 
      sr.*,
      COALESCE(pm.trending_score / 100.0, 0) AS popularity_score,
      CASE 
        WHEN p_user_id IS NULL THEN 0.5 -- Neutral score for anonymous users
        ELSE COALESCE(
          -- User interaction history
          LEAST(uis.interaction_score / 10.0, 1.0) * 0.4 +
          -- Category preference
          CASE WHEN user_prefs.preferred_categories IS NOT NULL AND sr.category = ANY(user_prefs.preferred_categories) THEN 0.3 ELSE 0 END +
          -- Tag preference
          CASE WHEN user_prefs.preferred_tags IS NOT NULL AND sr.tags && user_prefs.preferred_tags THEN 0.2 ELSE 0 END +
          -- Creator following
          CASE WHEN user_prefs.followed_creators IS NOT NULL AND sr.author::UUID = ANY(user_prefs.followed_creators) THEN 0.1 ELSE 0 END,
          0.5
        )
      END AS behavioral_score,
      COALESCE(uis.total_views, 0) AS interaction_count,
      COALESCE(uis.purchased, FALSE) AS is_purchased,
      -- Generate recommendation reason
      CASE 
        WHEN uis.purchased THEN 'You purchased this'
        WHEN uis.total_views > 3 THEN 'You viewed this multiple times'
        WHEN user_prefs.preferred_categories IS NOT NULL AND sr.category = ANY(user_prefs.preferred_categories) THEN 'Matches your preferred category'
        WHEN user_prefs.followed_creators IS NOT NULL AND sr.author::UUID = ANY(user_prefs.followed_creators) THEN 'From a creator you follow'
        WHEN pm.trending_score > 80 THEN 'Trending content'
        ELSE 'High semantic match'
      END AS recommendation_reason
    FROM semantic_results sr
    LEFT JOIN user_interaction_summary uis ON uis.user_id = p_user_id AND uis.note_id = sr.id
    LEFT JOIN note_popularity_metrics pm ON pm.note_id = sr.id
  )
  SELECT 
    wb.*,
    (
      wb.semantic_score * semantic_weight +
      wb.behavioral_score * behavioral_weight +
      wb.popularity_score * popularity_weight
    ) AS final_score
  FROM with_behavioral wb
  WHERE 
    -- Filter out notes the user has seen too much (unless they purchased it)
    (wb.interaction_count < 5 OR wb.is_purchased)
    -- Filter out blocked creators
    AND (user_prefs.blocked_creators IS NULL OR NOT (wb.author::UUID = ANY(user_prefs.blocked_creators)))
  ORDER BY final_score DESC
  LIMIT p_match_count;
END;
$$;

-- Function to get collaborative filtering recommendations
CREATE OR REPLACE FUNCTION get_collaborative_recommendations(
  p_user_id UUID,
  p_recommendation_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  note_id BIGINT,
  title TEXT,
  author TEXT,
  category TEXT,
  price REAL,
  rating REAL,
  similarity_score REAL,
  recommendation_reason TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH similar_users AS (
    SELECT user_b AS similar_user_id, similarity_score
    FROM user_similarity
    WHERE user_a = p_user_id
    ORDER BY similarity_score DESC
    LIMIT 10
    
    UNION ALL
    
    SELECT user_a AS similar_user_id, similarity_score
    FROM user_similarity
    WHERE user_b = p_user_id
    ORDER BY similarity_score DESC
    LIMIT 10
  ),
  similar_user_purchases AS (
    SELECT 
      uis.note_id,
      AVG(su.similarity_score) as avg_similarity,
      COUNT(*) as similar_user_count
    FROM similar_users su
    JOIN user_interaction_summary uis ON uis.user_id = su.similar_user_id
    WHERE uis.purchased = TRUE
      AND uis.note_id NOT IN (
        SELECT note_id FROM user_interaction_summary 
        WHERE user_id = p_user_id AND purchased = TRUE
      )
    GROUP BY uis.note_id
    HAVING COUNT(*) >= 2  -- At least 2 similar users purchased it
  )
  SELECT 
    n.id,
    n.title,
    n.author,
    n.category,
    n.price,
    n.rating,
    sup.avg_similarity,
    'Users similar to you purchased this' as recommendation_reason
  FROM similar_user_purchases sup
  JOIN notes n ON n.id = sup.note_id
  WHERE n.is_public = TRUE
  ORDER BY sup.avg_similarity * sup.similar_user_count DESC
  LIMIT p_recommendation_count;
END;
$$;

-- Function to update note popularity metrics
CREATE OR REPLACE FUNCTION update_note_popularity()
RETURNS VOID AS $$
BEGIN
  INSERT INTO note_popularity_metrics (
    note_id, view_count, purchase_count, like_count, share_count, unique_viewers, trending_score
  )
  SELECT 
    n.id,
    COALESCE(view_stats.view_count, 0),
    COALESCE(purchase_stats.purchase_count, 0),
    COALESCE(like_stats.like_count, 0),
    COALESCE(share_stats.share_count, 0),
    COALESCE(view_stats.unique_viewers, 0),
    -- Calculate trending score
    (
      COALESCE(view_stats.view_count, 0) * 0.1 +
      COALESCE(purchase_stats.purchase_count, 0) * 5.0 +
      COALESCE(like_stats.like_count, 0) * 2.0 +
      COALESCE(share_stats.share_count, 0) * 3.0 +
      -- Recency bonus
      CASE 
        WHEN n.created_at > NOW() - INTERVAL '7 days' THEN 20
        WHEN n.created_at > NOW() - INTERVAL '30 days' THEN 10
        ELSE 0
      END
    ) AS trending_score
  FROM notes n
  LEFT JOIN (
    SELECT note_id, COUNT(*) as view_count, COUNT(DISTINCT user_id) as unique_viewers
    FROM user_behavior 
    WHERE action_type = 'view' AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY note_id
  ) view_stats ON view_stats.note_id = n.id
  LEFT JOIN (
    SELECT note_id, COUNT(*) as purchase_count
    FROM user_behavior 
    WHERE action_type = 'purchase' AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY note_id
  ) purchase_stats ON purchase_stats.note_id = n.id
  LEFT JOIN (
    SELECT note_id, COUNT(*) as like_count
    FROM user_behavior 
    WHERE action_type = 'like' AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY note_id
  ) like_stats ON like_stats.note_id = n.id
  LEFT JOIN (
    SELECT note_id, COUNT(*) as share_count
    FROM user_behavior 
    WHERE action_type = 'share' AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY note_id
  ) share_stats ON share_stats.note_id = n.id
  ON CONFLICT (note_id) DO UPDATE SET
    view_count = EXCLUDED.view_count,
    purchase_count = EXCLUDED.purchase_count,
    like_count = EXCLUDED.like_count,
    share_count = EXCLUDED.share_count,
    unique_viewers = EXCLUDED.unique_viewers,
    trending_score = EXCLUDED.trending_score,
    updated_at = NOW();

  -- Update popularity ranks
  UPDATE note_popularity_metrics 
  SET popularity_rank = ranked.rank
  FROM (
    SELECT note_id, ROW_NUMBER() OVER (ORDER BY trending_score DESC) as rank
    FROM note_popularity_metrics
  ) ranked
  WHERE note_popularity_metrics.note_id = ranked.note_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_behavior TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_interaction_summary TO authenticated;
GRANT SELECT ON user_similarity TO authenticated;
GRANT SELECT ON note_popularity_metrics TO anon, authenticated;

GRANT EXECUTE ON FUNCTION calculate_interaction_score TO authenticated;
GRANT EXECUTE ON FUNCTION update_interaction_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_personalized_search_results TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_collaborative_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION update_note_popularity TO authenticated;
