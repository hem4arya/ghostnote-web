/**
 * useNavbarVisibility Hook
 * Manages navbar visibility and body scroll when dialogs are open
 */

import { useEffect } from 'react';

export const useNavbarVisibility = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Hide navbar and prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Try multiple selectors to find the navbar
      const navbarSelectors = [
        '.navbar-container',
        'nav',
        '[data-navbar]',
        'header',
        '.navbar',
        '.nav-bar',
        '.navigation'
      ];
      
      let navbar: HTMLElement | null = null;
      for (const selector of navbarSelectors) {
        navbar = document.querySelector(selector) as HTMLElement;
        if (navbar) break;
      }
      
      if (navbar) {
        navbar.style.display = 'none';
        navbar.setAttribute('data-hidden-by-auth', 'true');
      }
    } else {
      // Restore navbar and body scroll
      document.body.style.overflow = 'unset';
      
      // Restore any navbar that was hidden
      const hiddenNavbar = document.querySelector('[data-hidden-by-auth="true"]') as HTMLElement;
      if (hiddenNavbar) {
        hiddenNavbar.style.display = '';
        hiddenNavbar.removeAttribute('data-hidden-by-auth');
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      const hiddenNavbar = document.querySelector('[data-hidden-by-auth="true"]') as HTMLElement;
      if (hiddenNavbar) {
        hiddenNavbar.style.display = '';
        hiddenNavbar.removeAttribute('data-hidden-by-auth');
      }
    };
  }, [isOpen]);
};