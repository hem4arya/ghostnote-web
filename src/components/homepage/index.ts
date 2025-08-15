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

// Modals - AuthModal removed, using AuthDialog instead

// Data
export { sampleNotes, categories } from './data';

// Types
export type {
  Note,
  NoteCardProps,
  HomepageProps,
  AuthMode,
  AuthFormData,
  CategoryFilterProps
} from './types';

// Hooks (if any)
export * from './hooks';
