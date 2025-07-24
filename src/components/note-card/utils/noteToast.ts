/**
 * Note Toast Utilities - Centralized toast notifications for note actions
 * Provides consistent messaging for note-related operations
 */

import { toast } from 'sonner';
import type { Note, NoteToastOptions } from '../NoteCard.types';

const defaultOptions: NoteToastOptions = {
  duration: 2000,
  position: 'top-right',
};

export const noteToast = {
  /**
   * Show purchase loading toast
   */
  purchaseLoading: (note: Note, options?: NoteToastOptions) => {
    return toast.loading(`Processing purchase for "${note.title}"...`, {
      duration: options?.duration || 1500,
    });
  },

  /**
   * Show purchase success toast
   */
  purchaseSuccess: (note: Note, options?: NoteToastOptions) => {
    return toast.success(`Successfully purchased "${note.title}"!`, {
      duration: options?.duration || defaultOptions.duration,
      description: 'You can now access the full content',
    });
  },

  /**
   * Show purchase error toast
   */
  purchaseError: (note: Note, error?: string, options?: NoteToastOptions) => {
    return toast.error(`Failed to purchase "${note.title}"`, {
      duration: options?.duration || defaultOptions.duration,
      description: error || 'Please try again later',
    });
  },

  /**
   * Show favorite added toast
   */
  favoriteAdded: (note: Note, options?: NoteToastOptions) => {
    return toast.success(`Added "${note.title}" to favorites`, {
      duration: options?.duration || defaultOptions.duration,
    });
  },

  /**
   * Show favorite removed toast
   */
  favoriteRemoved: (note: Note, options?: NoteToastOptions) => {
    return toast.success(`Removed "${note.title}" from favorites`, {
      duration: options?.duration || defaultOptions.duration,
    });
  },

  /**
   * Show share success toast
   */
  shareSuccess: (note: Note, options?: NoteToastOptions) => {
    return toast.success(`Shared "${note.title}"`, {
      duration: options?.duration || defaultOptions.duration,
      description: 'Link copied to clipboard',
    });
  },

  /**
   * Show generic error toast
   */
  error: (message: string, description?: string, options?: NoteToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || defaultOptions.duration,
      description,
    });
  },

  /**
   * Show generic success toast
   */
  success: (message: string, description?: string, options?: NoteToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || defaultOptions.duration,
      description,
    });
  },

  /**
   * Show info toast
   */
  info: (message: string, description?: string, options?: NoteToastOptions) => {
    return toast.info(message, {
      duration: options?.duration || defaultOptions.duration,
      description,
    });
  }
};

export default noteToast;
