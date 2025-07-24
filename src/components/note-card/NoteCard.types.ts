/**
 * NoteCard Types - Complete type definitions for note system
 * Centralized type definitions for note cards and related functionality
 */

export interface Note {
  id: number;
  title: string;
  previewText: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isPurchased?: boolean;
  isPublic?: boolean;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime?: number; // in minutes
}

export interface NoteCardProps {
  note: Note;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  onPurchase?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
}

export interface NotePurchaseOptions {
  noteId: number;
  userId?: string;
  paymentMethod?: string;
  redirectPath?: string;
}

export interface NoteToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  theme?: 'light' | 'dark';
}

// Category definitions
export const NOTE_CATEGORIES = [
  'Development',
  'AI/ML',
  'Design',
  'Business',
  'Finance',
  'Science',
  'Technology',
  'Other'
] as const;

export type NoteCategory = typeof NOTE_CATEGORIES[number];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced'
] as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
