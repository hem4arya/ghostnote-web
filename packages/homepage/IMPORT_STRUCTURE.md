# Homepage Package - Import Structure Documentation

## 🚀 Modular Import System

This document explains the proper import structure for the Homepage feature package using the `@` alias system.

## 📁 Project Structure

```
packages/
├── homepage/               # This feature package
│   ├── src/
│   │   ├── components/     # Local components (relative imports)
│   │   ├── hooks/          # Local hooks (relative imports)
│   │   ├── utils/          # Local utilities (relative imports)
│   │   ├── types/          # Local types (relative imports)
│   │   ├── data/           # Local data (relative imports)
│   │   ├── styles/         # Local styles (relative imports)
│   │   └── page.tsx        # Main page component
│   ├── tsconfig.json       # Feature-specific TypeScript config
│   └── package.json        # Feature-specific dependencies
├── Navbar/                 # Shared Navbar package
├── ui-components/          # Shared UI components
└── shared-lib/             # Shared utilities and libraries
```

## 🔧 Import Rules

### 1. Local Imports (Within Homepage Package)

Use **relative imports** for files within the same feature package:

```tsx
// ✅ Good - Local component imports
import Hero from "./components/Hero";
import LocalAuthModal from "./components/LocalAuthModal";
import LocalFooter from "./components/LocalFooter";
import LocalNoteCard from "./components/LocalNoteCard";

// ✅ Good - Local data imports
import { localSampleNotes } from "./data/localSampleNotes";

// ✅ Good - Local styles
import "./styles/homepage.css";
```

### 2. External Package Imports (Cross-Package)

Use **`@` aliases** for imports from other packages:

```tsx
// ✅ Good - Navbar package
import { Navbar } from "@ghostnote/navbar";

// ✅ Good - UI Components package
import { Button } from "@ghostnote/ui-components";

// ✅ Good - Shared libraries
import { supabase } from "@lib/supabase";
```

### 3. Third-Party Library Imports

Use **standard imports** for external libraries:

```tsx
// ✅ Good - Third-party libraries
import { useEffect, useState } from "react";
import { HelpCircle, Settings, Star } from "lucide-react";
```

## ⚙️ TypeScript Configuration

The `tsconfig.json` file is configured with path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": "../..",
    "paths": {
      "@/*": ["./packages/homepage/src/*"],
      "@lib/*": ["./packages/shared-lib/src/*"],
      "@ui/*": ["./packages/ui-components/src/components/*"],
      "@homepage/*": ["./packages/homepage/src/*"],
      "@ghostnote/navbar": ["./packages/Navbar/index.ts"],
      "@ghostnote/navbar/*": ["./packages/Navbar/src/*"],
      "@ghostnote/ui-components": ["./packages/ui-components/index.ts"],
      "@ghostnote/ui-components/*": ["./packages/ui-components/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "next-env.d.ts",
    "../Navbar/src/**/*",
    "../ui-components/src/**/*"
  ],
  "references": [{ "path": "../ui-components" }, { "path": "../Navbar" }]
}
```

## 📝 Examples

### Complete Import Example

```tsx
"use client";

import { useEffect, useState } from "react";
// Local styles
import "./styles/homepage.css";
// External packages with @ aliases
import { Navbar } from "@ghostnote/navbar";
import { Button } from "@ghostnote/ui-components";
// Third-party libraries
import { HelpCircle, Settings, Star } from "lucide-react";
// Local components with relative imports
import Hero from "./components/Hero";
import LocalAuthModal from "./components/LocalAuthModal";
import LocalFooter from "./components/LocalFooter";
import LocalNoteCard from "./components/LocalNoteCard";
import { localSampleNotes } from "./data/localSampleNotes";
```

### Button Usage Examples

```tsx
// Using Button from ui-components
import { Button } from "@ghostnote/ui-components";

// Available variants: default, destructive, outline, secondary, ghost, link
<Button variant="default" size="sm">
  Demo Button
</Button>;

// Using Navbar-specific Button (if needed)
import { Button } from "@ghostnote/navbar/components/ui/Button";

// Has additional variants: neon, cyber, etc.
<Button variant="neon" size="sm">
  Neon Button
</Button>;
```

## 🚫 What NOT to Do

```tsx
// ❌ Bad - Don't use relative imports for external packages
import Navbar from "../../../packages/Navbar/src/components/Navbar";
import { Button } from "../../../packages/ui-components/src/components/button";

// ❌ Bad - Don't use @ aliases for local files
import Hero from "@homepage/components/Hero";
import { localSampleNotes } from "@homepage/data/localSampleNotes";
```

## 🔍 Benefits

1. **Clean Imports**: No messy `../../../` paths
2. **Maintainable**: Easy to refactor and move packages
3. **Type Safety**: Full TypeScript support with proper intellisense
4. **Modular**: Clear separation between local and external dependencies
5. **Scalable**: Easy to add new packages and features

## 🛠️ Troubleshooting

### Import Errors

If you get import errors:

1. Check `tsconfig.json` paths configuration
2. Ensure the package reference exists in `references` array
3. Verify the package has an `index.ts` export file
4. Restart your TypeScript language server

### Build Errors

If builds fail:

1. Ensure all referenced packages are built first
2. Check that `baseUrl` is set correctly
3. Verify `include` patterns cover all necessary files

## 📚 Related Documentation

- [Navbar Package Documentation](../Navbar/README.md)
- [UI Components Documentation](../ui-components/README.md)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
