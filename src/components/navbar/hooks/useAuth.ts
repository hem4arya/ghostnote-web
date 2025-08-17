'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../../lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
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
  const [initialized, setInitialized] = useState(false);
  const supabaseRef = useRef(getSupabaseClient());
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
    if (initialized) return; // Prevent multiple initializations
    
    let mounted = true;
    let lastEventTime = 0;
    const EVENT_COOLDOWN = 1000; // 1 second cooldown between similar events
    const supabase = supabaseRef.current;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
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
        setInitialized(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabaseRef.current.auth.signUp({
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
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabaseRef.current.auth.signInWithPassword({
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
  }, []);

  const router = useRouter();

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabaseRef.current.auth.signOut();
      setUser(null);
      setSession(null);
      // onAuthStateChange will handle the success toast
      router.refresh(); // Refresh the page to update auth state
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred during sign out.';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }, [router]);

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
