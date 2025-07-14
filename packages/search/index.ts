// Search Package - Main Exports
// Export search components for the app

// Main search components
export { default as SmartSearchDropdown } from './src/components/SmartSearchDropdown';
export { default as AdvancedSmartSearch } from './src/components/AdvancedSmartSearch';
export { default as HybridSmartSearch } from './src/components/HybridSmartSearch';
export { default as IntelligentSearch } from './src/components/IntelligentSearch';
export { default as SmartSearch } from './src/components/SmartSearch';
export { default as PremiumSearchExperience } from './src/components/PremiumSearchExperience';

// Search UI Components
export { Button } from './src/components/ui/button';
export { Input } from './src/components/ui/input';
export { Badge } from './src/components/ui/badge';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from './src/components/ui/card';

// Search Hooks
export { useSearch } from './src/hooks/useSearch';

// Search Types
export type * from './src/types';

// Search Utils
export { cn } from './src/lib/utils';
