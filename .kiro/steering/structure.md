# Project Structure & Organization

## Root Directory Layout
```
├── src/                    # Main source code
├── lib/                    # Shared utilities and configurations
├── public/                 # Static assets
├── docs/                   # Project documentation
├── .kiro/                  # Kiro AI assistant configuration
├── test_scripts/           # Testing utilities
└── [config files]          # Next.js, TypeScript, Tailwind configs
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)
- **Next.js 13+ App Router** with file-based routing
- Each folder represents a route segment
- `layout.tsx` for shared layouts
- `page.tsx` for route components
- `loading.tsx`, `error.tsx` for UI states

### Component Architecture (`src/components/`)
```
├── shared/                 # Reusable components across features
├── ui/                     # Base UI components (buttons, inputs, etc.)
├── [feature]/              # Feature-specific components
│   ├── components/         # Sub-components
│   ├── hooks/              # Feature-specific hooks
│   └── styles/             # Component-specific styles
```

### Supporting Directories
- `src/contexts/`: React context providers
- `src/hooks/`: Custom React hooks
- `src/lib/`: Feature-specific utilities
- `src/utils/`: Pure utility functions
- `src/styles/`: Global styles and theme definitions
- `src/data/`: Static data and mock content

## Key Conventions

### Import Aliases
```typescript
"@/*": ["./src/*"]           # Main source alias
"@shared/*": ["./src/components/shared/*"]  # Shared components
"@lib/*": ["./lib/*"]        # Root lib directory
```

### Component Organization
- **Feature-based folders**: Group related components together
- **Shared components**: Reusable across multiple features
- **UI components**: Base design system components
- **Hooks**: Custom logic extraction

### File Naming
- **Components**: PascalCase (e.g., `NoteEditor.tsx`)
- **Utilities**: camelCase (e.g., `formatNotes.ts`)
- **Pages**: lowercase with hyphens (e.g., `note-detail/`)
- **Hooks**: camelCase starting with "use" (e.g., `useEditor.ts`)

### Configuration Files
- **Environment**: `.env.local` for local development
- **TypeScript**: Path mapping configured in `tsconfig.json`
- **Styling**: Tailwind config with custom theme extensions
- **Linting**: ESLint with Next.js and TypeScript rules

## Architecture Patterns
- **Component composition** over inheritance
- **Custom hooks** for stateful logic
- **Context providers** for global state
- **Utility functions** for pure operations
- **Mock implementations** for development without backend