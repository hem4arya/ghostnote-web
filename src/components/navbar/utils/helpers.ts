/**
 * Determines if the back button should be shown.
 */
export const shouldShowBackButton = (pathname: string): boolean => {
  return pathname !== '/';
};

/**
 * Get the appropriate back navigation URL based on current path.
 * This function now relies on router.back() for more natural navigation.
 */
// This function is kept for logic reference but router.back() is preferred.
export const getBackUrl = (pathname: string): string => {
  if (pathname?.startsWith('/notes/')) {
    return '/dashboard';
  }
  if (pathname?.startsWith('/dashboard')) {
    return '/';
  }
  return '/';
};

/**
 * Get search placeholder text based on current context.
 */
export const getSearchPlaceholder = (pathname: string): string => {
  if (pathname?.startsWith('/dashboard')) {
    return 'Search your notes...';
  }
  if (pathname?.startsWith('/notes/')) {
    return 'Search within this note...';
  }
  return 'Search public notes, creators, or tags...';
};