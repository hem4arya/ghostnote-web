'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/ui/components/button';
import { User, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import { UserDropdown } from './UserDropdown';

interface AuthButtonProps {
  className?: string;
}

export const AuthButton = ({ className = "" }: AuthButtonProps) => {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-9 w-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const userData = {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: user.user_metadata?.avatar_url,
      isPremium: false // TODO: Implement premium status check
    };

    return (
      <div className={`relative ${className}`}>
        <Button
          onClick={() => setShowDropdown(!showDropdown)}
          variant="ghost"
          className="navbar-item flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden md:inline">
            {userData.name}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 z-50">
            <UserDropdown
              user={userData}
              onSignOut={handleSignOut}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="ghost"
        className={`navbar-item flex items-center gap-2 ${className}`}
      >
        <User className="h-4 w-4" />
        Login
      </Button>

      <AuthForm
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};
