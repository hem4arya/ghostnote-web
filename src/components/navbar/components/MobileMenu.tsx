'use client';

import { useState } from 'react';
import { User, Menu, X, Plus, Home, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

interface MobileMenuProps {
  isAuthenticated?: boolean;
}

export const MobileMenu = ({ 
  isAuthenticated = false
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
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

  const handleAuthClick = () => {
    setShowAuthForm(true);
    setIsOpen(false);
  };

  if (!actuallyAuthenticated) {
    return (
      <>
        <Button
          onClick={handleAuthClick}
          variant="ghost"
          size="icon"
          className="mobile-icon md:hidden"
          aria-label="Sign in"
        >
          <User className="h-5 w-5" />
        </Button>
        
        <AuthForm
          open={showAuthForm}
          onOpenChange={setShowAuthForm}
          view="sign_up"
        />
      </>
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
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
            <div className="p-3">
              {/* User Info */}
              <div className="px-3 py-3 border-b border-border bg-muted/30 rounded-lg mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-32">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Dashboard
                </Link>
                
                <Link 
                  href="/create" 
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  Create Note
                </Link>
                
                <div className="border-t border-border my-2" />
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
