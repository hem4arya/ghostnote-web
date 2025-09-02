// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { mockSupabaseClient } from './supabase-mock';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase credentials are properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (mockSupabaseClient as unknown as ReturnType<typeof createClient>);

export function getSupabaseClient() {
  return supabase;
}

export default getSupabaseClient;