'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SearchState, AuthMode } from '../types';
import { getNavStyles, getSearchPlaceholder } from '../utils';

export const useNavbar = (onLoginClick?: () => void, onSignUpClick?: () => void) => {
  const [searchState, setSearchState] = useState<SearchState>({
    isOpen: false,
    query: ''
  });
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  // Get navigation styles based on current route
  const navStyles = getNavStyles(pathname);
  const { isHomepage, isNoteDetailPage, isDashboardPage, isAuthPage } = navStyles;
  
  // Get context-appropriate search placeholder
  const searchPlaceholder = getSearchPlaceholder(pathname);
  
  const handleBack = () => {
    if (isNoteDetailPage) {
      router.push('/dashboard');
    } else if (isDashboardPage) {
      router.push('/');
    } else {
      router.back();
    }
  };
  
  const openSearch = () => {
    setSearchState(prev => ({ ...prev, isOpen: true }));
  };
  
  const closeSearch = () => {
    setSearchState({ isOpen: false, query: '' });
  };
  
  const updateSearchQuery = (query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  };
  
  const navigateToSearch = (query?: string) => {
    const searchQuery = query || searchState.query;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    } else {
      router.push('/search');
    }
  };
  
  const handleAuth = (mode: AuthMode) => {
    const clickHandler = mode === 'login' ? onLoginClick : onSignUpClick;
    
    if (clickHandler) {
      clickHandler();
    } else if (pathname === '/') {
      // If we're on the homepage, dispatch custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
      }
    } else {
      // Navigate to homepage with auth parameter
      router.push(`/?auth=${mode}`);
    }
  };
  
  // Focus search input when opened
  useEffect(() => {
    if (searchState.isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchState.isOpen]);
  
  // Handle escape key for search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchState.isOpen) {
        closeSearch();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [searchState.isOpen]);
  
  // Handle auth URL parameters
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authParam = urlParams.get('auth') as AuthMode;
      
      if (authParam === 'login' || authParam === 'signup') {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { 
          detail: { mode: authParam } 
        }));
        
        // Clean up the URL
        const newUrl = `${window.location.pathname}${window.location.search.replace(/[?&]auth=\w+/, '')}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [pathname]);
  
  return {
    // State
    searchState,
    searchInputRef,
    
    // Route information
    isHomepage,
    isNoteDetailPage,
    isDashboardPage,
    isAuthPage,
    searchPlaceholder,
    
    // Actions
    handleBack,
    openSearch,
    closeSearch,
    updateSearchQuery,
    navigateToSearch,
    handleAuth
  };
};
