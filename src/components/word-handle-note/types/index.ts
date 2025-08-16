/**
 * Word Handle Note Feature Types
 * Type definitions for word handle note components and data structures
 */

export interface WordHandleNote {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  word_handle: string | null;
  price?: number;
  is_published?: boolean;
}

export interface WordHandleNotePageProps {
  wordHandle: string;
  className?: string;
}

export interface UseWordHandleNoteReturn {
  note: WordHandleNote | null;
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
  checkingAccess: boolean;
  user: { id: string } | null;
  refreshAccess: () => Promise<void>;
}