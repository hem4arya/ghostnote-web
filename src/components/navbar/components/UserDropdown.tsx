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
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-full p-1 group"
      >
        <div className="relative">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || 'User'}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
          )}
          {user.isPremium && (
            <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400" />
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || 'User'}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </Link>
            ))}

            {!user.isPremium && (
              <>
                <div className="border-t border-border my-2" />
                <Link
                  href="/premium"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </Link>
              </>
            )}

            <div className="border-t border-border my-2" />
            <button
              onClick={() => {
                onSignOut?.();
                closeDropdown();
              }}
              className="flex items-center gap-3 px-4 py-2 w-full text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
