/**
 * useUserProfile Hook
 * Custom hook for fetching public user profile and published notes
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@lib/supabase';
import { toast } from 'sonner';
import type { PublicProfile, PublishedNote } from '../types';

export const useUserProfile = (username: string) => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [notes, setNotes] = useState<PublishedNote[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  // Decode the username parameter (handles URL encoding like %40 for @)
  const decodedUsername = decodeURIComponent(username);

  // Fetch user profile by username
  const fetchProfile = useCallback(async () => {
    if (!decodedUsername) return;

    try {
      setProfileLoading(true);
      setError(null);
      console.log('Fetching profile for username:', decodedUsername);
      console.log('Original username param:', username);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', decodedUsername)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          setError('User not found');
          setProfile(null);
          return;
        }
        
        console.error('Error fetching profile:', error);
        setError('Failed to load user profile');
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    } finally {
      setProfileLoading(false);
    }
  }, [decodedUsername, username, supabase]);

  // Fetch published notes by user
  const fetchPublishedNotes = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setNotesLoading(true);
      console.log('Fetching published notes for user:', profile.id);
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      console.log('Notes fetch result:', { data, error });

      if (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to load published notes');
        return;
      }

      if (data) {
        setNotes(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading notes');
    } finally {
      setNotesLoading(false);
    }
  }, [profile?.id, supabase]);

  // Fetch profile when username changes
  useEffect(() => {
    if (decodedUsername) {
      fetchProfile();
    }
  }, [decodedUsername, fetchProfile]);

  // Fetch notes when profile is loaded
  useEffect(() => {
    if (profile?.id) {
      fetchPublishedNotes();
    }
  }, [profile?.id, fetchPublishedNotes]);

  return {
    profile,
    notes,
    profileLoading,
    notesLoading,
    error,
    refetchProfile: fetchProfile,
    refetchNotes: fetchPublishedNotes
  };
};