// Homepage Feature - Main Exports
// Export main components and functionality from the homepage feature

// Main Page Component
export { default as HomePage } from './src/page';

// Components
export { default as HeroSection } from './src/components/HeroSection';
export { default as SearchBar } from './src/components/SearchBar';
export { default as PersonalizedRecommendations } from './src/components/PersonalizedRecommendations';

// Hooks
export { useHomepage } from './src/hooks/useHomepage';

// Types
export type {
  HomepageState,
  HeroAction
} from './src/types';

// Utils
export * from './src/utils/search';
