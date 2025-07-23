'use client';

import { User } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileMenuProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
}

export const MobileMenu = ({ 
  isAuthenticated = false, 
  onLoginClick
}: MobileMenuProps) => {
  // If authenticated, UserDropdown is rendered separately, so this component
  // should only render the login button for unauthenticated users.
  if (isAuthenticated) {
    return null;
  }

  return (
    <Button
      onClick={onLoginClick}
      variant="ghost"
      size="icon"
      className="mobile-icon md:hidden"
      aria-label="Sign in"
    >
      <User className="h-5 w-5" />
    </Button>
  );
};

export default MobileMenu;
