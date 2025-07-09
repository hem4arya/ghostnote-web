import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showToolbarMenu, setShowToolbarMenu] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse toolbar on small screens
      if (window.innerWidth < 768) {
        setShowToolbarMenu(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return {
    isMobile,
    showToolbarMenu,
    setShowToolbarMenu
  };
};
