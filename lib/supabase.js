import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Export a function to create client for edge cases
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey);
//# sourceMappingURL=supabase.js.map