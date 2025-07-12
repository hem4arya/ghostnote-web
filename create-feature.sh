#!/bin/bash

# Feature Template Generator for Next.js App Router
# Usage: ./create-feature.sh <feature-name>

if [ -z "$1" ]; then
    echo "Usage: ./create-feature.sh <feature-name>"
    echo "Example: ./create-feature.sh dashboard"
    exit 1
fi

FEATURE_NAME=$1
FEATURE_DIR="src/app/$FEATURE_NAME"

echo "🚀 Creating feature: $FEATURE_NAME"

# Create feature directory structure
mkdir -p "$FEATURE_DIR"/{components,hooks,utils,types}

# Create tsconfig.json
cat > "$FEATURE_DIR/tsconfig.json" << EOF
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["../../../*"],
      "~/*": ["../../../*"],
      "./components/*": ["./components/*"],
      "./hooks/*": ["./hooks/*"],
      "./utils/*": ["./utils/*"],
      "./types/*": ["./types/*"],
      "lib/*": ["../../../lib/*"],
      "components/*": ["../../../components/*"],
      "features/*": ["../../../features/*"],
      "shared/*": ["../../../shared/*"],
      "utils/*": ["../../../utils/*"]
    }
  },
  "include": [
    "./**/*.ts",
    "./**/*.tsx",
    "../../../types/**/*.ts",
    "../../../lib/**/*.ts",
    "../../../components/**/*.ts",
    "../../../components/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    ".next"
  ]
}
EOF

# Create VSCode workspace
cat > "$FEATURE_DIR/$FEATURE_NAME.code-workspace" << EOF
{
  "folders": [
    {
      "name": "${FEATURE_NAME^} Feature",
      "path": "./src/app/$FEATURE_NAME"
    },
    {
      "name": "Project Root (for dev server)",
      "path": "."
    }
  ],
  "settings": {
    "typescript.preferences.includePackageJsonAutoImports": "on",
    "typescript.suggest.autoImports": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    },
    "files.watcherExclude": {
      "**/.git/objects/**": true,
      "**/.git/subtree-cache/**": true,
      "**/node_modules/*/**": true,
      "**/.next/**": true
    }
  },
  "extensions": {
    "recommendations": [
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next"
    ]
  }
}
EOF

# Create README.md
cat > "$FEATURE_DIR/README.md" << EOF
# ${FEATURE_NAME^} Feature

This folder contains all the logic, components, and utilities for the $FEATURE_NAME feature.

## 📁 Structure

\`\`\`
$FEATURE_NAME/
├── components/          # Feature-specific UI components
├── hooks/               # Custom React hooks for $FEATURE_NAME logic
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions
├── page.tsx            # Main $FEATURE_NAME route component
├── tsconfig.json       # Feature-specific TypeScript config
├── $FEATURE_NAME.code-workspace # VSCode workspace for isolated development
└── README.md           # This file
\`\`\`

## 🎯 Purpose

[Describe the main purpose and functionality of this feature]

## 🔧 Development Workflow

### Isolated Feature Development

1. **Open feature workspace**: \`code $FEATURE_NAME.code-workspace\`
2. **Start dev server** (from project root): \`npm run dev\`  
3. **Work in this folder** - see changes at \`http://localhost:3000/$FEATURE_NAME\`

### Import Strategy
\`\`\`typescript
// ✅ Local imports (relative)
import Component from './components/Component';
import { useFeature } from './hooks/useFeature';
import { utils } from './utils/helpers';

// ✅ Global imports (absolute)
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
\`\`\`

## 📝 Components

[Document your components here]

## 🪝 Hooks

[Document your hooks here]

## 🛠 Utils

[Document your utilities here]
EOF

# Create basic page.tsx if it doesn't exist
if [ ! -f "$FEATURE_DIR/page.tsx" ]; then
    cat > "$FEATURE_DIR/page.tsx" << EOF
"use client";

import { useState } from "react";

export default function ${FEATURE_NAME^}Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          ${FEATURE_NAME^} Feature
        </h1>
        
        <div className="bg-ghost-gray/20 rounded-lg p-6 border border-ghost-purple/30">
          <p className="text-gray-300 mb-4">
            Welcome to the $FEATURE_NAME feature! This is your starting point.
          </p>
          
          <div className="text-sm text-gray-400">
            <p>📁 Add components in: <code>./components/</code></p>
            <p>🪝 Add hooks in: <code>./hooks/</code></p>
            <p>🛠 Add utils in: <code>./utils/</code></p>
            <p>📝 Add types in: <code>./types/</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF
fi

# Create types/index.ts
cat > "$FEATURE_DIR/types/index.ts" << EOF
// ${FEATURE_NAME^} feature type definitions

export interface ${FEATURE_NAME^}State {
  // Define your state interface here
}

export interface ${FEATURE_NAME^}Props {
  // Define your props interface here
}

// Add more types as needed
EOF

echo "✅ Feature '$FEATURE_NAME' created successfully!"
echo ""
echo "Next steps:"
echo "1. cd $FEATURE_DIR"
echo "2. code $FEATURE_NAME.code-workspace"
echo "3. Start building your feature!"
echo ""
echo "Development workflow:"
echo "• Run 'npm run dev' from project root"
echo "• Open workspace file in VSCode"
echo "• Work within this feature folder"
echo "• View at http://localhost:3000/$FEATURE_NAME"
