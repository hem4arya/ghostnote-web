import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { AccessCheckResult, AccessControlOptions } from '../types';
import { checkContentAccess } from '../utils/accessControl';

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
