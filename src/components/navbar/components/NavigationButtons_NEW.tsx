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
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
            >
              Create Note
            </Button>
          </Link>
        )}
        
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
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
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>

      <Button
        onClick={onSignUpClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 flex items-center gap-2 shadow-sm"
      >
        <User className="h-4 w-4" />
        Get Started
      </Button>
    </div>
  );
};

export default NavigationButtons;
