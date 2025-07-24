/**
 * Theme System Exports
 * Centralized exports for all theme-related components and utilities
 */

// Theme Hook and Provider
export { useTheme, ThemeProvider } from './useTheme';

// Theme Components
export { ThemeToggle } from './ThemeToggle';

// Theme Utilities
export {
  type Theme,
  THEME_CONFIG,
  CSS_VARIABLES,
  getResolvedTheme,
  isDarkTheme,
  isLightTheme,
  getCSSVariable,
  setCSSVariable,
  applyTheme,
  THEME_TRANSITIONS,
  THEME_MEDIA_QUERIES,
  THEME_VALIDATION,
  THEME_DEBUG,
} from './theme-utils';

// CSS Import (for apps that need to import the CSS)
export const THEME_CSS_PATH = './theme.css';
