// Search Feature - Main Exports
// This file provides easy access to all search functionality

// Main Search Components
export { default as AdvancedSmartSearch } from './components/AdvancedSmartSearch';
export { default as HybridSmartSearch } from './components/HybridSmartSearch';
export { default as PremiumSearchExperience } from './components/PremiumSearchExperience';
export { default as SmartSearch } from './components/SmartSearch';
export { default as IntelligentSearch } from './components/IntelligentSearch';
export { default as IntelligentSearchFixed } from './components/IntelligentSearchFixed';

// Search Types
export * from './src/types/index';

// Search Utilities (when created)
// export * from './utils';

// Search Hooks
export { useSearch } from './src/hooks/useSearch';

// Re-export the main UI component from root for convenience
export { default as SmartSearchDropdown } from 'packages/search/components/SmartSearchDropdown';
