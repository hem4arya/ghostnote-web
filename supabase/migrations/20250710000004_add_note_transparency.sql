-- Migration: Add note transparency functionality
-- This migration adds the ability to get transparency information about notes for buyers

CREATE OR REPLACE FUNCTION get_note_transparency_info(
    p_note_id INTEGER,
    p_requesting_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    is_clone BOOLEAN,
    similarity_score DECIMAL,
    original_note_id INTEGER,
    original_note_title TEXT,
    original_creator_id UUID,
    original_creator_username TEXT,
    original_creator_is_public BOOLEAN,
    original_created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the note is flagged as a clone in our clones table
    RETURN QUERY
    SELECT 
        TRUE as is_clone,
        c.similarity_score,
        c.original_note_id,
        on.title as original_note_title,
        on.user_id as original_creator_id,
        COALESCE(ou.username, 'Anonymous') as original_creator_username,
        COALESCE(ou.is_public, false) as original_creator_is_public,
        on.created_at as original_created_at
    FROM clones c
    JOIN notes on ON c.original_note_id = on.id
    LEFT JOIN auth.users ou ON on.user_id = ou.id
    WHERE c.clone_note_id = p_note_id
    AND c.status IN ('detected', 'confirmed')
    ORDER BY c.similarity_score DESC
    LIMIT 1;
    
    -- If no clone relationship found, this is considered original
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            FALSE as is_clone,
            0.0::DECIMAL as similarity_score,
            NULL::INTEGER as original_note_id,
            NULL::TEXT as original_note_title,
            NULL::UUID as original_creator_id,
            NULL::TEXT as original_creator_username,
            FALSE as original_creator_is_public,
            NULL::TIMESTAMP WITH TIME ZONE as original_created_at;
    END IF;
END;
$$;

-- Grant execute permission to authenticated users and anon
GRANT EXECUTE ON FUNCTION get_note_transparency_info(INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_note_transparency_info(INTEGER, UUID) TO anon;

-- Create an index for faster transparency lookups
CREATE INDEX IF NOT EXISTS idx_clones_transparency_lookup 
ON clones (clone_note_id, status, similarity_score DESC);

-- Add transparency-related columns to notes table if they don't exist
DO $$ 
BEGIN
    -- Add a column to track if transparency info should be shown for this note
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notes' AND column_name = 'show_transparency') THEN
        ALTER TABLE notes ADD COLUMN show_transparency BOOLEAN DEFAULT true;
    END IF;
    
    -- Add a column to track if creator wants to hide transparency (for privacy)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notes' AND column_name = 'hide_transparency') THEN
        ALTER TABLE notes ADD COLUMN hide_transparency BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create a view for public transparency information (respects privacy settings)
CREATE OR REPLACE VIEW note_transparency_public AS
SELECT 
    n.id as note_id,
    n.title,
    n.created_at,
    n.price,
    CASE 
        WHEN n.hide_transparency = true THEN false
        WHEN c.clone_note_id IS NOT NULL THEN true
        ELSE false
    END as is_clone,
    CASE 
        WHEN n.hide_transparency = true THEN NULL
        ELSE c.similarity_score
    END as similarity_score,
    CASE 
        WHEN n.hide_transparency = true THEN NULL
        ELSE c.original_note_id
    END as original_note_id,
    CASE 
        WHEN n.hide_transparency = true THEN NULL
        WHEN on_title.user_id IS NOT NULL AND ou.is_public = true THEN on_title.title
        ELSE NULL
    END as original_note_title,
    CASE 
        WHEN n.hide_transparency = true THEN NULL
        WHEN ou.is_public = true THEN ou.username
        ELSE NULL
    END as original_creator_username
FROM notes n
LEFT JOIN clones c ON n.id = c.clone_note_id AND c.status IN ('detected', 'confirmed')
LEFT JOIN notes on_title ON c.original_note_id = on_title.id
LEFT JOIN auth.users ou ON on_title.user_id = ou.id
WHERE n.show_transparency = true;

-- Grant select permission on the view
GRANT SELECT ON note_transparency_public TO authenticated;
GRANT SELECT ON note_transparency_public TO anon;

-- Add helpful comments
COMMENT ON FUNCTION get_note_transparency_info IS 'Returns transparency information about a note including clone status and original source details';
COMMENT ON VIEW note_transparency_public IS 'Public view of note transparency information respecting privacy settings';
COMMENT ON COLUMN notes.show_transparency IS 'Whether to show transparency information for this note to buyers';
COMMENT ON COLUMN notes.hide_transparency IS 'Whether the creator has chosen to hide transparency information (privacy setting)';
