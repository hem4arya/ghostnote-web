'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, FileText, Crown, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';

interface UserDropdownProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    isPremium?: boolean;
  };
  onSignOut?: () => void;
}

export const UserDropdown = ({ user, onSignOut }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const menuItems = [
    { href: '/dashboard', icon: FileText, label: 'My Notes' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (user.isPremium) {
    menuItems.splice(1, 0, { href: '/premium', icon: Crown, label: 'Premium Dashboard' });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10 px-2 py-1"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || 'User'}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover border border-ghost-purple/30"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          
          {/* Premium Badge */}
          {user.isPremium && (
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 border border-ghost-dark">
              <Crown className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
            </div>
          )}
        </div>

        {/* User Name (Hidden on mobile) */}
        <span className="hidden sm:block text-sm font-medium truncate max-w-24">
          {user.name || 'User'}
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-ghost-dark border border-ghost-purple/20 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="p-4 border-b border-ghost-purple/20 bg-ghost-purple/5">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || 'User'}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover border border-ghost-purple/30"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || 'User'}
                  </p>
                  {user.isPremium && (
                    <Crown className="h-3 w-3 text-yellow-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            {/* Premium Upgrade (if not premium) */}
            {!user.isPremium && (
              <>
                <div className="border-t border-ghost-purple/20 my-2" />
                <Link
                  href="/premium"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Link>
              </>
            )}

            {/* Sign Out */}
            <div className="border-t border-ghost-purple/20 my-2" />
            <button
              onClick={() => {
                onSignOut?.();
                closeDropdown();
              }}
              className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
