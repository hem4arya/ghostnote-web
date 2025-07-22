'use client';

import { useState } from 'react';
import { Menu, X, Search, User, Settings, Home, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface MobileMenuProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onSearchClick?: () => void;
}

export const MobileMenu = ({ 
  isAuthenticated = false, 
  onLoginClick, 
  onSignUpClick, 
  onSearchClick 
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: FileText, label: 'My Notes', auth: true },
    { href: '/create', icon: Plus, label: 'Create Note', auth: true },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Content */}
          <div className="fixed top-0 right-0 h-full w-64 glass-morphism border-l border-white/20 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMenu}
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-2">
              {/* Search */}
              <Button
                variant="ghost"
                onClick={() => {
                  onSearchClick?.();
                  closeMenu();
                }}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Search className="h-4 w-4 mr-3" />
                Search Notes
              </Button>

              {/* Navigation Links */}
              {menuItems.map((item) => {
                if (item.auth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="border-t border-white/10 my-4" />

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      onLoginClick?.();
                      closeMenu();
                    }}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      onSignUpClick?.();
                      closeMenu();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/settings"
                    onClick={closeMenu}
                    className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
