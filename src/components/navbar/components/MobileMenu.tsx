'use client';

import { useState } from 'react';
import { User, Menu, X, Plus, Home, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

interface MobileMenuProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
}

export const MobileMenu = ({ 
  isAuthenticated = false, 
  onLoginClick
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const actuallyAuthenticated = isAuthenticated || !!user;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!actuallyAuthenticated) {
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
  }

  return (
    <div className="md:hidden relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="mobile-icon"
        aria-label="Menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-2">
              {/* User Info */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                
                <Link 
                  href="/create" 
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  Create Note
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
