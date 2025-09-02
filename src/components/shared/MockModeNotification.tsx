"use client";

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@lib/supabase';

export const MockModeNotification = () => {
  const [isMockMode, setIsMockMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    // Check if we're in mock mode by testing a simple operation
    const checkMockMode = async () => {
      try {
        const { error } = await supabase.auth.getUser();
        if (error?.message?.includes('Mock mode')) {
          setIsMockMode(true);
        }
      } catch {
        setIsMockMode(true);
      }
    };
    
    checkMockMode();
  }, []);

  if (!isMockMode || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <span>⚠️ Running in Mock Mode - Supabase not configured</span>
        <a 
          href="/SUPABASE_SETUP_GUIDE.md" 
          target="_blank"
          className="underline hover:no-underline"
        >
          Setup Guide
        </a>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 text-black hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};