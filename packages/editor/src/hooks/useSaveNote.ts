import { useState, useCallback } from 'react';
import { NoteFormData } from '../types';

export function useSaveNote() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveNote = useCallback(async (noteData: NoteFormData) => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveNote,
    isSaving,
    lastSaved
  };
}
