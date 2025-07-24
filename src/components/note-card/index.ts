/**
 * NoteCard Feature Barrel Exports
 * Centralized exports for the note-card feature module
 */

// Main component
export { default as NoteCard, NoteCard as NoteCardComponent } from './NoteCard';

// Types
export type * from './NoteCard.types';
export { NOTE_CATEGORIES, DIFFICULTY_LEVELS } from './NoteCard.types';

// Sample data
export { 
  sampleNotes, 
  categories, 
  getNotesByCategory,
  getNotesByDifficulty,
  getPopularNotes,
  getRecentNotes
} from './sampleNotes';

// Utilities
export { noteToast } from './utils/noteToast';

// Default export
export { default } from './NoteCard';
