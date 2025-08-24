/**
 * User Profile Feature Types
 * Type definitions for user profile components and data structures
 */

export interface PublicProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at?: string;
  notes_count?: number;
  sales_count?: number;
  views_count?: number;
}

export interface PublishedNote {
  id: string;
  title: string;
  content?: string;
  body?: string; // Some notes might use 'body' instead of 'content'
  excerpt?: string;
  created_at: string;
  updated_at?: string;
  is_published: boolean;
  user_id: string; // Changed from author_id to user_id
  tags?: string[];
  views_count?: number;
}

export interface UserProfilePageProps {
  username: string;
}

export interface ProfileHeaderProps {
  profile: PublicProfile | null;
  loading: boolean;
}

export interface PublishedNotesProps {
  notes: PublishedNote[];
  loading: boolean;
  username: string;
}