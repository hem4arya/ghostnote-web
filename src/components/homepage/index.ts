/**
 * Homepage Feature - Main exports
 * Following FSR pattern with Theme System integration
 */

// Main homepage component (to be created)
export { Homepage } from './Homepage';
export { default } from './Homepage';

// Sections
export { Hero } from './sections/Hero';
export { NoteCard } from './sections/NoteCard';
export { Footer } from './sections/Footer';

// Modals
export { AuthModal } from './modals/AuthModal';

// Data
export { sampleNotes, categories } from './data';

// Types
export type {
  Note,
  AuthModalProps,
  NoteCardProps,
  HomepageProps,
  AuthMode,
  AuthFormData,
  CategoryFilterProps
} from './types';

// Hooks (if any)
export * from './hooks';
