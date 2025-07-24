/**
 * Theme Toggle Button Component
 * Provides a button to switch between dark and light themes
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme';

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
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative overflow-hidden">
        {/* Sun icon for dark mode (shows when in dark mode) */}
        <Sun
          size={size}
          className={`
            absolute inset-0 transition-all duration-500 ease-in-out transform
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
            }
          `}
        />
        
        {/* Moon icon for light mode (shows when in light mode) */}
        <Moon
          size={size}
          className={`
            transition-all duration-500 ease-in-out transform
            ${!isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
      
      {/* Subtle glow effect */}
      <div 
        className={`
          absolute inset-0 rounded-lg opacity-0 hover:opacity-20 
          transition-opacity duration-300
          ${isDark 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
            : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }
        `}
      />
    </button>
  );
};

export default ThemeToggle;
