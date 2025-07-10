-- Add a column to store the SimHash fingerprint
ALTER TABLE notes
ADD COLUMN simhash_fingerprint BIT(64);

-- Create an index on the new column to speed up searches
CREATE INDEX idx_notes_simhash_fingerprint ON notes (simhash_fingerprint);

-- Function to find similar notes based on Hamming distance
CREATE OR REPLACE FUNCTION find_similar_notes(
  note_id_to_check BIGINT,
  similarity_threshold INT
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  similarity_score INT
) AS $$
DECLARE
  target_hash BIT(64);
BEGIN
  -- Get the hash of the note we are checking
  SELECT simhash_fingerprint INTO target_hash FROM notes WHERE notes.id = note_id_to_check;

  -- Find notes with a Hamming distance less than or equal to the threshold
  RETURN QUERY
  SELECT
    n.id,
    n.title,
    n.created_at,
    n.user_id,
    -- Calculate a similarity score from the Hamming distance
    (64 - bit_count(n.simhash_fingerprint # target_hash)) * 100 / 64 AS similarity_score
  FROM
    notes n
  WHERE
    n.id != note_id_to_check
    AND bit_count(n.simhash_fingerprint # target_hash) <= similarity_threshold;
END;
$$ LANGUAGE plpgsql;
