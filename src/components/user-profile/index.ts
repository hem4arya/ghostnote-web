/**
 * User Profile Feature - Main exports
 * Following FSR pattern with centralized exports
 */

// Main user profile page component
export { UserProfilePage } from './pages/UserProfilePage';
export { UserProfilePage as default } from './pages/UserProfilePage';

// User profile components
export { ProfileHeader } from './components/ProfileHeader';
export { PublishedNotes } from './components/PublishedNotes';

// Types
export type {
  PublicProfile,
  PublishedNote,
  UserProfilePageProps,
  ProfileHeaderProps,
  PublishedNotesProps
} from './types';

// Hooks
export { useUserProfile } from './hooks/useUserProfile';