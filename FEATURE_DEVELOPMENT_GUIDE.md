# Feature-Based Development Guide

This guide explains how to work with the feature-based structure in the GhostNote project.

## 🎯 Overview

The project is structured to support **feature-based development** where you can work on individual features in isolation while the main app runs in the background.

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── homepage/            # Homepage feature (standalone)
│   │   ├── components/      # Homepage-specific components
│   │   ├── hooks/           # Homepage-specific hooks
│   │   ├── utils/           # Homepage-specific utilities
│   │   ├── page.tsx         # Homepage route
│   │   └── README.md        # Feature documentation
│   ├── notes-page/          # Notes page feature
│   └── page.tsx             # Root route (delegates to homepage)
├── features/                # Legacy feature structure (being migrated)
├── components/              # Shared UI components
├── lib/                     # Shared utilities
└── shared/                  # Shared hooks and utilities
```

## 🔄 Development Workflow

### Option 1: Work on Single Feature
1. **Start the main app** from project root:
   ```bash
   npm run dev
   ```

2. **Open feature folder** in VSCode:
   ```bash
   code src/app/homepage/
   ```

3. **Edit feature files** using relative imports:
   ```typescript
   // ✅ Within feature
   import { SearchBar } from "./components/SearchBar";
   import { useHomepage } from "./hooks/useHomepage";
   
   // ✅ External dependencies
   import { Button } from "components/ui/button";
   ```

4. **Hot reload works automatically** as you save files

### Option 2: Use Workspace
1. Open the workspace file:
   ```bash
   code ghostnote.code-workspace
   ```

2. This gives you organized folder structure in VSCode sidebar

## 📦 Import Patterns

### Within a Feature (Relative Imports)
```typescript
// ✅ Relative imports for feature-specific code
import { HeroSection } from "./components/HeroSection";
import { useHomepage } from "./hooks/useHomepage";
import { formatSearchQuery } from "./utils/search";
```

### External Dependencies (Absolute Imports)
```typescript
// ✅ Absolute imports for shared code
import { Button } from "components/ui/button";
import { createClient } from "lib/supabase/client";
import { sampleNotes } from "features/notes/data/sampleNotes";
import { useToast } from "shared/hooks/use-toast";
```

## 🎨 TypeScript Configuration

The `tsconfig.json` is configured with:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "lib/*": ["lib/*"],
      "components/*": ["components/*"],
      "features/*": ["features/*"],
      "app/*": ["app/*"],
      "utils/*": ["utils/*"],
      "shared/*": ["shared/*"]
    }
  }
}
```

This enables:
- **Relative imports** within features: `./components/SearchBar`
- **Absolute imports** for shared code: `components/ui/button`
- **Clean imports** without long relative paths

## 🆕 Creating New Features

### 1. Create Feature Directory
```bash
mkdir -p src/app/my-feature/{components,hooks,utils}
```

### 2. Add Basic Structure
```
my-feature/
├── components/
├── hooks/
├── utils/
├── page.tsx           # If it's a route
└── README.md          # Copy from FEATURE_README_TEMPLATE.md
```

### 3. Create Page Component (if needed)
```typescript
// src/app/my-feature/page.tsx
"use client";

import { MyFeatureComponent } from "./components/MyFeatureComponent";

export default function MyFeaturePage() {
  return <MyFeatureComponent />;
}
```

### 4. Add to Workspace (optional)
Update `ghostnote.code-workspace` to include your new feature.

## 🔧 Best Practices

### File Organization
- **Keep related code together** in the same feature folder
- **Use descriptive component names** that indicate their purpose
- **Group by functionality**, not by file type

### Import Strategy
- **Prefer relative imports** within the same feature
- **Use absolute imports** for shared dependencies
- **Avoid deep relative imports** like `../../../components`

### Component Design
- **Make components reusable** within the feature
- **Keep feature-specific logic** in hooks
- **Extract complex logic** to utility functions

### Documentation
- **Add README.md** to each feature folder
- **Document component props** with TypeScript interfaces
- **Explain complex business logic** in comments

## 🚀 Hot Reload & Development

### What Works
- ✅ Edit files in any feature folder
- ✅ Save changes and see immediate updates
- ✅ TypeScript errors show in VSCode
- ✅ ESLint warnings/errors are displayed
- ✅ Tailwind classes autocomplete

### Performance Tips
- **Open only the feature you're working on** in VSCode for faster IntelliSense
- **Use the workspace file** for multi-feature development
- **Keep the main terminal** running `npm run dev` from project root

## 🔍 Debugging

### Import Issues
If imports aren't working:
1. **Check tsconfig.json** paths configuration
2. **Restart TypeScript server** in VSCode (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
3. **Verify file paths** are correct

### Hot Reload Issues
If hot reload stops working:
1. **Check terminal** for Next.js errors
2. **Restart dev server**: Ctrl+C, then `npm run dev`
3. **Clear Next.js cache**: `rm -rf .next`

## 📝 Migration Notes

The project is transitioning from the old `/src/features/` structure to the new `/src/app/[feature]/` structure. Both patterns are supported during the transition.

### Old Pattern (Legacy)
```typescript
import { NoteCard } from "@/features/notes/components/NoteCard";
```

### New Pattern (Preferred)
```typescript
import { NoteCard } from "features/notes/components/NoteCard";
```

## 🎯 Benefits

### Developer Experience
- **Focused development** - work on one feature at a time
- **Faster IntelliSense** - smaller scope for IDE
- **Better organization** - related code stays together
- **Scalable structure** - easy to add new features

### Team Collaboration
- **Reduced merge conflicts** - features are isolated
- **Easier code reviews** - changes are localized
- **Clear ownership** - each feature has a clear scope
- **Better testing** - features can be tested in isolation

## ❓ FAQ

**Q: Can I still work on the full project?**
A: Yes! Open the root directory or use the workspace file.

**Q: Do I need to restart the dev server when switching features?**
A: No, keep `npm run dev` running from the root and just change your VSCode workspace.

**Q: What about shared components?**
A: Shared components stay in `/src/components/` and are imported with absolute paths.

**Q: How do I add new routes?**
A: Create a new feature folder with a `page.tsx` file, or add to existing App Router structure.
