// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Database = {
  public : {
    Tables: {
      notes: {
        Row: {
          id: number; // bigint in PostgreSQL becomes number in TypeScript
          title: string | null;
          content: string | null;
          category?: string; // Not in schema, but used in your app
          is_published: boolean;
          price: number | null; // bigint
          user_id: string | null; // uuid
          created_at: string;
          word_handle: string | null;
          view_count: number; // bigint
        };
        Insert: {
          title?: string | null;
          content?: string | null;
          category?: string;
          is_published?: boolean;
          price?: number | null;
          user_id?: string | null;
          created_at?: string;
          word_handle?: string | null;
          view_count?: number;
        };
        Update: {
          title?: string | null;
          content?: string | null;
          category?: string;
          is_published?: boolean;
          price?: number | null;
          user_id?: string | null;
          created_at?: string;
          word_handle?: string | null;
          view_count?: number;
        };
      };
      purchases: {
        Row: {
          id: number; // bigint
          note_id: number; // bigint
          buyer_id: string | null; // uuid
          created_at: string;
        };
        Insert: {
          note_id: number;
          buyer_id?: string | null;
          created_at?: string;
        };
        Update: {
          note_id?: number;
          buyer_id?: string | null;
          created_at?: string;
        };
      };
      note_views: {
        Row: {
          note_id: number; // bigint, but also primary key with user_id
          user_id: string; // uuid, primary key with note_id
          created_at: string;
        };
        Insert: {
          note_id: number;
          user_id?: string;
          created_at?: string;
        };
        Update: {
          note_id?: number;
          user_id?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string; // uuid
          username: string;
          email: string | null;
          bio: string | null;
          avatar_url: string | null;
          notes_count: number; // bigint
          sales_count: number; // bigint
          views_count: number; // bigint
          is_private: boolean;
          referral_code: string | null;
          account_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          notes_count?: number;
          sales_count?: number;
          views_count?: number;
          is_private?: boolean;
          referral_code?: string | null;
          account_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          notes_count?: number;
          sales_count?: number;
          views_count?: number;
          is_private?: boolean;
          referral_code?: string | null;
          account_type?: string;
          created_at?: string;
        };
      };
    };
  } }


let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

// For backward compatibility
export function createClientComponentClient<T = Database>(): SupabaseClient<T> {
  return getSupabaseClient() as SupabaseClient<T>;
}