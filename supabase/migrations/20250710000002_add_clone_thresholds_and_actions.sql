-- Create enum for clone status
CREATE TYPE clone_status AS ENUM ('CLONE', 'POTENTIAL_COPY', 'SIMILAR', 'DISMISSED');

-- Create clones table to store relationships between notes
CREATE TABLE note_clones (
    id BIGSERIAL PRIMARY KEY,
    source_note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    suspect_note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    similarity_score INTEGER NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 100),
    status clone_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    is_dismissed BOOLEAN DEFAULT FALSE,
    UNIQUE(source_note_id, suspect_note_id)
);

-- Create indexes for efficient queries
CREATE INDEX idx_note_clones_source ON note_clones(source_note_id);
CREATE INDEX idx_note_clones_suspect ON note_clones(suspect_note_id);
CREATE INDEX idx_note_clones_status ON note_clones(status);
CREATE INDEX idx_note_clones_score ON note_clones(similarity_score);

-- Function to classify clone severity based on similarity score
CREATE OR REPLACE FUNCTION classify_clone_severity(similarity_score INTEGER)
RETURNS clone_status AS $$
BEGIN
    IF similarity_score >= 90 THEN
        RETURN 'CLONE';
    ELSIF similarity_score >= 70 THEN
        RETURN 'POTENTIAL_COPY';
    ELSIF similarity_score >= 50 THEN
        RETURN 'SIMILAR';
    ELSE
        RETURN NULL; -- No classification needed for scores below 50
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to process and store clone detection results
CREATE OR REPLACE FUNCTION process_clone_detection(
    p_source_note_id BIGINT,
    p_suspect_note_id BIGINT,
    p_similarity_score INTEGER
)
RETURNS TABLE (
    clone_id BIGINT,
    status clone_status,
    requires_alert BOOLEAN,
    source_user_id UUID,
    suspect_user_id UUID
) AS $$
DECLARE
    v_status clone_status;
    v_source_user UUID;
    v_suspect_user UUID;
    v_clone_id BIGINT;
    v_requires_alert BOOLEAN := FALSE;
BEGIN
    -- Classify the severity
    v_status := classify_clone_severity(p_similarity_score);
    
    -- Only process if score is 50 or above
    IF v_status IS NULL THEN
        RETURN;
    END IF;
    
    -- Get user IDs for both notes
    SELECT user_id INTO v_source_user FROM notes WHERE id = p_source_note_id;
    SELECT user_id INTO v_suspect_user FROM notes WHERE id = p_suspect_note_id;
    
    -- Don't flag if same user owns both notes
    IF v_source_user = v_suspect_user THEN
        RETURN;
    END IF;
    
    -- Determine if alert is required
    v_requires_alert := (v_status IN ('CLONE', 'POTENTIAL_COPY'));
    
    -- Insert or update the clone relationship
    INSERT INTO note_clones (source_note_id, suspect_note_id, similarity_score, status)
    VALUES (p_source_note_id, p_suspect_note_id, p_similarity_score, v_status)
    ON CONFLICT (source_note_id, suspect_note_id) 
    DO UPDATE SET 
        similarity_score = EXCLUDED.similarity_score,
        status = EXCLUDED.status,
        updated_at = NOW()
    RETURNING id INTO v_clone_id;
    
    -- Return the results
    RETURN QUERY SELECT 
        v_clone_id,
        v_status,
        v_requires_alert,
        v_source_user,
        v_suspect_user;
END;
$$ LANGUAGE plpgsql;

-- Function to get clone alerts for a user
CREATE OR REPLACE FUNCTION get_clone_alerts_for_user(p_user_id UUID)
RETURNS TABLE (
    clone_id BIGINT,
    source_note_id BIGINT,
    source_note_title TEXT,
    suspect_note_id BIGINT,
    suspect_note_title TEXT,
    suspect_user_id UUID,
    similarity_score INTEGER,
    status clone_status,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.source_note_id,
        sn.title as source_note_title,
        nc.suspect_note_id,
        tn.title as suspect_note_title,
        tn.user_id as suspect_user_id,
        nc.similarity_score,
        nc.status,
        nc.created_at
    FROM note_clones nc
    JOIN notes sn ON nc.source_note_id = sn.id
    JOIN notes tn ON nc.suspect_note_id = tn.id
    WHERE sn.user_id = p_user_id
    AND nc.status IN ('CLONE', 'POTENTIAL_COPY')
    AND nc.is_dismissed = FALSE
    ORDER BY nc.similarity_score DESC, nc.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a user is about to clone someone's note
CREATE OR REPLACE FUNCTION check_potential_clone_warning(
    p_user_id UUID,
    p_note_content TEXT,
    p_note_title TEXT
)
RETURNS TABLE (
    warning_level TEXT,
    similar_note_id BIGINT,
    similar_note_title TEXT,
    original_user_id UUID,
    similarity_score INTEGER
) AS $$
DECLARE
    v_temp_hash BIT(64);
    v_similar_note RECORD;
    v_max_score INTEGER := 0;
    v_warning_level TEXT := 'NONE';
BEGIN
    -- Generate a temporary hash for the content being checked
    -- Note: This would need to be implemented with actual SimHash logic
    -- For now, we'll use a simplified approach
    
    -- Find the most similar existing note from other users
    FOR v_similar_note IN
        SELECT n.id, n.title, n.user_id,
               -- Simplified similarity calculation - replace with actual SimHash comparison
               CASE 
                   WHEN LENGTH(p_note_content) > 0 THEN
                       LEAST(100, (100 - ABS(LENGTH(n.body) - LENGTH(p_note_content)) * 100 / GREATEST(LENGTH(n.body), LENGTH(p_note_content))))
                   ELSE 0
               END as score
        FROM notes n
        WHERE n.user_id != p_user_id
        AND n.simhash_fingerprint IS NOT NULL
    LOOP
        IF v_similar_note.score > v_max_score THEN
            v_max_score := v_similar_note.score;
            
            -- Determine warning level
            IF v_max_score >= 90 THEN
                v_warning_level := 'HIGH';
            ELSIF v_max_score >= 70 THEN
                v_warning_level := 'MEDIUM';
            ELSIF v_max_score >= 50 THEN
                v_warning_level := 'LOW';
            END IF;
            
            -- Return the most similar note if it meets threshold
            IF v_max_score >= 50 THEN
                RETURN QUERY SELECT 
                    v_warning_level,
                    v_similar_note.id,
                    v_similar_note.title,
                    v_similar_note.user_id,
                    v_max_score;
            END IF;
        END IF;
    END LOOP;
    
    -- Return no warning if no similar notes found
    IF v_max_score < 50 THEN
        RETURN QUERY SELECT 'NONE'::TEXT, NULL::BIGINT, NULL::TEXT, NULL::UUID, 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to dismiss a clone alert
CREATE OR REPLACE FUNCTION dismiss_clone_alert(
    p_clone_id BIGINT,
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_source_user UUID;
BEGIN
    -- Check if the user owns the source note
    SELECT sn.user_id INTO v_source_user
    FROM note_clones nc
    JOIN notes sn ON nc.source_note_id = sn.id
    WHERE nc.id = p_clone_id;
    
    IF v_source_user = p_user_id THEN
        UPDATE note_clones 
        SET is_dismissed = TRUE, 
            reviewed_by = p_user_id,
            reviewed_at = NOW()
        WHERE id = p_clone_id;
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
