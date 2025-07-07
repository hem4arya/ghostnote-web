'use client';

import { Search, Settings, User, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick?: () => void;
}

const Navbar = ({ onLoginClick, onSignUpClick }: NavbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      onLoginClick();
    }
  };

  // Focus the search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-ghost-purple/20 bg-ghost-dark/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 sm:h-16 md:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative group">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent">
              GhostNote
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-ghost-purple/20 to-ghost-neon/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-10 bg-ghost-gray/50 border-ghost-purple/30 text-white text-base placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-11"
            />
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 text-base md:text-lg h-11"
            onClick={onLoginClick}
          >
            Login
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0 text-base md:text-lg h-11"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 h-11 w-11">
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu and Search */}
        <div className="md:hidden flex items-center space-x-3">
          {isSearchOpen ? (
            <div className="absolute inset-x-0 top-0 h-16 bg-ghost-dark/95 backdrop-blur-md border-b border-ghost-purple/20 px-4 flex items-center animate-in fade-in duration-200">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search notes..."
                  className="pl-11 pr-11 bg-ghost-gray/50 border-ghost-purple/30 text-white text-base placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-11"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSearchOpen(false)} 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-gray-400 hover:text-ghost-neon"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0 h-11 w-11"
              >
                <Search className="h-6 w-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onLoginClick} 
                className="text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0 h-11 w-11"
              >
                <User className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
