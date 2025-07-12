// Components
export { LoadingState } from './components/LoadingState';
export { ErrorState } from './components/ErrorState';
export { ReaderHeader } from './components/ReaderHeader';
export { ReaderContent } from './components/ReaderContent';
export { ReaderSidebar } from './components/ReaderSidebar';

// Hooks
export { useNoteAccess } from './hooks/useNoteAccess';
export { useReaderSettings } from './hooks/useReaderSettings';

// Types
export type {
  Note,
  AccessType,
  ColorScheme,
  ReaderSettings,
  UseNoteAccessReturn,
  UseReaderSettingsReturn,
  ReaderHeaderProps,
  ReaderContentProps,
  ReaderSidebarProps,
  LoadingStateProps,
  ErrorStateProps
} from './types';

// Main page component - import directly from './NoteReaderPage' when needed
