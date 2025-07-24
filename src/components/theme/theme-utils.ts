/**
 * Theme Utilities - Helper functions for theme management
 * Provides additional theme-related utilities and constants
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme configuration constants
 */
export const THEME_CONFIG = {
  STORAGE_KEY: 'ghostnote-theme',
  THEMES: ['light', 'dark', 'system'] as const,
  DEFAULT_THEME: 'dark' as Theme,
  ATTRIBUTE_NAME: 'data-theme',
} as const;

/**
 * CSS Custom Properties for theme variables
 */
export const CSS_VARIABLES = {
  // Colors
  BACKGROUND: '--background',
  FOREGROUND: '--foreground',
  PRIMARY: '--primary',
  SECONDARY: '--secondary',
  ACCENT: '--accent',
  
  // Ghost Colors
  GHOST_BLACK: '--ghost-black',
  GHOST_DARK: '--ghost-dark',
  GHOST_GRAY: '--ghost-gray',
  GHOST_PURPLE: '--ghost-purple',
  GHOST_NEON: '--ghost-neon',
  GHOST_RED: '--ghost-red',
  GHOST_CYAN: '--ghost-cyan',
  
  // Typography
  FONT_PRIMARY: '--font-primary',
  FONT_MONO: '--font-mono',
  FONT_DISPLAY: '--font-display',
  FONT_LOGO: '--font-logo',
  
  // Spacing
  SPACE_1: '--space-1',
  SPACE_2: '--space-2',
  SPACE_3: '--space-3',
  SPACE_4: '--space-4',
  SPACE_5: '--space-5',
  SPACE_6: '--space-6',
  SPACE_8: '--space-8',
  SPACE_10: '--space-10',
  SPACE_12: '--space-12',
  SPACE_16: '--space-16',
  
  // Transitions
  TRANSITION_FAST: '--transition-fast',
  TRANSITION_BASE: '--transition-base',
  TRANSITION_SLOW: '--transition-slow',
} as const;

/**
 * Get the resolved theme (converts 'system' to actual theme)
 */
export function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }
  return theme;
}

/**
 * Check if the current theme is dark
 */
export function isDarkTheme(theme: Theme): boolean {
  return getResolvedTheme(theme) === 'dark';
}

/**
 * Check if the current theme is light
 */
export function isLightTheme(theme: Theme): boolean {
  return getResolvedTheme(theme) === 'light';
}

/**
 * Get CSS variable value from the document
 */
export function getCSSVariable(variable: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

/**
 * Set CSS variable on the document
 */
export function setCSSVariable(variable: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(variable, value);
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  const resolvedTheme = getResolvedTheme(theme);
  document.documentElement.setAttribute(THEME_CONFIG.ATTRIBUTE_NAME, resolvedTheme);
}

/**
 * Theme transition utilities
 */
export const THEME_TRANSITIONS = {
  /**
   * Disable transitions temporarily (useful during theme switching)
   */
  disable(): void {
    if (typeof window === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
      }
    `;
    document.head.appendChild(style);
    
    // Re-enable after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.head.removeChild(style);
      });
    });
  },
  
  /**
   * Enable smooth theme transitions
   */
  enable(): void {
    if (typeof window === 'undefined') return;
    
    setCSSVariable('--theme-transition-duration', 'var(--transition-base)');
  },
};

/**
 * Theme media query utilities
 */
export const THEME_MEDIA_QUERIES = {
  /**
   * Create a media query listener for system theme changes
   */
  createSystemThemeListener(callback: (isDark: boolean) => void): MediaQueryList {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    
    return mediaQuery;
  },
  
  /**
   * Remove system theme listener
   */
  removeSystemThemeListener(mediaQuery: MediaQueryList, callback: (isDark: boolean) => void): void {
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };
    
    mediaQuery.removeEventListener('change', handler);
  },
};

/**
 * Theme validation utilities
 */
export const THEME_VALIDATION = {
  /**
   * Check if a theme value is valid
   */
  isValidTheme(theme: string): theme is Theme {
    return THEME_CONFIG.THEMES.includes(theme as Theme);
  },
  
  /**
   * Sanitize theme value (return default if invalid)
   */
  sanitizeTheme(theme: string | null): Theme {
    if (!theme || !this.isValidTheme(theme)) {
      return THEME_CONFIG.DEFAULT_THEME;
    }
    return theme;
  },
};

/**
 * Theme analytics/debugging utilities
 */
export const THEME_DEBUG = {
  /**
   * Log current theme state
   */
  logThemeState(theme: Theme): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Theme State:', {
        current: theme,
        resolved: getResolvedTheme(theme),
        isDark: isDarkTheme(theme),
        isLight: isLightTheme(theme),
        systemPreference: typeof window !== 'undefined' 
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : 'unknown',
      });
    }
  },
  
  /**
   * Validate theme CSS variables are loaded
   */
  validateThemeVariables(): boolean {
    if (typeof window === 'undefined') return false;
    
    const testVariable = getCSSVariable(CSS_VARIABLES.BACKGROUND);
    return testVariable !== '';
  },
};
