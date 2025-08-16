/**
 * Word Handle Note Feature - Main exports
 * Following FSR pattern with centralized exports
 */

// Main word handle note page component
export { WordHandleNotePage } from './pages/WordHandleNotePage';
export { default } from './pages/WordHandleNotePage';

// Types
export type {
  WordHandleNote,
  WordHandleNotePageProps,
  UseWordHandleNoteReturn
} from './types';

// Hooks
export { useWordHandleNote } from './hooks/useWordHandleNote';