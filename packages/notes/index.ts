// Notes Package - Main Exports
// Export note-related components and functionality

// Core Components
export { default as NoteCard } from './src/components/NoteCard';
export { default as NoteDetail } from './src/components/NoteDetail';
export { default as NoteEditor } from './src/components/NoteEditor';
export { default as CreateNoteForm } from './src/components/CreateNoteForm';

// Editor Components
export { default as EditorHeader } from './src/components/editor/EditorHeader';
export { default as FormattingToolbar } from './src/components/editor/FormattingToolbar';
export { default as WordCountWidget } from './src/components/editor/WordCountWidget';
export { default as ImageToolbox } from './src/components/editor/ImageToolbox';
export { default as HelpModal } from './src/components/editor/HelpModal';

// Hooks
export { useFormatting } from './src/hooks/useFormatting';
export { useResponsive } from './src/hooks/useResponsive';
export { useImageState } from './src/hooks/useImageState';
export { useImageInteraction } from './src/hooks/useImageInteraction';
export { useHelpModal } from './src/hooks/useHelpModal';

// Data
export { sampleNotes } from './src/data/sampleNotes';

// Types
export type { Note } from './src/components/NoteCard';
