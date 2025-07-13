// Simple wrapper for the Note Reader feature
export { default as NoteReaderPage } from '@/features/note-reader/NoteReaderPage';

// Re-export commonly used components and hooks
export {
  ReaderContent,
  ReaderSidebar,
  ReaderHeader,
  LoadingState,
  ErrorState,
  useNoteAccess,
  useReaderSettings
} from '@/features/note-reader';

// Re-export types
export type {
  Note,
  AccessType,
  ColorScheme,
  ReaderSettings
} from '@/features/note-reader';
