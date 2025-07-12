# Create Note Feature

This feature provides a comprehensive note creation interface with rich text editing capabilities, image integration, and real-time formatting.

## 📁 Structure

```
src/features/create-note/
├── components/           # UI components
│   ├── EditorHeader.tsx     # Header with title and save controls
│   ├── FormattingToolbar.tsx # Rich text formatting tools
│   ├── ImageToolbox.tsx     # Image management and effects
│   └── WordCountWidget.tsx  # Word/character count display
├── hooks/               # Custom React hooks
│   ├── useFormatting.ts     # Text formatting state and commands
│   ├── useResponsive.ts     # Responsive design utilities
│   ├── useImageState.ts     # Image state management
│   ├── useImageInteraction.ts # Image interaction handling
│   └── useSaveNote.ts       # Save functionality and drafts
├── logic/               # Business logic and API calls
│   └── noteApi.ts           # Supabase API interactions
├── types/               # TypeScript type definitions
│   └── index.ts             # Shared types for the feature
├── utils/               # Utility functions (if needed)
├── CreateNotePage.tsx   # Main feature entry point
├── tsconfig.json        # TypeScript configuration for isolated development
└── README.md           # This documentation
```

## 🔧 Features

### Rich Text Editing
- **Formatting Controls**: Bold, italic, underline, strikethrough
- **Text Alignment**: Left, center, right, justify
- **Font Customization**: Size, color, background color
- **Live Preview**: Real-time formatting updates

### Image Integration
- **Image Upload**: Drag & drop or click to upload
- **Text Wrapping**: Configure how text flows around images
- **Opacity Control**: Adjust image transparency
- **Resize Tools**: Interactive resize with visual guides

### Auto-save & Drafts
- **Auto-save**: Automatic draft saving to localStorage
- **Manual Save**: Save to Supabase database
- **Draft Recovery**: Load unsaved drafts on page reload
- **Word Count**: Real-time word and character counting

### Focus Mode
- **Distraction-free Writing**: Hide all UI elements
- **Full-screen Editor**: Maximum writing space
- **Toggle Controls**: Easy entry/exit from focus mode

## 🚀 Usage

### Basic Usage
```tsx
import { CreateNotePage } from '@/features/create-note';

export default function CreatePage() {
  return <CreateNotePage />;
}
```

### Using Individual Components
```tsx
import { 
  EditorHeader, 
  FormattingToolbar, 
  useFormatting,
  useSaveNote 
} from '@/features/create-note';

function CustomEditor() {
  const { activeFormats, executeCommand } = useFormatting();
  const { saveNote, isSaving } = useSaveNote();
  
  return (
    <div>
      <EditorHeader title="My Note" />
      <FormattingToolbar 
        activeFormats={activeFormats}
        executeCommand={executeCommand}
      />
      {/* Your editor content */}
    </div>
  );
}
```

## 🔌 API Integration

### Supabase Tables
- `notes`: Main note storage with content, metadata, and access control
- User authentication through Supabase Auth

### Save Operations
```typescript
// Save new note
const result = await saveNote({
  title: "My Note",
  content: "Note content...",
  tags: ["tag1", "tag2"],
  isPrivate: false,
  isPremium: false
});

// Auto-save draft
await triggerAutoSave({
  title: "Draft title",
  content: "Draft content...",
  wordCount: 150,
  characterCount: 800
});
```

## 🛠️ Development

### Isolated Development
This feature can be developed in isolation with its own TypeScript configuration:

```bash
# Navigate to feature directory
cd src/features/create-note

# TypeScript will use the local tsconfig.json
# Hot-reload will work for this feature independently
```

### Import Patterns
- **Relative imports** for internal feature files
- **Absolute imports** for shared resources outside the feature

```typescript
// Internal (relative)
import { EditorHeader } from './components/EditorHeader';
import { useFormatting } from './hooks/useFormatting';

// External (absolute)
import { createSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
```

### Adding New Components
1. Create component in `components/` directory
2. Export from component file
3. Add types to `types/index.ts` if needed
4. Import using relative paths within feature

### Adding New Hooks
1. Create hook in `hooks/` directory
2. Follow naming convention: `use[HookName].ts`
3. Add proper TypeScript types
4. Export hook functions and types

## 🔧 Configuration

### TypeScript
The feature has its own `tsconfig.json` that extends the root configuration with:
- Path mapping for absolute imports
- Feature-specific type checking
- Isolated module resolution

### Environment Variables
Uses the same environment variables as the main app:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🧪 Testing

### Component Testing
Test individual components in isolation:
```typescript
import { render, screen } from '@testing-library/react';
import { EditorHeader } from './components/EditorHeader';

test('renders editor header with title', () => {
  render(<EditorHeader title="Test Note" />);
  expect(screen.getByText('Test Note')).toBeInTheDocument();
});
```

### Hook Testing
Test custom hooks with React Testing Library:
```typescript
import { renderHook, act } from '@testing-library/react';
import { useFormatting } from './hooks/useFormatting';

test('formatting hook updates active formats', () => {
  const { result } = renderHook(() => useFormatting());
  
  act(() => {
    result.current.executeCommand('bold');
  });
  
  expect(result.current.activeFormats).toContain('bold');
});
```

## 🔄 State Management

### Local State
Each component manages its own local state using React hooks:
- `useState` for component state
- `useEffect` for side effects
- `useCallback` for memoized functions

### Global State
Feature uses custom hooks for cross-component state:
- `useFormatting`: Text formatting state
- `useImageState`: Image management state
- `useSaveNote`: Save operations and draft management

### Persistence
- **Drafts**: localStorage for client-side draft persistence
- **Notes**: Supabase database for permanent storage
- **Settings**: localStorage for user preferences

## 🎨 Styling

### Tailwind Classes
Uses the project's global Tailwind configuration with custom colors:
- `ghost-black`, `ghost-dark`, `ghost-gray`
- `ghost-purple`, `ghost-neon`
- Responsive breakpoints: `sm:`, `md:`, `lg:`

### Custom Styles
Feature-specific styles are applied inline or through Tailwind utilities:
```typescript
className="min-h-screen bg-ghost-black text-white prose-editor"
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Base styles (< 640px)
- **Tablet**: `sm:` prefix (640px+)
- **Desktop**: `md:` prefix (768px+)
- **Large**: `lg:` prefix (1024px+)

### Adaptive UI
- Toolbar layouts adjust for screen size
- Editor padding scales with viewport
- Focus mode optimizations for mobile

## 🔐 Security

### Input Sanitization
- Content is sanitized before saving to database
- XSS protection through proper escaping
- File upload restrictions for images

### Authentication
- Requires valid Supabase session
- User ownership validation for note operations
- Row-level security policies in database

## 🚀 Performance

### Optimization Strategies
- Memoized callbacks to prevent unnecessary re-renders
- Debounced auto-save to reduce API calls
- Lazy loading of formatting tools
- Efficient image handling and compression

### Bundle Size
- Tree-shakeable exports
- Dynamic imports for heavy components
- Minimal external dependencies

## 🔧 Troubleshooting

### Common Issues

**TypeScript errors with imports:**
```bash
# Ensure you're in the feature directory
cd src/features/create-note
# Check tsconfig.json paths are correct
```

**Save operations failing:**
```bash
# Verify Supabase environment variables
# Check network connectivity
# Verify user authentication status
```

**Hot-reload not working:**
```bash
# Restart Next.js development server
npm run dev
# Check for syntax errors in components
```

### Debug Mode
Enable debug logging in development:
```typescript
// Add to component for debugging
useEffect(() => {
  console.log('CreateNote Debug:', { title, wordCount, lastSaved });
}, [title, wordCount, lastSaved]);
```

## 🔄 Future Enhancements

### Planned Features
- [ ] Real-time collaboration
- [ ] Version history and rollback
- [ ] Advanced image editing tools
- [ ] Voice-to-text integration
- [ ] Markdown import/export
- [ ] Template system
- [ ] Advanced formatting (tables, lists)
- [ ] Spell check integration

### Extension Points
- Plugin system for custom formatting tools
- Webhook integration for external services
- Custom themes and editor layouts
- Advanced analytics and usage tracking
