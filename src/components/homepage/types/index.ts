/**
 * Homepage Component Types
 * Centralized type definitions for homepage-related components
 */

export interface Note {
  id: number;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  author: string;
  price: number;
  previewText: string;
  isPublic: boolean;
}

// AuthModalProps removed - using AuthDialog instead

export interface NoteCardProps {
  note: Note;
}

export interface HomepageProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

export type AuthMode = 'login' | 'signup' | 'private';

export interface AuthFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  alias: string;
  phone: string;
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}
