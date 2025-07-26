/**
 * Note Detail Types - Type definitions for the note detail feature
 * Ensures consistency and type safety across the feature
 */

import type { Note as BaseNote } from '@/components/note-card';

// Use the BaseNote directly as it already has all the properties we need
export type Note = BaseNote;

export interface NoteDetailPageProps {
  className?: string;
}

export interface PurchaseSidebarProps {
  note: Note;
  isPurchased: boolean;
  onPurchase: () => void;
  onReadNow: () => void;
  className?: string;
}

export interface NoteContentProps {
  note: Note;
  isPurchased: boolean;
  whyBuyText: string;
  className?: string;
}

export interface NoteLoadingProps {
  className?: string;
}

export interface NoteNotFoundProps {
  className?: string;
}
