import { supabase } from '../../lib/supabase';

export interface CloneDetectionResult {
  processed: boolean;
  clone_id?: number;
  status?: 'CLONE' | 'POTENTIAL_COPY' | 'SIMILAR';
  requires_alert?: boolean;
  message?: string;
}

export interface CloneWarningResult {
  warning_level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  similar_note_id?: number;
  similar_note_title?: string;
  original_user_id?: string;
  similarity_score?: number;
  message: string;
}

/**
 * Process clone detection between two notes
 */
export async function processCloneDetection(
  sourceNoteId: number,
  suspectNoteId: number,
  similarityScore: number
): Promise<CloneDetectionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('process-clone-detection', {
      body: {
        source_note_id: sourceNoteId,
        suspect_note_id: suspectNoteId,
        similarity_score: similarityScore,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error processing clone detection:', error);
    throw error;
  }
}

/**
 * Check for clone warning before saving a note
 */
export async function checkCloneWarning(
  userId: string,
  noteTitle: string,
  noteContent: string
): Promise<CloneWarningResult> {
  try {
    const { data, error } = await supabase.functions.invoke('check-clone-warning', {
      body: {
        user_id: userId,
        note_title: noteTitle,
        note_content: noteContent,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking clone warning:', error);
    throw error;
  }
}

/**
 * Get clone alerts for a user
 */
export async function getCloneAlertsForUser(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_clone_alerts_for_user', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clone alerts:', error);
    throw error;
  }
}

/**
 * Dismiss a clone alert
 */
export async function dismissCloneAlert(cloneId: number, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('dismiss_clone_alert', {
      p_clone_id: cloneId,
      p_user_id: userId,
    });

    if (error) throw error;
    return data === true;
  } catch (error) {
    console.error('Error dismissing clone alert:', error);
    throw error;
  }
}

/**
 * Calculate similarity score between two notes
 */
export async function calculateSimilarityScore(
  noteId1: number,
  noteId2: number
): Promise<number> {
  try {
    const { data, error } = await supabase.functions.invoke('note-similarity', {
      body: {
        note_id1: noteId1,
        note_id2: noteId2,
      },
    });

    if (error) throw error;
    return data.similarity_score;
  } catch (error) {
    console.error('Error calculating similarity score:', error);
    throw error;
  }
}

/**
 * Find similar notes using SimHash fingerprints
 */
export async function findSimilarNotes(
  noteId: number,
  similarityThreshold: number = 10
) {
  try {
    const { data, error } = await supabase.rpc('find_similar_notes', {
      note_id_to_check: noteId,
      similarity_threshold: similarityThreshold,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error finding similar notes:', error);
    throw error;
  }
}

/**
 * Comprehensive clone detection workflow
 * This function should be called after a note is saved to check for clones
 */
export async function runCloneDetectionWorkflow(noteId: number) {
  try {
    // Find similar notes using SimHash
    const similarNotes = await findSimilarNotes(noteId, 15); // Use a threshold of 15 for broader detection
    
    const detectionResults = [];
    
    // Process each similar note found
    for (const similarNote of similarNotes) {
      // Calculate precise similarity score using embeddings
      const similarityScore = await calculateSimilarityScore(noteId, similarNote.id);
      
      // Process the clone detection
      const result = await processCloneDetection(
        similarNote.id, // Original note (older one)
        noteId, // Suspect note (newer one)
        similarityScore
      );
      
      detectionResults.push({
        similarNote,
        similarityScore,
        detectionResult: result,
      });
    }
    
    return detectionResults;
  } catch (error) {
    console.error('Error in clone detection workflow:', error);
    throw error;
  }
}

// Utility functions for thresholds
export const CLONE_THRESHOLDS = {
  CLONE: 90,
  POTENTIAL_COPY: 70,
  SIMILAR: 50,
} as const;

export function getCloneStatus(score: number): 'CLONE' | 'POTENTIAL_COPY' | 'SIMILAR' | null {
  if (score >= CLONE_THRESHOLDS.CLONE) return 'CLONE';
  if (score >= CLONE_THRESHOLDS.POTENTIAL_COPY) return 'POTENTIAL_COPY';
  if (score >= CLONE_THRESHOLDS.SIMILAR) return 'SIMILAR';
  return null;
}
