import React from 'react';
import { TransparencyData } from '../types';
import { fetchNoteTransparencyWithCache } from '@/features/transparency/utils/transparencyApi';

/**
 * Hook for React components to easily access transparency data
 */
export function useTransparencyData(noteId: number, userId?: string) {
  const [data, setData] = React.useState<TransparencyData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        const transparencyData = await fetchNoteTransparencyWithCache(noteId, userId);
        setData(transparencyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transparency data');
      } finally {
        setLoading(false);
      }
    }

    if (noteId) {
      loadData();
    }
  }, [noteId, userId]);

  return { data, loading, error };
}
