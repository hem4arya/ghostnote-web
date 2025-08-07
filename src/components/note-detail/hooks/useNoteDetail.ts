/**
 * Note Detail Hooks - Simple note detail fetching from Supabase
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '../../../../lib/supabase';

// Simple note interface matching Supabase table structure
interface SimpleNote {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  price?: number;
  is_published?: boolean;
}

export const useNoteDetail = () => {
  const [note, setNote] = useState<SimpleNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const params = useParams();
  const id = params.id as string;
  const supabase = getSupabaseClient();

  // Fetch note data from Supabase and check access
  useEffect(() => {
    const fetchNoteAndCheckAccess = async () => {
      setIsLoading(true);
      setCheckingAccess(true);
      setError(null);
      
      try {
        // First, get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log('Current user:', user?.id);

        // Fetch the note
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single();

        if (noteError) {
          console.error('Error fetching note:', noteError);
          setError('Note not found');
          setNote(null);
          setIsLoading(false);
          setCheckingAccess(false);
          return;
        }

        setNote(noteData);
        console.log('Note fetched:', noteData.title, 'Owner:', noteData.user_id);

        // Check access permissions
        if (!user) {
          console.log('No user logged in, access denied');
          setHasAccess(false);
          setCheckingAccess(false);
          setIsLoading(false);
          return;
        }

        // Check if user is the owner
        if (user.id === noteData.user_id) {
          console.log('User is owner, granting access');
          setHasAccess(true);
          setCheckingAccess(false);
          setIsLoading(false);
          return;
        }

        // Check if user has purchased the note
        const { data: hasPurchased, error: purchaseError } = await supabase
          .rpc('has_user_purchased_note', { note_id_to_check: id });

        if (purchaseError) {
          console.error('Error checking purchase via RPC:', purchaseError);
        }

        if (hasPurchased) {
          console.log('User has purchased note, granting access');
          setHasAccess(true);
        } else {
          console.log('User has not purchased note, access denied');
          setHasAccess(false);
        }

      } catch (error) {
        console.error('Error in fetchNoteAndCheckAccess:', error);
        setError('Failed to load note');
        setNote(null);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
        setCheckingAccess(false);
      }
    };

    if (id) {
      fetchNoteAndCheckAccess();
    }
  }, [id, supabase]);

  const refreshAccess = async () => {
    setCheckingAccess(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !note) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      // Check if user is the owner
      if (user.id === note.user_id) {
        setHasAccess(true);
        setCheckingAccess(false);
        return;
      }

      // Check if user has purchased the note
      const { data: hasPurchased, error } = await supabase
        .rpc('has_user_purchased_note', { note_id_to_check: id });

      if (error) {
        console.error('Error checking purchase via RPC:', error);
      }

      setHasAccess(!!hasPurchased);
    } catch (error) {
      console.error('Error refreshing access:', error);
      setHasAccess(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  return {
    note,
    isLoading,
    error,
    hasAccess,
    checkingAccess,
    user,
    refreshAccess
  };
};
