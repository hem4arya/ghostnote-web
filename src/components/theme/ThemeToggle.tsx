/**
 * Theme Toggle Button Component
 * Provides a button to switch between dark and light themes
 * Moved to centralized theme module as per restructuring plan
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './useTheme'; // Adjust the import path as necessary

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 20 
}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        theme-toggle-btn
        relative p-2 rounded-lg
        bg-[var(--glass-bg)] 
        border border-[var(--glass-border)]
        backdrop-blur-sm
        text-[var(--icon-primary)]
        hover:text-[var(--icon-hover)]
        hover:bg-[var(--glass-bg)]
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[var(--ghost-purple)] focus:ring-opacity-50
        ${className}
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Toggle theme to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative flex items-center justify-center overflow-hidden">
        <Sun 
          size={size} 
          className={`transition-all duration-500 ease-in-out ${isDark ? 'transform -translate-y-8 opacity-0' : 'transform translate-y-0 opacity-100'}`}
        />
        <Moon 
          size={size} 
          className={`absolute transition-all duration-500 ease-in-out ${isDark ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'}`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
