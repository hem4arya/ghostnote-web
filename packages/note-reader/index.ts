// Components
export { LoadingState } from './src/components/LoadingState';
export { ErrorState } from './src/components/ErrorState';
export { ReaderHeader } from './src/components/ReaderHeader';
export { ReaderContent } from './src/components/ReaderContent';
export { ReaderSidebar } from './src/components/ReaderSidebar';

// Hooks
export { useNoteAccess } from './src/hooks/useNoteAccess';
export { useReaderSettings } from './src/hooks/useReaderSettings';

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
} from './src/types';

// Main page component - import directly from './NoteReaderPage' when needed
