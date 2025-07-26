'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-toastify';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let hasInitialized = false;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          hasInitialized = true;
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only show toast after initialization and for actual user events
        if (hasInitialized && event !== 'TOKEN_REFRESHED') {
          if (event === 'SIGNED_IN' && session?.user) {
            if (session?.user.last_sign_in_at === session?.user.created_at) {
              toast.success('Signup successful! Please check your email to confirm your account.');
            } else {
              toast.success('Welcome back!');
            }
          } else if (event === 'SIGNED_OUT' && !session?.user) {
            toast.success('Logged out successfully.');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Signup successful! Please check your email to confirm your account.');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const message = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Success toast will be handled by onAuthStateChange
    } catch (error: unknown) {
      console.error('Signin error:', error);
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Success toast will be handled by onAuthStateChange
    } catch (error: unknown) {
      console.error('Signout error:', error);
      const message = error instanceof Error ? error.message : 'Logout failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
