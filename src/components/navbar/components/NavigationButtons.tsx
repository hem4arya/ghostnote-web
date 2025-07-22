'use client';

import { User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface NavigationButtonsProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  showCreateButton?: boolean;
}

export const NavigationButtons = ({
  isAuthenticated = false,
  onLoginClick,
  onSignUpClick,
  showCreateButton = true
}: NavigationButtonsProps) => {
  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center gap-3">
        {showCreateButton && (
          <Link href="/create">
            <Button
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium px-4 flex items-center gap-2 rounded-lg backdrop-blur-md"
            >
              Create Note
            </Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium px-4 flex items-center gap-2 rounded-lg backdrop-blur-md"
          >
            My Notes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      {/* Auth Buttons */}
      <Button
        onClick={onLoginClick}
        variant="ghost"
        className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 rounded-lg backdrop-blur-md"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>

      <Button
        onClick={onSignUpClick}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 flex items-center gap-2 shadow-md rounded-lg transition-all duration-200"
      >
        <User className="h-4 w-4" />
        Get Started
      </Button>
    </div>
  );
};

export default NavigationButtons;
