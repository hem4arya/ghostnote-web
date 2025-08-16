/**
 * Settings Feature - Main exports
 * Following FSR pattern with centralized exports
 */

// Main settings page component
export { SettingsPage } from './pages/SettingsPage';
export { default } from './pages/SettingsPage';

// Settings components
export { ProfileSettings } from './components/ProfileSettings';
export { PreferencesSettings } from './components/PreferencesSettings';
export { AvatarUpload } from './components/AvatarUpload';

// Types
export type {
  Profile,
  SettingsFormData,
  SettingsPageProps,
  ProfileSettingsProps,
  PreferencesSettingsProps
} from './types';

// Hooks
export { useProfile } from './hooks/useProfile';
export { useSettings } from './hooks/useSettings';