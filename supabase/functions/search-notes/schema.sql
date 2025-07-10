-- SQL schema for search-notes function

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Ensure notes table has embedding column
ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_notes_embedding ON notes USING ivfflat (embedding vector_cosine_ops);

-- Create the match_notes function for semantic search
CREATE OR REPLACE FUNCTION match_notes(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id bigint,
  title text,
  body text,
  tags text[],
  category text,
  author text,
  price real,
  rating real,
  review_count integer,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
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
    1 - (n.embedding <=> query_embedding) AS similarity
  FROM notes n
  WHERE n.embedding IS NOT NULL
    AND n.is_public = true
    AND 1 - (n.embedding <=> query_embedding) > match_threshold
  ORDER BY n.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION match_notes TO anon, authenticated;
