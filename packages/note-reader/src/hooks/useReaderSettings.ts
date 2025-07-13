'use client';

import { useState, useCallback } from 'react';
import type { ColorScheme, UseReaderSettingsReturn } from '../types';

export function useReaderSettings(): UseReaderSettingsReturn {
  const [fontSize, setFontSizeState] = useState(16);
  const [lineHeight, setLineHeightState] = useState(1.6);
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('dark');
  const [showSidebar, setShowSidebarState] = useState(false);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(Math.max(12, Math.min(24, size)));
  }, []);

  const setLineHeight = useCallback((height: number) => {
    setLineHeightState(Math.max(1.2, Math.min(2.5, height)));
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const toggleSidebar = useCallback(() => {
    setShowSidebarState(prev => !prev);
  }, []);

  return {
    fontSize,
    lineHeight,
    colorScheme,
    showSidebar,
    setFontSize,
    setLineHeight,
    setColorScheme,
    toggleSidebar
  };
}
