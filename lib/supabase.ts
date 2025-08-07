import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Server-side client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side client (singleton to prevent multiple instances)
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (typeof window === 'undefined') {
    // Server-side: return the basic client
    return supabase;
  }
  
  // Client-side: return singleton instance
  if (!clientInstance) {
    try {
      // Try to use the auth-helpers client first
      clientInstance = createClientComponentClient();
    } catch (error) {
      // Fallback to basic client if auth-helpers fails
      console.warn('Failed to create auth client, falling back to basic client:', error);
      clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return clientInstance;
};

// Export a function to create client for edge cases
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey);

// Reset client instance (useful for testing or forced refresh)
export const resetClientInstance = () => {
  clientInstance = null;
};
