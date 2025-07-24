/**
 * Note Detail Hooks - Custom hooks for the note detail feature
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import type { Note } from '@/components/note-card';

// Mock data import - in a real app this would come from an API
import { sampleNotes } from '@/components/note-card';

export const useNoteDetail = () => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Fetch note data
  useEffect(() => {
    const fetchNote = () => {
      setIsLoading(true);
      try {
        // Find the note with the matching ID
        const foundNote = sampleNotes.find((n) => n.id === parseInt(id));
        setNote(foundNote || null);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handlePurchase = () => {
    // Show a loading toast
    toast.loading('Processing purchase...', {
      duration: 1500,
    });
    
    // In a real app, this would trigger a payment flow
    setTimeout(() => {
      setIsPurchased(true);
      toast.success(`Successfully purchased "${note?.title}"!`);
    }, 1500);
  };
  
  const handleReadNow = () => {
    router.push(`/reader/${id}`);
  };

  return {
    note,
    isLoading,
    isPurchased,
    handlePurchase,
    handleReadNow
  };
};
