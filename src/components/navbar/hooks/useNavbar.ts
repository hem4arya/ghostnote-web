'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSearchPlaceholder } from '../utils/helpers';
import { AuthMode } from '../types';

export const useNavbar = (onLoginClick?: () => void, onSignUpClick?: () => void) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isHomepage = pathname === '/';
  const searchPlaceholder = getSearchPlaceholder(pathname);
  
  const handleBack = () => {
    router.back();
  };
  
  const navigateToSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const handleAuth = (mode: AuthMode) => {
    const clickHandler = mode === 'login' ? onLoginClick : onSignUpClick;
    
    if (clickHandler) {
      clickHandler();
    } else if (isHomepage) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
      }
    } else {
      router.push(`/?auth=${mode}`);
    }
  };
  
  // Handle auth URL parameters on the client side
  useEffect(() => {
    if (isHomepage && typeof window !== 'undefined') {
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
  }, [isHomepage]);
  
  return {
    isHomepage,
    searchPlaceholder,
    handleBack,
    navigateToSearch,
    handleAuth
  };
};
