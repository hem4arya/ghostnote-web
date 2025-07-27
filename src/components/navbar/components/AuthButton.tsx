'use client';

import { useAuth } from '../hooks/useAuth';
import { UserDropdown } from './UserDropdown';

interface AuthButtonProps {
  className?: string;
}

export const AuthButton = ({ className = "" }: AuthButtonProps) => {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
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
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      isPremium: false // TODO: Implement premium status check
    };

    return (
      <UserDropdown
        user={userData}
        onSignOut={handleSignOut}
      />
    );
  }

  return null;
};
