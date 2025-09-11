/**
 * Dynamic Slug Page
 * Route: /[slug]
 * Handles both user profiles (single word) and word-handle notes (word-word)
 */

import { notFound } from 'next/navigation';
import { getSupabaseClient } from '@lib/supabase';
import { WordHandleNotePage } from '@/components/word-handle-note';
import { UserProfilePage } from '@/components/user-profile';

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper function to determine if slug is a word-handle (contains hyphen)
const isWordHandle = (slug: string): boolean => {
  return slug.includes('-') && slug.split('-').length >= 2;
};

// Helper function to check if note exists by word_handle
async function checkNoteExists(wordHandle: string) {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, word_handle')
      .eq('word_handle', wordHandle)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

// Helper function to check if profile exists by username
async function checkProfileExists(username: string) {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  
  // Decode the slug in case it has URL encoding
  const decodedSlug = decodeURIComponent(slug);
  
  // Check if slug contains hyphen (word-handle pattern)
  if (isWordHandle(decodedSlug)) {
    // Check if note exists with this word_handle
    const note = await checkNoteExists(decodedSlug);
    
    if (note) {
      // Render WordHandleNotePage component
      return <WordHandleNotePage wordHandle={decodedSlug} />;
    }
  } else {
    // Single word - check if profile exists with this username
    const profile = await checkProfileExists(decodedSlug);
    
    if (profile) {
      // Render UserProfilePage component
      return <UserProfilePage username={decodedSlug} />;
    }
  }
  
  // Neither note nor profile found - return 404
  notFound();
}