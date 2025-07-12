import { supabase } from '../../../../lib/supabase';
import { TransparencyData } from '../types';

/**
 * Fetches transparency information for a note
 * @param noteId - The ID of the note to check
 * @param userId - Optional user ID for authenticated requests
 * @returns Promise with transparency data
 */
export async function fetchNoteTransparency(
  noteId: number,
  userId?: string
): Promise<TransparencyData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('note-transparency', {
      body: {
        note_id: noteId,
        user_id: userId,
      },
    });

    if (error) {
      console.error('Error fetching transparency data:', error);
      return null;
    }

    return data as TransparencyData;
  } catch (error) {
    console.error('Error in fetchNoteTransparency:', error);
    return null;
  }
}

/**
 * Cache for transparency data to avoid repeated API calls
 */
const transparencyCache = new Map<number, { data: TransparencyData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches transparency data with caching
 * @param noteId - The note ID
 * @param userId - Optional user ID
 * @returns Cached or fresh transparency data
 */
export async function fetchNoteTransparencyWithCache(
  noteId: number,
  userId?: string
): Promise<TransparencyData | null> {
  const cacheKey = noteId;
  const cached = transparencyCache.get(cacheKey);
  
  // Return cached data if it's still fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  // Fetch fresh data
  const data = await fetchNoteTransparency(noteId, userId);
  
  // Cache the data if successful
  if (data) {
    transparencyCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }
  
  return data;
}

/**
 * Clears the transparency cache (useful for testing or when data changes)
 */
export function clearTransparencyCache(): void {
  transparencyCache.clear();
}
