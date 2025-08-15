/**
 * useSettings Hook
 * Custom hook for managing general settings functionality
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/navbar/hooks/useAuth';

export const useSettings = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not authenticated
  const checkAuth = () => {
    if (!authLoading && !user) {
      router.push('/');
      return false;
    }
    return true;
  };

  // Navigation helpers
  const goBack = () => {
    router.back();
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return {
    user,
    loading: authLoading,
    activeTab,
    setActiveTab,
    checkAuth,
    goBack,
    goToDashboard
  };
};