import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { checkContentAccess } from '../utils/accessControl';
/**
 * React hook for client-side access control
 * @param contentId - Content ID to check
 * @param options - Access control options
 * @returns Access state and helper functions
 */
export function useContentAccess(contentId, options = {}) {
    const [accessResult, setAccessResult] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        async function checkAccess() {
            setLoading(true);
            setError(null);
            try {
                // Get current user from auth
                const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
                const { data: { user } } = await supabase.auth.getUser();
                // Call our access control function
                const result = await checkContentAccess(contentId, user === null || user === void 0 ? void 0 : user.id, options);
                setAccessResult(result);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Access check failed');
            }
            finally {
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
        hasAccess: (accessResult === null || accessResult === void 0 ? void 0 : accessResult.hasAccess) || false,
        accessType: (accessResult === null || accessResult === void 0 ? void 0 : accessResult.accessType) || 'none',
        isOwner: (accessResult === null || accessResult === void 0 ? void 0 : accessResult.accessType) === 'owner',
        isPurchaser: (accessResult === null || accessResult === void 0 ? void 0 : accessResult.accessType) === 'purchaser'
    };
}
//# sourceMappingURL=useContentAccess.js.map