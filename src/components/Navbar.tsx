'use client';

import { Search, Settings, User, X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick?: () => void;
}

const Navbar = ({ onLoginClick, onSignUpClick }: NavbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  
  // Check if we're on a note detail page
  const isNoteDetailPage = pathname?.startsWith('/notes/');
  
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
      <div className="container mx-auto flex h-16 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Logo with Back Button on Note Detail Pages */}
        <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'md:flex w-0 md:w-auto opacity-0 md:opacity-100' : 'w-auto opacity-100'}`}>
          {isNoteDetailPage && (
            <Button 
              asChild 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-gray-300 hover:text-ghost-neon"
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.svg" 
              alt="GhostNote Logo" 
              width={28} 
              height={28} 
              className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent transition-opacity duration-300 group-hover:opacity-80">
              GhostNote
            </h1>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-6">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes, authors, and tags..."
              className="pl-11 pr-4 bg-ghost-gray/50 border-ghost-purple/30 text-white text-sm placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-10"
            />
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 text-sm"
            onClick={onLoginClick}
          >
            Login
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0 text-sm"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-ghost-cyan to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0 text-sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus-ring-0 h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Icons & Search */}
        <div className="md:hidden flex items-center justify-end flex-1">
          {isSearchOpen ? (
            <div className="w-full flex items-center animate-in fade-in duration-300">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  className="pl-12 pr-12 bg-ghost-gray/50 border-ghost-purple/30 text-white text-base placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-400 hover:text-ghost-neon"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0 h-12 w-12"
              >
                <Search className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLoginClick}
                className="text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0 h-12 w-12"
              >
                <User className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
