import { createClient } from '@supabase/supabase-js';

export interface AccessCheckResult {
  hasAccess: boolean;
  accessType: 'owner' | 'purchaser' | 'none';
  reason?: string;
  note?: {
    id: number;
    title: string;
    creator_id: string;
    price: number;
    is_premium: boolean;
  };
  purchase?: {
    id: string;
    purchased_at: string;
    amount_paid: number;
  };
}

export interface AccessControlOptions {
  requireAuth?: boolean;
  allowOwner?: boolean;
  allowPurchaser?: boolean;
  contentType?: 'note' | 'course' | 'template' | 'premium_content';
}

/**
 * Checks if a user has access to premium content
 * @param contentId - The ID of the content to check access for
 * @param userId - The ID of the user requesting access
 * @param options - Access control configuration options
 * @returns Promise with access check result
 */
export async function checkContentAccess(
  contentId: number,
  userId?: string,
  options: AccessControlOptions = {}
): Promise<AccessCheckResult> {
  const {
    requireAuth = true,
    allowOwner = true,
    allowPurchaser = true
  } = options;

  // Create Supabase client with service role for server-side access checks
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Check if authentication is required
    if (requireAuth && !userId) {
      return {
        hasAccess: false,
        accessType: 'none',
        reason: 'Authentication required'
      };
    }

    // 2. Get content information
    const { data: contentData, error: contentError } = await supabase
      .from('notes')
      .select('id, title, creator_id, price, is_premium')
      .eq('id', contentId)
      .single();

    if (contentError || !contentData) {
      return {
        hasAccess: false,
        accessType: 'none',
        reason: 'Content not found'
      };
    }

    // 3. Check if content is free (no access control needed)
    if (!contentData.is_premium || contentData.price === 0) {
      return {
        hasAccess: true,
        accessType: 'none',
        note: contentData
      };
    }

    // 4. Check if user is the creator/owner
    if (allowOwner && userId === contentData.creator_id) {
      return {
        hasAccess: true,
        accessType: 'owner',
        note: contentData
      };
    }

    // 5. Check if user has purchased the content
    if (allowPurchaser && userId) {
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .select('id, purchased_at, amount_paid, status')
        .eq('user_id', userId)
        .eq('note_id', contentId)
        .eq('status', 'completed')
        .order('purchased_at', { ascending: false })
        .limit(1)
        .single();

      if (!purchaseError && purchaseData) {
        return {
          hasAccess: true,
          accessType: 'purchaser',
          note: contentData,
          purchase: {
            id: purchaseData.id,
            purchased_at: purchaseData.purchased_at,
            amount_paid: purchaseData.amount_paid
          }
        };
      }
    }

    // 6. No access granted
    return {
      hasAccess: false,
      accessType: 'none',
      reason: 'Purchase required to access this premium content',
      note: contentData
    };

  } catch (error) {
    console.error('Access control check failed:', error);
    return {
      hasAccess: false,
      accessType: 'none',
      reason: 'Access verification failed'
    };
  }
}

/**
 * Middleware function to check access before rendering protected content
 * @param contentId - Content ID to check
 * @param userId - User ID from auth
 * @param options - Access control options
 * @returns Access result or throws redirect error
 */
export async function enforceContentAccess(
  contentId: number,
  userId?: string,
  options: AccessControlOptions = {}
): Promise<AccessCheckResult> {
  const result = await checkContentAccess(contentId, userId, options);
  
  if (!result.hasAccess) {
    // Log access attempt for security monitoring
    console.warn('Unauthorized access attempt:', {
      contentId,
      userId: userId || 'anonymous',
      reason: result.reason,
      timestamp: new Date().toISOString()
    });
  }
  
  return result;
}

/**
 * React hook for client-side access control
 * @param contentId - Content ID to check
 * @param options - Access control options
 * @returns Access state and helper functions
 */
export function useContentAccess(
  contentId: number,
  options: AccessControlOptions = {}
) {
  const [accessResult, setAccessResult] = React.useState<AccessCheckResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      setError(null);
      
      try {
        // Get current user from auth
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data: { user } } = await supabase.auth.getUser();
        
        // Call our access control function
        const result = await checkContentAccess(contentId, user?.id, options);
        setAccessResult(result);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Access check failed');
      } finally {
        setLoading(false);
      }
    }

    if (contentId) {
      checkAccess();
    }
  }, [contentId, options]);

  return {
    accessResult,
    loading,
    error,
    hasAccess: accessResult?.hasAccess || false,
    accessType: accessResult?.accessType || 'none',
    isOwner: accessResult?.accessType === 'owner',
    isPurchaser: accessResult?.accessType === 'purchaser'
  };
}

// Import React for the hook
import React from 'react';
