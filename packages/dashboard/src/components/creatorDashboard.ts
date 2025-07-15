import { supabase } from '../lib/supabase';

export interface CreatorDashboardData {
  original_note: {
    id: number;
    title: string;
    created_at: string;
  };
  clones: CloneInfo[];
}

export interface CloneInfo {
  clone_id: number;
  note: {
    id: number;
    title: string;
    created_at: string;
  };
  cloner: {
    user_id: string;
    username: string;
    is_anonymous: boolean;
  };
  similarity_score: number;
  status: "CLONE" | "POTENTIAL_COPY";
  creator_action: "PENDING" | "ALLOWED" | "DENIED" | "TAKEDOWN_REQUESTED";
  resale_allowed: boolean | null;
  detected_at: string;
  last_action_at: string | null;
}

export interface CreatorStats {
  total_notes_created: number;
  total_clones_detected: number;
  high_similarity_clones: number;
  pending_actions: number;
  takedown_requests: number;
  allowed_resales: number;
  denied_resales: number;
}

export interface CloneActionHistory {
  action_id: number;
  action_type: string;
  message: string;
  created_at: string;
  creator_username: string;
}

/**
 * Get creator clone dashboard data
 */
export async function getCreatorCloneDashboard(
  creatorUserId: string
): Promise<CreatorDashboardData[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "creator-clone-dashboard",
      {
        body: {
          action: "get_dashboard",
          creator_user_id: creatorUserId,
        },
      }
    );

    if (error) throw error;
    return data.data || [];
  } catch (error) {
    console.error("Error fetching creator dashboard:", error);
    throw error;
  }
}

/**
 * Get creator clone statistics
 */
export async function getCreatorCloneStats(
  creatorUserId: string
): Promise<CreatorStats> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "creator-clone-dashboard",
      {
        body: {
          action: "get_stats",
          creator_user_id: creatorUserId,
        },
      }
    );

    if (error) throw error;
    return data.stats;
  } catch (error) {
    console.error("Error fetching creator stats:", error);
    throw error;
  }
}

/**
 * Handle creator action on a clone
 */
export async function handleCreatorCloneAction(
  creatorUserId: string,
  cloneId: number,
  actionType:
    | "TAKEDOWN_REQUESTED"
    | "RESALE_ALLOWED"
    | "RESALE_DENIED"
    | "CLONE_DISMISSED",
  message?: string,
  resaleDecision?: boolean
): Promise<{ success: boolean; message: string; action_id: number }> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "creator-clone-dashboard",
      {
        body: {
          action: "handle_action",
          creator_user_id: creatorUserId,
          clone_id: cloneId,
          action_type: actionType,
          message,
          resale_decision: resaleDecision,
        },
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error handling creator action:", error);
    throw error;
  }
}

/**
 * Send message to cloner
 */
export async function sendMessageToCloner(
  creatorUserId: string,
  cloneId: number,
  messageSubject: string,
  messageBody: string
): Promise<{ success: boolean; message: string; cloner_user_id: string }> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "creator-clone-dashboard",
      {
        body: {
          action: "send_message",
          creator_user_id: creatorUserId,
          clone_id: cloneId,
          message_subject: messageSubject,
          message_body: messageBody,
        },
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending message to cloner:", error);
    throw error;
  }
}

/**
 * Get clone action history
 */
export async function getCloneActionHistory(
  cloneId: number
): Promise<CloneActionHistory[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "creator-clone-dashboard",
      {
        body: {
          action: "get_history",
          clone_id: cloneId,
        },
      }
    );

    if (error) throw error;
    return data.history || [];
  } catch (error) {
    console.error("Error fetching clone action history:", error);
    throw error;
  }
}

/**
 * Bulk actions for handling multiple clones
 */
export async function handleBulkCloneActions(
  creatorUserId: string,
  cloneIds: number[],
  actionType: "TAKEDOWN_REQUESTED" | "RESALE_ALLOWED" | "RESALE_DENIED",
  message?: string
): Promise<{ success: boolean; processed: number; errors: number }> {
  let processed = 0;
  let errors = 0;

  for (const cloneId of cloneIds) {
    try {
      await handleCreatorCloneAction(
        creatorUserId,
        cloneId,
        actionType,
        message,
        actionType === "RESALE_ALLOWED"
          ? true
          : actionType === "RESALE_DENIED"
          ? false
          : undefined
      );
      processed++;
    } catch (error) {
      console.error(`Error processing clone ${cloneId}:`, error);
      errors++;
    }
  }

  return {
    success: errors === 0,
    processed,
    errors,
  };
}

/**
 * Get clone severity classification
 */
export function getCloneSeverity(similarityScore: number): {
  level: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  color: string;
} {
  if (similarityScore >= 90) {
    return {
      level: "HIGH",
      description: "Very High Similarity - Likely Clone",
      color: "bg-red-100 text-red-800",
    };
  } else if (similarityScore >= 80) {
    return {
      level: "MEDIUM",
      description: "High Similarity - Potential Copy",
      color: "bg-orange-100 text-orange-800",
    };
  } else {
    return {
      level: "LOW",
      description: "Moderate Similarity - Similar Content",
      color: "bg-yellow-100 text-yellow-800",
    };
  }
}

/**
 * Generate default message templates
 */
export function getMessageTemplates(
  originalTitle: string,
  cloneTitle: string,
  similarityScore: number
) {
  return {
    friendly: {
      subject: `Regarding similarity between our notes`,
      body: `Hello,

I noticed that your note "${cloneTitle}" appears to be similar (${similarityScore}% match) to my note "${originalTitle}".

I wanted to reach out to discuss this and see if we can work together to resolve any concerns.

Best regards`,
    },
    formal: {
      subject: `Copyright concern regarding "${cloneTitle}"`,
      body: `Dear User,

I am writing to inform you that your note titled "${cloneTitle}" appears to contain content that is ${similarityScore}% similar to my original work "${originalTitle}".

I would appreciate the opportunity to discuss this matter with you to reach an amicable resolution.

Thank you for your attention to this matter.

Sincerely`,
    },
    takedown: {
      subject: `Takedown request for "${cloneTitle}"`,
      body: `Dear User,

Your note "${cloneTitle}" contains content that is ${similarityScore}% similar to my original copyrighted work "${originalTitle}".

I am formally requesting that you remove this content as it appears to infringe upon my intellectual property rights.

Please respond within 7 days to confirm removal or to discuss this matter further.

Regards`,
    },
  };
}

/**
 * Calculate dashboard metrics
 */
export function calculateDashboardMetrics(
  dashboardData: CreatorDashboardData[]
) {
  const totalClones = dashboardData.reduce(
    (sum, note) => sum + note.clones.length,
    0
  );
  const highSimilarityClones = dashboardData.reduce(
    (sum, note) =>
      sum + note.clones.filter((clone) => clone.similarity_score >= 90).length,
    0
  );
  const pendingActions = dashboardData.reduce(
    (sum, note) =>
      sum +
      note.clones.filter((clone) => clone.creator_action === "PENDING").length,
    0
  );
  const takedownRequests = dashboardData.reduce(
    (sum, note) =>
      sum +
      note.clones.filter(
        (clone) => clone.creator_action === "TAKEDOWN_REQUESTED"
      ).length,
    0
  );

  return {
    totalClones,
    highSimilarityClones,
    pendingActions,
    takedownRequests,
    averageSimilarity:
      totalClones > 0
        ? dashboardData.reduce(
            (sum, note) =>
              sum +
              note.clones.reduce(
                (cloneSum, clone) => cloneSum + clone.similarity_score,
                0
              ),
            0
          ) / totalClones
        : 0,
  };
}
