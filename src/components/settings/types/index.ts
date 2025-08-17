/**
 * Settings Feature Types
 * Type definitions for settings components and data structures
 */

export interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at?: string; // Optional since your table might not have this
  updated_at?: string; // Optional since your table doesn't have this
}

export interface SettingsFormData {
  username: string;
  bio: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SettingsPageProps {
  // Add any props if needed in the future
}

export interface ProfileSettingsProps {
  profile: Profile | null;
  loading: boolean;
  onSave: (data: SettingsFormData) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PreferencesSettingsProps {
  // Add preferences props when implemented
}

export interface Note {
  id: number;
  title: string;
  previewText: string;
  content: string;
  user_id: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  description?: string;
  tags?: string[];
  isPurchased?: boolean;
  isPublic?: boolean;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}