'use client';

import { Search, Settings, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick?: () => void;
}

const Navbar = ({ onLoginClick, onSignUpClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      onLoginClick();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-ghost-purple/20 bg-ghost-dark/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative group">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent">
              GhostNote
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-ghost-purple/20 to-ghost-neon/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-10 bg-ghost-gray/50 border-ghost-purple/30 text-white placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full"
            />
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0"
            onClick={onLoginClick}
          >
            Login
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0">
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 sm:px-6 py-3 pb-4 space-y-3 bg-ghost-dark/95 backdrop-blur-md border-b border-ghost-purple/20 animate-in slide-in-from-top-5 duration-200">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-10 bg-ghost-gray/50 border-ghost-purple/30 text-white placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-9"
            />
          </div>
          {/* Mobile Action Buttons */}
          <div className="flex flex-col space-y-2 pt-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 h-10"
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button 
              className="w-full bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium focus:outline-none focus:ring-0 h-10"
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 h-10">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
