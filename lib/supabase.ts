import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhdkfbpmxiqjrzkwhabb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZGtmYnBteGlxanJ6a3doYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTQ1ODgsImV4cCI6MjA2NzM5MDU4OH0.JJ4DDOu385ZeG_-hDp6LM-n11Xdi3ZTiixooOQheD2s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
