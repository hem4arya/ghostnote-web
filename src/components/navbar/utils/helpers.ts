/**
 * Utility functions for Navbar component
 */

/**
 * Generates the navigation styles based on current route
 */
export const getNavStyles = (pathname: string) => {
  const isHomepage = pathname === '/';
  const isNoteDetailPage = pathname?.startsWith('/notes/');
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isAuthPage = pathname?.includes('/auth') || pathname?.includes('/login') || pathname?.includes('/signup');
  
  return {
    isHomepage,
    isNoteDetailPage,
    isDashboardPage,
    isAuthPage,
    shouldShowBackButton: !isHomepage
  };
};

/**
 * Cleans URL parameters
 */
export const cleanAuthParams = (url: string): string => {
  return url.replace(/[?&]auth=\w+/, '');
};

/**
 * Creates auth event data
 */
export const createAuthEvent = (mode: 'login' | 'signup') => {
  return new CustomEvent('open-auth-modal', { detail: { mode } });
};

/**
 * Validates search query
 */
export const isValidSearchQuery = (query: string): boolean => {
  return query.trim().length > 0;
};

/**
 * Gets responsive button sizes
 */
export const getButtonSizes = () => ({
  desktop: 'sm' as const,
  mobile: 'icon' as const
});

/**
 * Get the appropriate back navigation URL based on current path
 */
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
 * Determine navbar variant based on current path
 */
export const getNavbarVariant = (pathname: string): 'homepage' | 'dashboard' | 'note' | 'auth' | 'default' => {
  if (pathname === '/') return 'homepage';
  if (pathname?.startsWith('/dashboard')) return 'dashboard';
  if (pathname?.startsWith('/notes/')) return 'note';
  if (pathname?.includes('/auth') || pathname?.includes('/login') || pathname?.includes('/signup')) return 'auth';
  return 'default';
};

/**
 * Check if user should see authenticated features
 */
export const shouldShowAuthFeatures = (isAuthenticated: boolean, pathname: string): boolean => {
  const isAuthPage = pathname?.includes('/auth') || pathname?.includes('/login') || pathname?.includes('/signup');
  return isAuthenticated && !isAuthPage;
};

/**
 * Get search placeholder text based on current context
 */
export const getSearchPlaceholder = (pathname: string): string => {
  if (pathname?.startsWith('/dashboard')) {
    return 'Search your notes...';
  }
  if (pathname?.startsWith('/notes/')) {
    return 'Search in note...';
  }
  return 'Search notes, tags, or content...';
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};