'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveNote, autoSave, loadDraft, clearDraft, type SaveNoteResult, type AutoSaveOptions } from '../logic/noteApi';
import type { NoteFormData } from '../types';

export interface UseSaveNoteReturn {
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  saveNote: (noteData: NoteFormData) => Promise<SaveNoteResult>;
  saveAndRedirect: (noteData: NoteFormData, redirectPath?: string) => Promise<void>;
  triggerAutoSave: (options: AutoSaveOptions) => Promise<void>;
  loadDraftData: () => Promise<AutoSaveOptions | null>;
  clearDraftData: () => Promise<void>;
  markDirty: () => void;
  markClean: () => void;
}

export function useSaveNote(): UseSaveNoteReturn {
  const router = useRouter();
  const [isLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleSaveNote = useCallback(async (noteData: NoteFormData): Promise<SaveNoteResult> => {
    setIsSaving(true);
    try {
      const result = await saveNote(noteData);
      if (result.success) {
        setLastSaved(new Date());
        setIsDirty(false);
        await clearDraft();
      }
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const saveAndRedirect = useCallback(async (noteData: NoteFormData, redirectPath = '/dashboard') => {
    const result = await handleSaveNote(noteData);
    if (result.success) {
      router.push(redirectPath);
    }
  }, [handleSaveNote, router]);

  const triggerAutoSave = useCallback(async (options: AutoSaveOptions) => {
    try {
      const success = await autoSave(options);
      if (success) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, []);

  const loadDraftData = useCallback(async () => {
    try {
      return await loadDraft();
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, []);

  const clearDraftData = useCallback(async () => {
    try {
      await clearDraft();
      setLastSaved(null);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  // Auto-save timer cleanup
  useEffect(() => {
    return () => {
      // Clean up any pending auto-save operations
    };
  }, []);

  return {
    isLoading,
    isSaving,
    lastSaved,
    isDirty,
    saveNote: handleSaveNote,
    saveAndRedirect,
    triggerAutoSave,
    loadDraftData,
    clearDraftData,
    markDirty,
    markClean
  };
}
