import { supabase } from "@lib/supabase";

export interface TransparencyData {
  note_id: number;
  is_clone: boolean;
  originality_score: number;
  originality_level: "Original" | "Modified" | "Heavily Inspired" | "Clone";
  similarity_score?: number;
  original_note?: {
    id: number;
    title: string;
    creator_id: string;
    creator_username?: string;
    creator_is_public: boolean;
    created_at: string;
  };
  transparency_badge: {
    text: string;
    severity: "none" | "low" | "medium" | "high";
    show_source_link: boolean;
  };
  buyer_message: {
    title: string;
    description: string;
    recommendation: string;
  };
}

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
    const { data, error } = await supabase.functions.invoke(
      "note-transparency",
      {
        body: {
          note_id: noteId,
          user_id: userId,
        },
      }
    );

    if (error) {
      console.error("Error fetching transparency data:", error);
      return null;
    }

    return data as TransparencyData;
  } catch (error) {
    console.error("Error in fetchNoteTransparency:", error);
    return null;
  }
}

/**
 * Determines if transparency information should be shown prominently
 * @param transparencyData - The transparency data to evaluate
 * @returns boolean indicating if transparency warning should be prominent
 */
export function shouldShowProminentTransparency(
  transparencyData: TransparencyData
): boolean {
  if (!transparencyData.is_clone) return false;

  // Show prominent transparency for high similarity scores
  return transparencyData.similarity_score
    ? transparencyData.similarity_score >= 70
    : false;
}

/**
 * Gets user-friendly text for originality level
 * @param level - The originality level
 * @returns User-friendly description
 */
export function getOriginalityDescription(level: string): string {
  switch (level) {
    case "Original":
      return "This content was created from scratch by the author.";
    case "Modified":
      return "This content significantly builds upon and modifies existing material.";
    case "Heavily Inspired":
      return "This content draws heavily from existing sources with some modifications.";
    case "Clone":
      return "This content is very similar to existing material with minimal changes.";
    default:
      return "Content originality assessment not available.";
  }
}

/**
 * Generates appropriate purchase warning text
 * @param transparencyData - The transparency data
 * @returns Warning text for buyers
 */
export function getPurchaseWarning(
  transparencyData: TransparencyData
): string | null {
  if (!transparencyData.is_clone) return null;

  const similarity = transparencyData.similarity_score || 0;

  if (similarity >= 90) {
    return "This content is nearly identical to existing material. Consider if this offers sufficient value for your needs.";
  }

  if (similarity >= 70) {
    return "This content is heavily based on existing material. Review the modifications before purchasing.";
  }

  if (similarity >= 50) {
    return "This content builds upon existing material with notable modifications.";
  }

  return null;
}

/**
 * Formats the transparency data for display in note cards
 * @param transparencyData - The transparency data
 * @returns Formatted display data
 */
export function formatTransparencyForCard(transparencyData: TransparencyData) {
  return {
    showBadge:
      transparencyData.is_clone || transparencyData.originality_score === 100,
    badgeText: transparencyData.transparency_badge.text,
    badgeVariant: transparencyData.transparency_badge.severity,
    originalityScore: transparencyData.originality_score,
    shouldWarn: shouldShowProminentTransparency(transparencyData),
    warningText: getPurchaseWarning(transparencyData),
  };
}

/**
 * Cache for transparency data to avoid repeated API calls
 */
const transparencyCache = new Map<
  number,
  { data: TransparencyData; timestamp: number }
>();
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

/**
 * Hook for React components to easily access transparency data
 */
export function useTransparencyData(noteId: number, userId?: string) {
  const [data, setData] = React.useState<TransparencyData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const transparencyData = await fetchNoteTransparencyWithCache(
          noteId,
          userId
        );
        setData(transparencyData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load transparency data"
        );
      } finally {
        setLoading(false);
      }
    }

    if (noteId) {
      loadData();
    }
  }, [noteId, userId]);

  return { data, loading, error };
}

// Import React for the hook
import React from "react";
