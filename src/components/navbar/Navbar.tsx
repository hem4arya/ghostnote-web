'use client';

import { Search, ChevronLeft, } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useNavbar } from './hooks/useNavbar';
import { NavbarProps } from './types';
import { UserDropdown } from './components/UserDropdown';
import { NavigationButtons } from './components/NavigationButtons';
import { MobileMenu } from './components/MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import './styles/navbar.css';

const Navbar = ({ 
  onLoginClick, 
  onSignUpClick, 
  user, 
  isAuthenticated = false
}: NavbarProps) => {
  const {
    isHomepage,
    searchPlaceholder,
    handleBack,
    navigateToSearch,
    handleAuth
  } = useNavbar(onLoginClick, onSignUpClick);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll behavior for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(lastScrollY > currentScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Toggle mobile search
  const toggleMobileSearch = () => setIsMobileSearchActive(prev => !prev);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToSearch(searchQuery);
      setIsMobileSearchActive(false);
    }
  };

  return (
    <>
      <header className={`navbar-container ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
        <div className="mx-auto flex h-16 items-center justify-between px-6 sm:px-8 gap-4 max-w-7xl">
          {/* Logo or Back Button */}
          <div className="flex items-center">
            {isHomepage ? (
              <Link href="/" className="flex items-center gap-2 group">
                <h1 className="logo-text">
                  GhostNote
                </h1>
              </Link>
            ) : (
              <Button 
                onClick={handleBack}
                variant="ghost" 
                className="back-button flex items-center gap-1 px-2"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Button>
            )}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 justify-center">
            <div className="relative w-full search-container">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="navbar-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      navigateToSearch(target.value.trim());
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <NavigationButtons 
                isAuthenticated={isAuthenticated}
                onSignUpClick={() => handleAuth('signup')}
              />
              {isAuthenticated && <UserDropdown user={user} onSignOut={() => console.log('sign out')} />}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle size={18} />
              <Button
                onClick={toggleMobileSearch}
                variant="ghost"
                size="icon"
                className="mobile-icon"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <MobileMenu 
                isAuthenticated={isAuthenticated}
                onLoginClick={() => handleAuth('login')}
              />
               {isAuthenticated && <UserDropdown user={user} onSignOut={() => console.log('sign out')} />}
            </div>
          </div>
        </div>
        
        {/* Mobile Search Dropdown */}
        {isMobileSearchActive && (
          <div className="mobile-search-overlay md:hidden">
            <form onSubmit={handleMobileSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="mobile-search-input"
                autoFocus
              />
            </form>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;