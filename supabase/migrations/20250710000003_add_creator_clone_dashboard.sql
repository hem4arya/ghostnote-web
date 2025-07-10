-- Add additional columns to note_clones table for creator actions
ALTER TABLE note_clones 
ADD COLUMN creator_action VARCHAR(20) DEFAULT 'PENDING' CHECK (creator_action IN ('PENDING', 'ALLOWED', 'DENIED', 'TAKEDOWN_REQUESTED')),
ADD COLUMN creator_message TEXT,
ADD COLUMN action_taken_at TIMESTAMPTZ,
ADD COLUMN resale_allowed BOOLEAN DEFAULT NULL; -- NULL = not decided, TRUE = allowed, FALSE = denied

-- Create table for creator actions and communications
CREATE TABLE creator_clone_actions (
    id BIGSERIAL PRIMARY KEY,
    clone_id BIGINT NOT NULL REFERENCES note_clones(id) ON DELETE CASCADE,
    creator_user_id UUID NOT NULL REFERENCES auth.users(id),
    action_type VARCHAR(30) NOT NULL CHECK (action_type IN ('MESSAGE_SENT', 'TAKEDOWN_REQUESTED', 'RESALE_ALLOWED', 'RESALE_DENIED', 'CLONE_DISMISSED')),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for efficient queries
CREATE INDEX idx_creator_clone_actions_clone_id ON creator_clone_actions(clone_id);
CREATE INDEX idx_creator_clone_actions_creator ON creator_clone_actions(creator_user_id);
CREATE INDEX idx_creator_clone_actions_type ON creator_clone_actions(action_type);

-- Function to get creator dashboard data
CREATE OR REPLACE FUNCTION get_creator_clone_dashboard(p_creator_user_id UUID)
RETURNS TABLE (
    original_note_id BIGINT,
    original_note_title TEXT,
    original_note_created_at TIMESTAMPTZ,
    clone_id BIGINT,
    clone_note_id BIGINT,
    clone_note_title TEXT,
    clone_note_created_at TIMESTAMPTZ,
    cloner_user_id UUID,
    cloner_username TEXT,
    cloner_is_anonymous BOOLEAN,
    similarity_score INTEGER,
    clone_status clone_status,
    creator_action VARCHAR(20),
    resale_allowed BOOLEAN,
    clone_detected_at TIMESTAMPTZ,
    last_action_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        on.id as original_note_id,
        on.title as original_note_title,
        on.created_at as original_note_created_at,
        nc.id as clone_id,
        cn.id as clone_note_id,
        cn.title as clone_note_title,
        cn.created_at as clone_note_created_at,
        cn.user_id as cloner_user_id,
        COALESCE(up.username, 'Anonymous') as cloner_username,
        CASE WHEN up.username IS NULL THEN TRUE ELSE FALSE END as cloner_is_anonymous,
        nc.similarity_score,
        nc.status as clone_status,
        nc.creator_action,
        nc.resale_allowed,
        nc.created_at as clone_detected_at,
        nc.action_taken_at as last_action_at
    FROM note_clones nc
    JOIN notes on ON nc.source_note_id = on.id
    JOIN notes cn ON nc.suspect_note_id = cn.id
    LEFT JOIN auth.users au ON cn.user_id = au.id
    LEFT JOIN user_profiles up ON au.id = up.user_id  -- Assuming you have a user_profiles table
    WHERE on.user_id = p_creator_user_id
    AND nc.similarity_score >= 70  -- Only show clones with 70%+ similarity
    AND nc.status IN ('CLONE', 'POTENTIAL_COPY')
    ORDER BY nc.similarity_score DESC, nc.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to handle creator actions on clones
CREATE OR REPLACE FUNCTION handle_creator_clone_action(
    p_clone_id BIGINT,
    p_creator_user_id UUID,
    p_action_type VARCHAR(30),
    p_message TEXT DEFAULT NULL,
    p_resale_decision BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    action_id BIGINT
) AS $$
DECLARE
    v_source_user_id UUID;
    v_action_id BIGINT;
    v_action_text VARCHAR(20);
BEGIN
    -- Verify the creator owns the source note
    SELECT sn.user_id INTO v_source_user_id
    FROM note_clones nc
    JOIN notes sn ON nc.source_note_id = sn.id
    WHERE nc.id = p_clone_id;
    
    IF v_source_user_id != p_creator_user_id THEN
        RETURN QUERY SELECT FALSE, 'Unauthorized: You do not own the original note'::TEXT, NULL::BIGINT;
        RETURN;
    END IF;
    
    -- Determine the creator_action based on action_type
    CASE p_action_type
        WHEN 'TAKEDOWN_REQUESTED' THEN v_action_text := 'TAKEDOWN_REQUESTED';
        WHEN 'RESALE_ALLOWED' THEN v_action_text := 'ALLOWED';
        WHEN 'RESALE_DENIED' THEN v_action_text := 'DENIED';
        WHEN 'CLONE_DISMISSED' THEN v_action_text := 'DISMISSED';
        ELSE v_action_text := 'PENDING';
    END CASE;
    
    -- Update the note_clones table
    UPDATE note_clones 
    SET 
        creator_action = v_action_text,
        creator_message = p_message,
        action_taken_at = NOW(),
        resale_allowed = CASE 
            WHEN p_action_type IN ('RESALE_ALLOWED', 'RESALE_DENIED') THEN p_resale_decision
            ELSE resale_allowed
        END
    WHERE id = p_clone_id;
    
    -- Log the action
    INSERT INTO creator_clone_actions (clone_id, creator_user_id, action_type, message)
    VALUES (p_clone_id, p_creator_user_id, p_action_type, p_message)
    RETURNING id INTO v_action_id;
    
    RETURN QUERY SELECT TRUE, 'Action recorded successfully'::TEXT, v_action_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get clone action history
CREATE OR REPLACE FUNCTION get_clone_action_history(p_clone_id BIGINT)
RETURNS TABLE (
    action_id BIGINT,
    action_type VARCHAR(30),
    message TEXT,
    created_at TIMESTAMPTZ,
    creator_username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cca.id as action_id,
        cca.action_type,
        cca.message,
        cca.created_at,
        COALESCE(up.username, 'Unknown User') as creator_username
    FROM creator_clone_actions cca
    LEFT JOIN auth.users au ON cca.creator_user_id = au.id
    LEFT JOIN user_profiles up ON au.id = up.user_id
    WHERE cca.clone_id = p_clone_id
    ORDER BY cca.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to send message to cloner (this would integrate with your messaging system)
CREATE OR REPLACE FUNCTION send_message_to_cloner(
    p_clone_id BIGINT,
    p_creator_user_id UUID,
    p_message_subject TEXT,
    p_message_body TEXT
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    cloner_user_id UUID
) AS $$
DECLARE
    v_source_user_id UUID;
    v_cloner_user_id UUID;
    v_clone_note_title TEXT;
BEGIN
    -- Verify ownership and get cloner info
    SELECT sn.user_id, cn.user_id, cn.title
    INTO v_source_user_id, v_cloner_user_id, v_clone_note_title
    FROM note_clones nc
    JOIN notes sn ON nc.source_note_id = sn.id
    JOIN notes cn ON nc.suspect_note_id = cn.id
    WHERE nc.id = p_clone_id;
    
    IF v_source_user_id != p_creator_user_id THEN
        RETURN QUERY SELECT FALSE, 'Unauthorized'::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Log the message action
    INSERT INTO creator_clone_actions (clone_id, creator_user_id, action_type, message, metadata)
    VALUES (
        p_clone_id, 
        p_creator_user_id, 
        'MESSAGE_SENT', 
        p_message_body,
        jsonb_build_object('subject', p_message_subject, 'clone_title', v_clone_note_title)
    );
    
    -- Here you would integrate with your actual messaging/notification system
    -- For now, we'll just return success
    
    RETURN QUERY SELECT TRUE, 'Message sent successfully'::TEXT, v_cloner_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get summary statistics for creator dashboard
CREATE OR REPLACE FUNCTION get_creator_clone_stats(p_creator_user_id UUID)
RETURNS TABLE (
    total_notes_created INTEGER,
    total_clones_detected INTEGER,
    high_similarity_clones INTEGER,
    pending_actions INTEGER,
    takedown_requests INTEGER,
    allowed_resales INTEGER,
    denied_resales INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM notes WHERE user_id = p_creator_user_id) as total_notes_created,
        (SELECT COUNT(*)::INTEGER 
         FROM note_clones nc 
         JOIN notes sn ON nc.source_note_id = sn.id 
         WHERE sn.user_id = p_creator_user_id AND nc.similarity_score >= 70) as total_clones_detected,
        (SELECT COUNT(*)::INTEGER 
         FROM note_clones nc 
         JOIN notes sn ON nc.source_note_id = sn.id 
         WHERE sn.user_id = p_creator_user_id AND nc.similarity_score >= 90) as high_similarity_clones,
        (SELECT COUNT(*)::INTEGER 
         FROM note_clones nc 
         JOIN notes sn ON nc.source_note_id = sn.id 
         WHERE sn.user_id = p_creator_user_id AND nc.creator_action = 'PENDING' AND nc.similarity_score >= 70) as pending_actions,
        (SELECT COUNT(*)::INTEGER 
         FROM note_clones nc 
         JOIN notes sn ON nc.source_note_id = sn.id 
         WHERE sn.user_id = p_creator_user_id AND nc.creator_action = 'TAKEDOWN_REQUESTED') as takedown_requests,
        (SELECT COUNT(*)::INTEGER 
         FROM note_clones nc 
         JOIN notes sn ON nc.source_note_id = sn.id 
         WHERE sn.user_id = p_creator_user_id AND nc.resale_allowed = TRUE) as allowed_resales,
        (SELECT COUNT(*)::INTEGER 
         FROM note_clones nc 
         JOIN notes sn ON nc.source_note_id = sn.id 
         WHERE sn.user_id = p_creator_user_id AND nc.resale_allowed = FALSE) as denied_resales;
END;
$$ LANGUAGE plpgsql;
