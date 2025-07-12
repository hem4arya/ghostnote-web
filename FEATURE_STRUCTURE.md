# GhostNote Feature-Based Architecture

## Overview
This document describes the feature-based folder structure implemented in the GhostNote project to enable isolated development, improved maintainability, and scalable architecture.

## Project Structure

### Root Level
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Shared UI components (global usage)
├── features/              # Feature-specific modules
├── lib/                   # Shared utilities and configurations
└── utils/                 # General utility functions
```

### Feature Structure
Each feature follows a consistent structure:
```
src/features/{feature-name}/
├── components/            # Feature-specific components
├── hooks/                 # Feature-specific React hooks
├── utils/                 # Feature-specific utilities
├── types/                 # Feature-specific TypeScript types
├── index.ts              # Main exports for the feature
├── tsconfig.json         # Feature-specific TypeScript config
├── {feature}.code-workspace # VSCode workspace for isolated development
└── README.md             # Feature documentation
```

## Current Features

### 1. Search Feature (`src/features/search/`)
**Purpose**: Comprehensive search functionality including AI-powered search, filters, and advanced search capabilities.

**Components**:
- `AdvancedSmartSearch.tsx` - Advanced search interface with filters
- `HybridSmartSearch.tsx` - Hybrid search combining multiple strategies
- `PremiumSearchExperience.tsx` - Premium search features
- `SearchResultCard.tsx` - Individual search result component

**Hooks**:
- `useSearch.ts` - Search state management and API calls

**Types**:
- Search interfaces and type definitions

**Usage**:
```typescript
// Import the entire feature
import { PremiumSearchExperience, AdvancedSmartSearch } from '@/features/search';

// Or import specific components
import { useSearch } from '@/features/search/hooks/useSearch';
```

### 2. Transparency Feature (`src/features/transparency/`)
**Purpose**: Clone detection and content originality analysis with transparency badges for buyers.

**Components**:
- `CloneTransparencyBadge.tsx` - Main transparency UI badge
- `CloneTransparencyWrapper.tsx` - Production data wrapper
- `CloneTransparencyWrapperDev.tsx` - Development wrapper with mock data
- `CloneWarningModal.tsx` - Pre-publication similarity warning
- `CloneAlerts.tsx` - Creator notification dashboard

**Hooks**:
- `useTransparencyData.ts` - Transparency data fetching and state

**Utils**:
- `transparencyApi.ts` - Backend API integration
- `helpers.ts` - Transparency helper functions
- `mockData.ts` - Mock data for testing

**Types**:
- Transparency interfaces and type definitions

**Usage**:
```typescript
// Import transparency components
import { CloneTransparencyBadge, CloneWarningModal } from '@/features/transparency';

// Use transparency hook
import { useTransparencyData } from '@/features/transparency/hooks/useTransparencyData';
```

### 2. Homepage Feature (`src/app/homepage/`)
**Purpose**: Homepage-specific components and logic.

**Components**:
- Feature-specific homepage components

## Shared Components (`src/components/`)
These are globally accessible UI components used across features:

- `SmartSearchDropdown.tsx` - Main search UI component (entry point)
- `TransparencyUI.tsx` - Simple transparency UI wrapper (entry point)
- UI components in `ui/` folder (button, card, input, etc.)
- Layout components (Header, Footer, Navbar, etc.)

## Development Workflow

### Isolated Feature Development

1. **Open Feature Workspace**:
   ```bash
   code src/features/search/search.code-workspace
   ```

2. **Development Commands**:
   ```bash
   # In feature workspace terminal
   npm run dev:search       # Start dev server for search feature
   npm run dev:transparency # Start dev server for transparency feature
   npm run build:search     # Build search feature
   npm run build:transparency # Build transparency feature
   npm run lint:search      # Lint search feature
   npm run lint:transparency # Lint transparency feature
   ```

3. **Hot Reload**: Changes to feature files will trigger hot reload when using the feature-specific dev commands.

### Adding New Features

1. **Create Feature Structure**:
   ```bash
   mkdir src/features/{feature-name}
   mkdir src/features/{feature-name}/{components,hooks,utils,types}
   ```

2. **Create Required Files**:
   - `index.ts` - Export main components/hooks
   - `tsconfig.json` - Feature-specific TypeScript config
   - `{feature}.code-workspace` - VSCode workspace
   - `README.md` - Feature documentation

3. **Update Main tsconfig.json** if needed for new path aliases.

## Import Guidelines

### Absolute Imports
Use absolute imports from `src` as the base:
```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { SearchHook } from '@/features/search/hooks/useSearch';

// ❌ Avoid relative imports for shared resources
import { Button } from '../../../components/ui/button';
```

### Feature Imports
```typescript
// From outside feature - use feature index
import { PremiumSearchExperience } from '@/features/search';

// Within feature - direct imports are fine
import { useSearch } from './hooks/useSearch';
import { SearchResultCard } from './components/SearchResultCard';
```

### External Libraries
For libraries outside `src` (like `lib/supabase.ts`):
```typescript
// From root level
import { supabase } from '@/lib/supabase';

// From deep feature folders, may need relative paths
import { supabase } from '../../../../lib/supabase';
```

## Configuration Files

### Root tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Feature tsconfig.json
Extends root config with feature-specific settings for isolated development.

## Best Practices

1. **Keep Features Independent**: Features should not directly import from other features
2. **Shared Logic**: Place truly shared logic in `src/lib/` or `src/utils/`
3. **UI Components**: Keep reusable UI components in `src/components/ui/`
4. **Feature Exports**: Always export main components through `index.ts`
5. **Documentation**: Keep feature README.md files updated
6. **Isolated Testing**: Use feature workspaces for focused development

## Backend Integration

### Supabase Functions
Search-related backend functions are located in:
```
supabase/functions/
├── search-notes/
├── hybrid-search/
└── advanced-search/
```

These functions are called from feature hooks and components using the supabase client.

## Migration Notes

### Completed
- ✅ Moved all search components to `src/features/search/components/`
- ✅ Moved all transparency components to `src/features/transparency/components/`
- ✅ Updated all import paths to use absolute imports
- ✅ Created feature-specific TypeScript configurations
- ✅ Set up VSCode workspaces for isolated development
- ✅ Fixed supabase client import paths
- ✅ Verified build and lint processes work correctly
- ✅ Created comprehensive documentation
- ✅ Created simple UI wrappers in root components for easy access

### Architecture Benefits
- **Isolation**: Each feature can be developed independently
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear separation of concerns
- **Team Development**: Multiple developers can work on different features simultaneously
- **Hot Reload**: Feature-specific development with fast feedback loops

## Troubleshooting

### Import Issues
If you encounter import issues:
1. Check if the path uses absolute imports (`@/`)
2. Verify the file exists in the expected location
3. Check the feature's `index.ts` exports
4. Ensure TypeScript configuration is correct

### Build Issues
1. Run `npm run build` to check for type errors
2. Verify all imports are correctly resolved
3. Check feature-specific tsconfig.json files

### Development Issues
1. Ensure you're using the correct workspace for feature development
2. Check that dev scripts are properly configured
3. Verify hot reload is working by making a small change
