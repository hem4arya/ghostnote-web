/**
 * Theme System Hook - Manages dark/light mode switching
 * Provides centralized theme state management for the application
 */

'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ghostnote-theme') as Theme;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setThemeState(savedTheme);
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    }
    
    // Save to localStorage
    localStorage.setItem('ghostnote-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    children
  );
};

// Utility function to get CSS variable value
export const getCSSVariable = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }
  return '';
};

// Utility function to set CSS variable value
export const setCSSVariable = (variable: string, value: string): void => {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty(variable, value);
  }
};

// Theme-aware utility functions
export const getThemeValue = (darkValue: string, lightValue: string): string => {
  if (typeof window !== 'undefined') {
    const isDark = !document.documentElement.hasAttribute('data-theme') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? darkValue : lightValue;
  }
  return darkValue; // Default to dark on server
};

export default useTheme;
