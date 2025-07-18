"use client";

import { ArrowLeft, Menu, Search, Settings, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useNavbar } from "../hooks/useNavbar";
import { NavbarProps } from "../types";
import PrivateAccountSetup from "./PrivateAccountSetup";
import { UserDropdown } from "./UserDropdown";
import { Button } from "./ui/Button";

// For React 19 compatibility
const SearchIcon = Search as React.ElementType;
const SettingsIcon = Settings as React.ElementType;
const UserIcon = User as React.ElementType;
const MenuIcon = Menu as React.ElementType;
const XIcon = X as React.ElementType;
const ArrowLeftIcon = ArrowLeft as React.ElementType;

// Next.js component wrappers
const SafeLink = Link as React.ElementType;
const SafeImage = Image as React.ElementType;

/**
 * Main Navbar component for GhostNote - Beautiful Lovable design with modular overrides
 * Features: Responsive design, modular overrides, enhanced animations, cyber aesthetic
 */
export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLoginClick,
  onSignUpClick,
  route,
  overrides = {},
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showPrivateSetup, setShowPrivateSetup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use the useNavbar hook for internal state and logic
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchInputRef,
    isHomepage,
    isNoteDetailPage,
    currentRoute,
    setCurrentRoute,
  } = useNavbar({
    initialRoute: route || pathname,
  });

  // Update current route when prop or pathname changes
  useEffect(() => {
    setCurrentRoute(route || pathname || "/");
  }, [route, pathname, setCurrentRoute]);

  // Handle login click
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setShowPrivateSetup(true);
    }
  };

  // Handle signup button click
  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      router.push("/dashboard");
    }
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentRoute]);

  // Determine if we should show back button or logo
  const showBackButton = !isHomepage && isNoteDetailPage;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-ghost-purple/20 bg-ghost-dark/85 backdrop-blur-md transition-all duration-300 hover:bg-ghost-dark/95 hover:border-ghost-purple/40">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo Section / Back Button */}
        <div className="flex items-center space-x-2">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white border border-ghost-purple/30 hover:text-ghost-neon hover:border-ghost-neon/50 transition-all duration-300"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          ) : (
            overrides.logo || (
              <SafeLink
                href="/"
                className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-ghost-purple/20 via-ghost-neon/20 to-ghost-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent animate-pulse">
                  GhostNote
                </h1>
              </SafeLink>
            )
          )}
        </div>

        {/* Desktop Search Bar - Center */}
        {!overrides.hideSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full rounded-lg transition-all duration-300 focus-within:scale-105">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors duration-300 z-10" />
              <input
                type="search"
                placeholder={
                  overrides.searchPlaceholder ||
                  "Search notes, authors, and tags..."
                }
                className="pl-10 w-full h-10 bg-ghost-gray/50 border border-ghost-purple/30 text-white placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-neon/60 focus:outline-none focus:shadow-lg focus:shadow-ghost-neon/20 rounded-lg transition-all duration-300"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Desktop Action Buttons - Right */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <UserDropdown
              user={user}
              menuItems={overrides.menuItems}
              onLogout={() => {
                console.log("User logged out");
              }}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/20 transition-all duration-300"
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-semibold hover:from-ghost-neon hover:to-ghost-cyan hover:scale-105 transition-all duration-300 shadow-lg shadow-ghost-purple/30"
                onClick={handleSignUpClick}
              >
                Get Started
              </Button>
            </>
          )}

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/20 border border-ghost-purple/30 hover:border-ghost-neon/50 transition-all duration-300"
            asChild
          >
            <SafeLink href="/settings" aria-label="Settings">
              <SettingsIcon className="h-4 w-4" />
            </SafeLink>
          </Button>

          {/* Custom Right Buttons */}
          {overrides.rightButtons}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Search Toggle for Mobile */}
          {!overrides.hideSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-ghost-neon transition-all duration-300"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              {isSearchOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* User Actions */}
          {user ? (
            <UserDropdown
              user={user}
              menuItems={overrides.menuItems}
              onLogout={() => {
                console.log("User logged out");
              }}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-ghost-neon transition-all duration-300"
              onClick={handleLoginClick}
              aria-label="Login"
            >
              <UserIcon className="h-5 w-5" />
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-ghost-neon transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden w-full px-4 py-3 bg-ghost-dark/95 border-t border-ghost-purple/20 animate-in slide-in-from-top-2 duration-300">
          <div className="relative w-full rounded-lg">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="search"
              placeholder={overrides.searchPlaceholder || "Search notes..."}
              className="pl-12 pr-12 w-full h-12 bg-ghost-gray/50 border border-ghost-purple/30 text-white placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-neon/60 focus:outline-none focus:shadow-lg focus:shadow-ghost-neon/20 rounded-lg transition-all duration-300"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.currentTarget.value);
                }
                if (e.key === "Escape") {
                  setIsSearchOpen(false);
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setIsSearchOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-ghost-dark/95 backdrop-blur-md md:hidden animate-in slide-in-from-top-2 duration-300">
          <div className="p-6 space-y-6">
            {!user && (
              <div className="space-y-3 pb-6 border-b border-ghost-purple/20">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 transition-all duration-300 p-4"
                  onClick={handleLoginClick}
                >
                  <UserIcon className="h-5 w-5 mr-3" />
                  Login
                </Button>
                <Button
                  className="w-full justify-start bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-semibold hover:from-ghost-neon hover:to-ghost-cyan transition-all duration-300 p-4"
                  onClick={handleSignUpClick}
                >
                  Get Started
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <SafeLink
                href="/settings"
                className="flex items-center p-4 text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 rounded-lg transition-all duration-300"
              >
                <SettingsIcon className="h-5 w-5 mr-3" />
                Settings
              </SafeLink>

              {overrides.menuItems?.map((item, index) => (
                <SafeLink
                  key={index}
                  href={item.href || "#"}
                  className="flex items-center p-4 text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 rounded-lg transition-all duration-300"
                  onClick={item.onClick}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </SafeLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Private Account Setup Modal */}
      <PrivateAccountSetup
        open={showPrivateSetup}
        onOpenChange={setShowPrivateSetup}
      />
    </nav>
  );
};

export default Navbar;
