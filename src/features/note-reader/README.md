# Note Reader Feature

A comprehensive note reading experience with customizable settings, theming, and sidebar controls.

## Structure

```
note-reader/
├── components/          # UI components
│   ├── ErrorState.tsx      # Error handling UI
│   ├── LoadingState.tsx    # Loading indicator
│   ├── ReaderContent.tsx   # Main content display
│   ├── ReaderHeader.tsx    # Navigation and controls
│   └── ReaderSidebar.tsx   # Settings and actions panel
├── hooks/              # React hooks
│   ├── useNoteAccess.ts    # Note access and permissions
│   └── useReaderSettings.ts # Reading preferences
├── types/              # TypeScript types
│   └── index.ts           # All feature types
├── utils/              # Utility functions (empty for now)
├── NoteReaderPage.tsx  # Main page component
├── index.ts           # Feature exports
├── tsconfig.json      # TypeScript config for isolation
├── note-reader.code-workspace # VS Code workspace
└── README.md          # This file
```

## Features

### Reading Experience
- **Customizable Typography**: Adjust font size (12-24px) and line height (1.2-2.0)
- **Multiple Themes**: Light, dark, and sepia color schemes
- **Reading Progress**: Visual progress bar and statistics
- **Responsive Design**: Optimized for desktop and mobile

### Note Access Control
- **Permission System**: Free, premium, encrypted, and private access levels
- **Supabase Integration**: Real-time access checks and user authentication
- **Graceful Fallbacks**: Clear error states and loading indicators

### Interactive Elements
- **Collapsible Sidebar**: Settings, note info, and actions
- **Share & Export**: Native sharing and text download
- **Bookmark Support**: Add notes to favorites
- **Mobile-First**: Touch-friendly controls and responsive layout

## Development

### Isolated Development
1. Open the feature in VS Code: `code note-reader.code-workspace`
2. Start the main dev server from project root: `npm run dev`
3. Navigate to a note reader page to see live changes

### Imports
- **Within Feature**: Use relative imports (`./components/...`)
- **Shared Resources**: Use absolute imports (`@/components/ui/...`)
- **External Libraries**: Direct imports (`next/navigation`)

### Adding Components
1. Create component in `components/` directory
2. Add types to `types/index.ts` if needed
3. Export from `index.ts`
4. Update this README if it's a major addition

## API Integration

### Supabase Tables
- `notes`: Main note content and metadata
- `purchases`: Premium content access records
- `subscriptions`: User subscription status
- `users`: User authentication and profiles

### Key Functions
- `useNoteAccess`: Handles note fetching and permission checking
- `useReaderSettings`: Manages reading preferences with local state

## Usage

```tsx
import { NoteReaderPage } from '@/features/note-reader';

// Use in app router
export default function NotePage() {
  return <NoteReaderPage />;
}
```

Or import individual components:

```tsx
import { 
  ReaderContent, 
  ReaderSidebar, 
  useReaderSettings 
} from '@/features/note-reader';
```

## Todo

- [ ] Integrate real AccessControl component
- [ ] Add reading analytics and tracking
- [ ] Implement bookmark persistence
- [ ] Add keyboard shortcuts
- [ ] Enhance mobile gesture support
- [ ] Add print stylesheet
- [ ] Implement note annotations
