# Homepage Feature

This folder contains all the logic, components, and utilities for the GhostNote homepage.

## 📁 Structure

```
homepage/
├── components/          # Reusable UI components for homepage
│   ├── HeroSection.tsx  # Main hero/banner section  
│   └── SearchBar.tsx    # Search functionality component
├── hooks/               # Custom React hooks for homepage logic
│   └── useHomepage.ts   # Main homepage state management
├── utils/               # Utility functions and helpers
│   └── search.ts        # Search-related utilities
├── types/               # TypeScript type definitions
├── page.tsx            # Main homepage route component
├── tsconfig.json       # Feature-specific TypeScript config
├── homepage.code-workspace # VSCode workspace for isolated development
├── dev-setup.sh        # Development setup script
└── README.md           # This file
```

## 🎯 Purpose

The homepage serves as the main entry point for users, featuring:
- Hero section with key value propositions
- Search functionality for discovering content
- Featured/trending content display
- Authentication modals integration

## 🔧 Key Components

### `page.tsx`
The main homepage route component that orchestrates all homepage functionality using the `useHomepage` hook.

### `components/HeroSection.tsx`
- Displays the main value proposition
- Feature highlights with icons
- Call-to-action buttons
- Uses relative imports: `./HeroSection`

### `components/SearchBar.tsx`
- Advanced search with filters
- Real-time search suggestions
- Quick search tags
- Keyboard navigation support

### `hooks/useHomepage.ts`
Central state management for:
- Authentication modal state
- Search query management
- Event listeners for cross-component communication

### `utils/search.ts`
Search utilities including:
- Query formatting and validation
- Result filtering and sorting
- Search term highlighting
- Analytics tracking

## 🔄 Development Workflow

### Working on this feature:
1. Open this folder (`src/app/homepage/`) in VSCode
2. Ensure the main app is running from root: `npm run dev`
3. Edit files using relative imports within this folder
4. Hot reload will work automatically

### Import patterns:
```typescript
// ✅ Relative imports (within feature)
import { SearchBar } from "./components/SearchBar";
import { useHomepage } from "./hooks/useHomepage";

// ✅ Absolute imports (external dependencies)
import { Button } from "components/ui/button";
import { sampleNotes } from "features/notes/data/sampleNotes";
```

## 🔧 Development Workflow

### Isolated Feature Development

This feature is set up for isolated development while maintaining full app functionality:

#### Quick Start
1. **Open feature workspace**: `code homepage.code-workspace`
2. **Start dev server** (from project root): `npm run dev`  
3. **Work in this folder** - see changes at `http://localhost:3000/homepage`

#### Import Strategy
```typescript
// ✅ Local imports (relative)
import HeroSection from './components/HeroSection';
import { useHomepage } from './hooks/useHomepage';
import { searchUtils } from './utils/search';

// ✅ Global imports (absolute)
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/features/auth/components/AuthModal';
```

#### File Organization
- **Local files**: Use relative imports (`./`, `../`)
- **Global utilities**: Use absolute imports (`@/lib/`, `@/components/`)
- **Keep logic contained**: Most homepage logic stays in this folder
- **Share when needed**: Move to `@/shared/` if used by other features

#### Hot Reload Setup
- ✅ TypeScript config extends root config
- ✅ VSCode workspace targets this folder
- ✅ Imports work from both local and global scope
- ✅ Full app runs from root `npm run dev`

## 📊 State Management

The homepage uses the `useHomepage` hook for local state management:

```typescript
const {
  isAuthModalOpen,
  authMode,
  handleLoginClick,
  handleSignUpClick,
  closeAuthModal,
  searchQuery,
  handleSearch
} = useHomepage();
```

## 🎨 Styling

- Uses Tailwind CSS with custom ghost theme colors
- Responsive design (mobile-first approach)
- Dark theme with gradient accents
- Consistent spacing and typography

## 🔗 External Dependencies

- `components/ui/*` - Shared UI components
- `features/auth/components/AuthModal` - Authentication
- `features/notes/components/NoteCard` - Content display
- `lib/supabase` - Database integration (when needed)

## 🧪 Testing

When adding new functionality:
1. Test components in isolation
2. Verify hot reload works correctly
3. Check responsive design on different screen sizes
4. Ensure accessibility standards are met

## 📝 Notes

- All components are client-side ("use client")
- Search functionality is currently mock - integrate with real API as needed
- Analytics tracking is placeholder - implement real tracking service
- Consider adding loading states for better UX
