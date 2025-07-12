# GhostNote Project Structure

This document outlines the reorganized structure of the GhostNote web application, following feature-based architecture patterns for better maintainability and scalability.

## Overview

The project has been refactored from a mixed structure to a clean, feature-based organization where related functionality is grouped together by domain/feature rather than by file type.

## Feature-Based Structure

### `/src/features/`

All major features are organized under this directory, with each feature containing its own components, hooks, utilities, types, and data.

#### `/src/features/access-control/`
- **Purpose**: Content access control and permission management
- **Components**: `AccessControl.tsx` - Handles content viewing permissions
- **Hooks**: `useContentAccess.ts` - Manages access state and permissions
- **Utils**: 
  - `accessControl.ts` - Core access control logic
  - `mockAccessControl.ts` - Mock implementation for development
- **Types**: Access control interfaces and type definitions

#### `/src/features/notes/`
- **Purpose**: Note management, editing, and display functionality
- **Components**:
  - `NoteCard.tsx` - Note preview cards
  - `NoteDetail.tsx` - Full note view
  - `NoteEditor.tsx` - Note editing interface
  - `CreateNoteForm.tsx` - New note creation
  - **Editor Components** (`/editor/`):
    - `EditorHeader.tsx` - Editor toolbar header
    - `FormattingToolbar.tsx` - Text formatting controls
    - `ImageToolbox.tsx` - Image handling tools
    - `WordCountWidget.tsx` - Text statistics display
- **Hooks**:
  - `useFormatting.ts` - Text formatting logic
  - `useResponsive.ts` - Responsive behavior
  - `useImageState.ts` - Image state management
  - `useImageInteraction.ts` - Image interaction handling
- **Data**: `sampleNotes.ts` - Sample note data

#### `/src/features/search/`
- **Purpose**: Search functionality and smart search features
- **Components**:
  - `SmartSearch.tsx` - Basic smart search
  - `IntelligentSearch.tsx` - Advanced intelligent search
  - `IntelligentSearchFixed.tsx` - Enhanced search implementation

#### `/src/features/auth/`
- **Purpose**: Authentication and user management
- **Components**:
  - `AuthForm.tsx` - Login/signup forms
  - `AuthModal.tsx` - Authentication modal dialogs

#### `/src/features/reader/`
- **Purpose**: Content reading and viewing functionality
- **Components**:
  - `ReaderView.tsx` - Content reader interface

#### `/src/features/clone-detection/` & `/src/features/transparency/`
- **Purpose**: Content protection features (auto-generated structure for future development)

### `/src/components/`

Shared, reusable components organized by type:

#### `/src/components/layout/`
- `Navbar.tsx` - Main navigation
- `Footer.tsx` - Site footer

#### `/src/components/home/`
- `HomePage.tsx` - Landing page component
- `HeroSection.tsx` - Hero section component

#### `/src/components/pages/home/`
- `PersonalizedRecommendations.tsx` - User recommendations

#### `/src/components/ui/`
- Shared UI components (buttons, cards, inputs, etc.)

#### Other Shared Components
- `DashboardTabs.tsx` - Dashboard navigation
- `AdvancedSmartSearch.tsx` - Advanced search interface
- `SmartSearchDropdown.tsx` - Search dropdown component

### `/src/app/`

Next.js app router pages following the new structure:

- `page.tsx` - Home page
- `layout.tsx` - Root layout
- `/create/page.tsx` - Note creation page
- `/dashboard/page.tsx` - User dashboard
- `/notes/[id]/page.tsx` - Dynamic note viewing
- `/reader/[id]/page.tsx` - Dynamic content reading

### `/src/utils/`

Utility functions organized by purpose:

#### `/src/utils/formatting/`
- `formatNotes.ts` - Note formatting utilities
- `textUtils.ts` - Text manipulation helpers

### `/src/lib/`
- `utils.ts` - General utility functions

## Migration Benefits

### ✅ Improved Organization
- Features are self-contained with related code co-located
- Clear separation of concerns
- Easier to locate and modify feature-specific code

### ✅ Better Maintainability
- Changes to a feature only affect files within that feature directory
- Reduced coupling between different parts of the application
- Easier onboarding for new developers

### ✅ Enhanced Scalability
- New features can be added without affecting existing structure
- Feature flags and modular deployment become easier
- Testing can be organized by feature

### ✅ Consistent Patterns
- All features follow the same internal structure
- Predictable file locations
- Standardized import patterns

## Import Patterns

### Feature Imports
```typescript
// Importing from the same feature
import { useContentAccess } from '../hooks/useContentAccess';

// Importing from other features  
import { NoteCard } from '@/features/notes/components/NoteCard';

// Importing shared components
import { Button } from '@/components/ui/button';
```

### Path Aliases
The project uses TypeScript path aliases for clean imports:
- `@/` - Points to `src/` directory
- `@/features/` - Feature-based modules
- `@/components/` - Shared components
- `@/lib/` - Utility libraries

## Build Status

✅ **All TypeScript errors resolved**
✅ **All ESLint warnings/errors fixed**  
✅ **Successful production build**
✅ **All imports updated to new structure**
✅ **Feature modules properly exported**

## Development Guidelines

### Adding New Features
1. Create a new directory under `/src/features/[feature-name]/`
2. Follow the established structure: `components/`, `hooks/`, `utils/`, `types/`, `data/`
3. Export main functionality from `index.ts`
4. Update imports in consuming components

### Modifying Existing Features
1. Keep changes within the feature directory when possible
2. Update the feature's `index.ts` if adding new exports
3. Consider impact on other features that import from this feature

### Code Quality
- All code passes TypeScript strict checking
- ESLint rules are enforced
- Components follow React best practices
- Hooks follow React hooks guidelines

## Cleanup Status

### ✅ **CLEANUP COMPLETED**

The codebase cleanup has been successfully completed with the following actions:

#### Files Removed:
- **Old Hook Files**: Removed duplicate hooks from `src/hooks/` (moved to feature directories)
  - `useImageState.ts`, `useResponsive.ts`, `useImageInteraction.ts`
  - Moved `use-toast.ts` to `src/shared/hooks/`
- **Empty Component Files**: Removed empty auth component stubs
- **Duplicate Components**: Removed "Fixed" versions of components
  - `HybridSmartSearchFixed.tsx`, `NewHeroSectionFixed.tsx`, `PremiumSearchExperienceFixed.tsx`
- **Old Editor Components**: Removed duplicate editor components (kept feature versions)
- **Unused Test Files**: Removed `src/test/component-imports.ts`
- **Unused Styles**: Removed `src/styles/imageStyles.ts`

#### Directories Removed:
- `src/hooks/` (empty after moving files)
- `src/components/auth/` (empty files)
- `src/components/editor/` (duplicated in features)
- `src/components/features/` (empty subdirectories)
- `src/shared/components/` and `src/shared/utils/` (empty)
- `src/styles/` (unused)
- `src/test/` (unused test files)

#### Kept Directories:
- `src/shared/hooks/` - Contains shared hooks like `use-toast.ts`
- `src/data/` - Contains `sampleTransparencyData.ts` (still in use)
- `src/utils/` - Contains utility functions still being used

### ✅ **Verification Status**
- **Build**: ✅ `npm run build` passes successfully
- **Lint**: ✅ `npm run lint` passes with no errors
- **TypeScript**: ✅ All imports resolved correctly
- **Structure**: ✅ Clean, organized, no duplicate or unused files

## Summary

The GhostNote codebase has been successfully refactored to use a clean, feature-based folder structure. All files have been moved to appropriate locations, imports have been updated, and all TypeScript and build errors have been resolved. **The cleanup phase is now complete**, removing all old, duplicate, and unused files while maintaining a functional, error-free codebase.

The application now follows modern development practices with:
- ✅ Better organization and maintainability
- ✅ Consistent feature-based structure  
- ✅ No duplicate or dead code
- ✅ Clean, readable import paths
- ✅ Scalable architecture for future development
