# Editor Package

Rich text editor and content creation tools for the GhostNote platform.

## Overview

This package provides comprehensive text editing capabilities including a feature-rich Lexical editor, formatting tools, content management, and note creation interfaces for the GhostNote application.

## Architecture

```
src/
├── components/          # Editor UI components
│   ├── editor.tsx              # Main editor component
│   ├── editor-toolbar.tsx      # Formatting toolbar
│   ├── LexicalEditor.tsx       # Lexical editor implementation
│   ├── SimpleEditor.tsx        # Simplified editor
│   ├── CreateNotePage.tsx      # Note creation page
│   ├── EditorHeader.tsx        # Editor header controls
│   ├── FormattingToolbar.tsx   # Text formatting tools
│   ├── HelpModal.tsx           # Editor help modal
│   ├── ImageToolbox.tsx        # Image handling tools
│   └── WordCountWidget.tsx     # Word count display
├── hooks/              # Editor hooks
│   ├── useFormatting.ts        # Text formatting logic
│   ├── useImageInteraction.ts  # Image handling
│   ├── useImageState.ts        # Image state management
│   ├── useResponsive.ts        # Responsive editor
│   └── useSaveNote.ts          # Note saving logic
├── themes/             # Editor themes
│   └── GhostNoteTheme.ts       # Custom Lexical theme
├── lexical/            # Lexical editor framework
│   └── [extensive lexical implementation]
├── logic/              # Editor business logic
│   └── noteApi.ts             # Note API integration
└── index.ts            # Package exports
```

## Components

### Editor (Main)
Primary rich text editor component with full formatting capabilities.
```tsx
import { Editor } from "@ghostnote/editor";

<Editor
  onChange={handleContentChange}
  onWordCountChange={handleWordCount}
  placeholder="Start writing your note..."
  showToolbar={true}
  autoFocus={true}
/>
```

### LexicalEditor
Advanced Lexical-based editor with rich features.
```tsx
import { LexicalEditor } from "@ghostnote/editor";

<LexicalEditor
  initialContent={content}
  onSave={handleSave}
  theme="ghostnote"
  plugins={enabledPlugins}
/>
```

### SimpleEditor
Lightweight editor for basic text editing.
```tsx
import { SimpleEditor } from "@ghostnote/editor";

<SimpleEditor
  value={text}
  onChange={handleChange}
  placeholder="Enter your note..."
/>
```

### CreateNotePage
Complete note creation interface with metadata.
```tsx
import { CreateNotePage } from "@ghostnote/editor";

<CreateNotePage
  onSave={handleNoteSave}
  categories={availableCategories}
  allowPublic={true}
/>
```

### FormattingToolbar
Standalone formatting toolbar component.
```tsx
import { FormattingToolbar } from "@ghostnote/editor";

<FormattingToolbar
  editor={editorRef}
  showAdvanced={true}
  onFormatChange={handleFormat}
/>
```

### WordCountWidget
Word count and document statistics display.
```tsx
import { WordCountWidget } from "@ghostnote/editor";

<WordCountWidget
  wordCount={count}
  characterCount={chars}
  readingTime={minutes}
/>
```

## Hooks

### useFormatting
Hook for text formatting operations.
```tsx
import { useFormatting } from "@ghostnote/editor";

const { 
  bold, 
  italic, 
  underline, 
  applyFormat,
  removeFormat 
} = useFormatting(editor);
```

### useSaveNote
Hook for note saving and persistence.
```tsx
import { useSaveNote } from "@ghostnote/editor";

const { 
  save, 
  saving, 
  autoSave, 
  lastSaved 
} = useSaveNote(noteId, content);
```

### useImageInteraction
Hook for image handling and manipulation.
```tsx
import { useImageInteraction } from "@ghostnote/editor";

const { 
  uploadImage, 
  insertImage, 
  resizeImage,
  uploading 
} = useImageInteraction(editor);
```

## Features

- **Rich Text Editing**: Full-featured text editor with formatting
- **Lexical Framework**: Advanced editor built on Meta's Lexical
- **Real-time Collaboration**: Collaborative editing capabilities
- **Image Support**: Image upload, resize, and embedding
- **Auto-save**: Automatic content preservation
- **Word Count**: Real-time document statistics
- **Themes**: Customizable editor themes
- **Plugins**: Extensible plugin system
- **Export Options**: Multiple export formats

## Lexical Integration

The package includes a complete Lexical editor implementation with:
- Custom nodes for rich content
- Advanced plugins for formatting
- Collaborative editing support
- Real-time updates
- Performance optimizations

## Themes

### GhostNoteTheme
Custom theme with GhostNote branding and styling:
```tsx
import { GhostNoteTheme } from "@ghostnote/editor";

// Used automatically in editor components
// Customizable colors, fonts, and styling
```

## Usage in Other Packages

```tsx
// Import editor components
import { Editor, CreateNotePage } from "../../editor/src";

function NoteEditPage({ noteId }: { noteId: string }) {
  return (
    <div>
      <Editor 
        onChange={handleChange}
        showToolbar={true}
      />
    </div>
  );
}
```

## Integration

### With Notes Package
- Note content editing and creation
- Metadata management
- Content versioning

### With Auth Package
- User-specific editor preferences
- Permission-based editing
- Collaborative permissions

### With Transparency Package
- Content originality tracking
- Clone detection integration
- Author verification

## Development

To extend editor functionality:
1. Add new components in `src/components/`
2. Create editor plugins in `src/lexical/`
3. Implement hooks in `src/hooks/`
4. Add themes in `src/themes/`
5. Export from `src/index.ts`
6. Update this README

## Dependencies

- **@lexical/react**: React integration for Lexical
- **@lexical/rich-text**: Rich text features
- **@lexical/list**: List functionality
- **@lexical/code**: Code formatting
- **@lexical/link**: Link handling
- **@lexical/image**: Image support
- **React**: Component framework
- **TypeScript**: Type safety
