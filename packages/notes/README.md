# Notes Package

Core note functionality for the GhostNote platform.

## Overview

This package provides comprehensive note management including creation, editing, display, and data management. It serves as the foundation for the content system across the application.

## Architecture

```
src/
├── components/          # Note UI components
│   ├── NoteCard.tsx        # Note preview card
│   ├── NoteDetail.tsx      # Detailed note view
│   ├── NoteEditor.tsx      # Note editing interface
│   └── CreateNoteForm.tsx  # Note creation form
├── data/               # Sample and static data
│   └── sampleNotes.ts     # Sample note data
├── hooks/              # Note-related hooks
│   ├── useNotes.ts        # Note state management
│   └── useNoteEditor.ts   # Editor state management
├── types/              # TypeScript type definitions
│   └── index.ts           # Note types and interfaces
├── utils/              # Note utilities
│   └── noteHelpers.ts     # Helper functions
├── [id]/               # Dynamic note pages
│   └── page.tsx           # Individual note page
└── index.ts            # Package exports
```

## Components

### NoteCard
Preview card component for displaying notes in lists and grids.
```tsx
import { NoteCard } from "@ghostnote/notes";

<NoteCard 
  note={noteData}
  onClick={handleNoteClick}
  showAuthor={true}
/>
```

### NoteDetail
Detailed view component for individual notes.
```tsx
import { NoteDetail } from "@ghostnote/notes";

<NoteDetail 
  noteId={noteId}
  allowEdit={canEdit}
  onPurchase={handlePurchase}
/>
```

### NoteEditor
Rich text editor component for creating and editing notes.
```tsx
import { NoteEditor } from "@ghostnote/notes";

<NoteEditor
  initialContent={content}
  onChange={handleContentChange}
  onSave={handleSave}
/>
```

### CreateNoteForm
Form component for creating new notes with metadata.
```tsx
import { CreateNoteForm } from "@ghostnote/notes";

<CreateNoteForm 
  onSubmit={handleNoteCreation}
  categories={availableCategories}
/>
```

## Types

Core note TypeScript types:
- `Note`: Complete note data structure
- `NotePreview`: Abbreviated note information
- `NoteMetadata`: Note metadata (title, category, etc.)
- `NoteContent`: Rich text content structure
- `NotePermissions`: Access and editing permissions

## Sample Data

The package includes comprehensive sample data:
```tsx
import { sampleNotes } from "@ghostnote/notes";

// Access 8 sample notes with various categories
const designNotes = sampleNotes.filter(note => note.category === "Design");
```

## Hooks

### useNotes
Hook for managing note collections and state.
```tsx
import { useNotes } from "@ghostnote/notes";

const { 
  notes, 
  loading, 
  createNote, 
  updateNote, 
  deleteNote 
} = useNotes();
```

### useNoteEditor
Hook for managing note editor state and content.
```tsx
import { useNoteEditor } from "@ghostnote/notes";

const { 
  content, 
  setContent, 
  save, 
  isDirty, 
  wordCount 
} = useNoteEditor(noteId);
```

## Features

- **Rich Text Editing**: Full-featured text editor with formatting
- **Note Management**: Create, read, update, delete operations
- **Preview System**: Card-based note previews for discovery
- **Category System**: Organize notes by categories and topics
- **Purchase System**: Support for paid note access
- **Search Integration**: Full-text search capabilities
- **Analytics**: Track note views, purchases, and engagement

## Usage in Other Packages

```tsx
// Import note components and data
import { NoteCard, sampleNotes } from "../../notes/src";

function NoteFeed() {
  return (
    <div className="note-grid">
      {sampleNotes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
```

## Integration

### With Editor Package
- Rich text editing capabilities
- Content formatting and styling
- Media embedding and attachments

### With Auth Package
- User-specific note access
- Permission-based editing
- Purchase validation

### With Search Package
- Full-text note search
- Category and tag filtering
- Relevance-based sorting

## Development

To extend notes functionality:
1. Add new components in `src/components/`
2. Create utilities in `src/utils/noteHelpers.ts`
3. Implement hooks in `src/hooks/`
4. Define types in `src/types/index.ts`
5. Add sample data in `src/data/sampleNotes.ts`
6. Export from `index.ts`
7. Update this README

## Dependencies

- React for component logic
- Rich text editor integration
- Form validation libraries
- State management utilities
