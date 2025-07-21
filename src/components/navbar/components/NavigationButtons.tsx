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
              className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10"
            >
              Create Note
            </Button>
          </Link>
        )}
        
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10"
          >
            My Notes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      {/* Navigation Links */}
      <Link href="/demo">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10"
        >
          Demo
        </Button>
      </Link>

      <Link href="/pricing">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10"
        >
          Pricing
        </Button>
      </Link>

      {/* Auth Buttons */}
      <Button
        onClick={onLoginClick}
        variant="ghost"
        className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10 flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>

      <Button
        onClick={onSignUpClick}
        className="bg-gradient-to-r from-ghost-purple to-ghost-neon hover:from-ghost-purple/80 hover:to-ghost-neon/80 text-white font-medium px-6 flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Get Started
      </Button>
    </div>
  );
};

export default NavigationButtons;
