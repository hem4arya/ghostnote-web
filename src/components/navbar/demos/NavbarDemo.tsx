'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import { MobileMenu, UserDropdown, NavbarSearch, NavigationButtons } from '../components';
import type { User, SearchSuggestion } from '../types';

// Mock data for demo
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  isPremium: true,
  createdAt: '2024-01-01',
  preferences: {
    theme: 'dark',
    searchHistory: ['React components', 'TypeScript tips', 'Next.js routing'],
    recentlyViewed: ['note-1', 'note-2', 'note-3']
  }
};

const mockSuggestions: SearchSuggestion[] = [
  {
    id: '1',
    title: 'React Best Practices',
    type: 'note',
    excerpt: 'Learn the best practices for React development...',
    timestamp: '2 hours ago',
    relevance: 0.95
  },
  {
    id: '2',
    title: 'TypeScript Advanced Types',
    type: 'recent',
    excerpt: 'Deep dive into TypeScript advanced type system...',
    timestamp: '1 day ago',
    relevance: 0.87
  },
  {
    id: '3',
    title: 'Next.js Performance Tips',
    type: 'trending',
    excerpt: 'Optimize your Next.js application for better performance...',
    timestamp: '3 days ago',
    relevance: 0.82
  }
];

export function NavbarDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const handleLogin = () => {
    console.log('Login clicked');
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const handleSignOut = () => {
    console.log('Sign out clicked');
    setIsAuthenticated(false);
    setUser(undefined);
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
    setSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-ghost-dark">
      {/* Main Navbar Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 px-4">Full Navbar Component</h2>
        <Navbar
          onLoginClick={handleLogin}
          onSignUpClick={handleSignUp}
          user={user}
          isAuthenticated={isAuthenticated}
        />
      </section>

      {/* Demo Controls */}
      <div className="px-4 mb-8">
        <div className="bg-ghost-purple/10 border border-ghost-purple/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Demo Controls</h3>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setIsAuthenticated(!isAuthenticated)}
              className="px-4 py-2 bg-ghost-purple rounded-lg text-white hover:bg-ghost-purple/80"
            >
              Toggle Auth: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="px-4 py-2 bg-ghost-neon rounded-lg text-ghost-dark hover:bg-ghost-neon/80"
            >
              Toggle Search
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Individual Component Demos */}
      <div className="px-4 space-y-8">
        {/* Mobile Menu Demo */}
        <section className="bg-ghost-purple/5 border border-ghost-purple/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Mobile Menu Component</h3>
          <div className="flex justify-center">
            <MobileMenu
              isAuthenticated={isAuthenticated}
              onLoginClick={handleLogin}
            />
          </div>
        </section>

        {/* User Dropdown Demo */}
        {isAuthenticated && user && (
          <section className="bg-ghost-purple/5 border border-ghost-purple/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">User Dropdown Component</h3>
            <div className="flex justify-center">
              <UserDropdown
                user={user}
                onSignOut={handleSignOut}
              />
            </div>
          </section>
        )}

        {/* Navigation Buttons Demo */}
        <section className="bg-ghost-purple/5 border border-ghost-purple/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Navigation Buttons Component</h3>
          <div className="flex justify-center">
            <NavigationButtons
              isAuthenticated={isAuthenticated}
              onSignUpClick={handleSignUp}
              showCreateButton={true}
            />
          </div>
        </section>

        {/* Search Demo */}
        <section className="bg-ghost-purple/5 border border-ghost-purple/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Navbar Search Component</h3>
          <div className="relative">
            <NavbarSearch
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
              onSearch={handleSearch}
              suggestions={mockSuggestions}
              recentSearches={user?.preferences?.searchHistory || []}
              placeholder="Search demo notes..."
            />
            {!searchOpen && (
              <div className="text-center">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-ghost-purple to-ghost-neon rounded-lg text-white font-medium hover:opacity-80"
                >
                  Open Search Demo
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Props Documentation */}
        <section className="bg-ghost-purple/5 border border-ghost-purple/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Current State</h3>
          <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300">
            <pre>{JSON.stringify({
              isAuthenticated,
              searchOpen,
              user: user ? {
                name: user.name,
                email: user.email,
                isPremium: user.isPremium
              } : null
            }, null, 2)}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NavbarDemo;
