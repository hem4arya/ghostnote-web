import { useState, useEffect } from 'react';
import type { UseResponsiveReturn } from '../../types';

export function useResponsive(): UseResponsiveReturn {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768);
      setIsTablet(width < 1024 && width >= 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenWidth
  };
}
