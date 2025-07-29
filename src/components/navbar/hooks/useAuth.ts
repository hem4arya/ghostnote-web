'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/supabase-js';
import { toast, Id } from 'react-toastify';

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
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      global: {
        headers: {
          'Accept': 'application/json'
        }
      }
    }
  });
  const toastId = useRef<Id | null>(null);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const showToast = (type: 'success' | 'info' | 'error', message: string) => {
    if (toastId.current && toast.isActive(toastId.current)) {
      toast.dismiss(toastId.current);
    }
    toastId.current = toast[type](message, {
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  useEffect(() => {
    let mounted = true;
    let lastEventTime = 0;
    const EVENT_COOLDOWN = 1000; // 1 second cooldown between similar events

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      const currentTime = Date.now();
      const currentUser = session?.user ?? null;
      const previousUser = userRef.current;
      
      setSession(session);
      setUser(currentUser);
      setLoading(false);

      // Only show toasts for actual state changes with cooldown
      if (currentTime - lastEventTime > EVENT_COOLDOWN) {
        if (event === 'SIGNED_IN' && currentUser && !previousUser) {
          showToast('success', 'Welcome back!');
          lastEventTime = currentTime;
        } else if (event === 'SIGNED_OUT' && !currentUser && previousUser) {
          showToast('info', 'Signed out successfully.');
          lastEventTime = currentTime;
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      showToast('success', 'Signup successful! Please check your email to confirm your account.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred during sign up.';
      showToast('error', message);
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
      if (error) throw error;
      // onAuthStateChange will handle the success toast
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred during sign in.';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // onAuthStateChange will handle the success toast
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred during sign out.';
      showToast('error', message);
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
