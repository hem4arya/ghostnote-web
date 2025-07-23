'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface NavigationButtonsProps {
  isAuthenticated?: boolean;
  onSignUpClick?: () => void;
}

export const NavigationButtons = ({
  isAuthenticated = false,
  onSignUpClick,
}: NavigationButtonsProps) => {
  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Link href="/create">
          <Button
            variant="ghost"
            className="navbar-item flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="navbar-item"
          >
            Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center">
      <Button
        onClick={onSignUpClick}
        className="get-started-btn"
      >
        Get Started
      </Button>
    </div>
  );
};

export default NavigationButtons;
