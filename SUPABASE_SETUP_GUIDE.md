# Supabase Setup Guide

## 🚨 Current Issue

Your Supabase configuration is invalid, causing the "DNS_PROBE_FINISHED_NXDOMAIN" error.

## ✅ Quick Fix Applied

I've added a mock Supabase client so your app will run locally without errors. You'll see "Mock mode - Supabase not configured" messages instead of crashes.

## 🔧 To Fix Properly - Choose One Option:

### Option 1: Create New Supabase Project (Recommended)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Create New Project**:

   - Click "New Project"
   - Choose organization
   - Enter project name (e.g., "ghostnote-app")
   - Enter database password
   - Select region closest to you
   - Click "Create new project"

3. **Get Your Credentials**:

   - Go to Settings → API
   - Copy "Project URL"
   - Copy "anon public" key

4. **Update .env.local**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Option 2: Use Existing Project

If you have an existing Supabase project:

1. Check the project URL in your Supabase dashboard
2. Verify the project is not paused/deleted
3. Get fresh API keys from Settings → API

### Option 3: Continue with Mock Mode

For development without database:

- The app will run but show mock messages
- All database operations will return mock responses
- Good for frontend development and testing

## 🗄️ Database Schema Setup

Once you have Supabase configured, you'll need to create these tables:

### 1. Enable RLS and Create Tables

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  notes_count BIGINT DEFAULT 0,
  sales_count BIGINT DEFAULT 0,
  views_count BIGINT DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  referral_code TEXT,
  account_type TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT false,
  price BIGINT DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  word_handle TEXT UNIQUE,
  view_count BIGINT DEFAULT 0
);

-- Create purchases table
CREATE TABLE purchases (
  id BIGSERIAL PRIMARY KEY,
  note_id BIGINT REFERENCES notes(id),
  buyer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create note_views table
CREATE TABLE note_views (
  note_id BIGINT REFERENCES notes(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (note_id, user_id)
);
```

### 2. Create RPC Functions

```sql
-- Function to check if user purchased a note
CREATE OR REPLACE FUNCTION has_user_purchased_note(note_id_to_check BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases
    WHERE note_id = note_id_to_check
    AND buyer_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Set Up Storage

1. Go to Storage in Supabase dashboard
2. Create bucket named "Avatars"
3. Set it to public
4. Configure RLS policies as needed

## 🚀 Testing Your Setup

1. **Update .env.local** with real credentials
2. **Restart your dev server**: `npm run dev`
3. **Test sign up/sign in** functionality
4. **Check browser console** for any remaining errors

## 🔍 Troubleshooting

- **Still getting DNS errors?** Double-check the project URL
- **Auth not working?** Verify the anon key is complete
- **Database errors?** Make sure tables are created
- **Storage errors?** Check if "Avatars" bucket exists

Your app is now running in mock mode and ready for proper Supabase configuration!
