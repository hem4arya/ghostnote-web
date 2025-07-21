'use client';

import { Search, ChevronLeft, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from 'next/image';
import { useNavbar } from './hooks/useNavbar';
import { NavbarProps } from './types';
import { MobileMenu } from './components/MobileMenu';
import { UserDropdown } from './components/UserDropdown';
import { NavbarSearch } from './components/NavbarSearch';
import { NavigationButtons } from './components/NavigationButtons';
import { shouldShowAuthFeatures } from './utils';

const Navbar = ({ 
  onLoginClick, 
  onSignUpClick, 
  user, 
  isAuthenticated = false
}: NavbarProps) => {
  const {
    searchState,
    isHomepage,
    isDashboardPage,
    searchPlaceholder,
    handleBack,
    openSearch,
    closeSearch,
    navigateToSearch,
    handleAuth
  } = useNavbar(onLoginClick, onSignUpClick);

  // For now, we'll use a simple check since window might not be available
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const showAuthFeatures = shouldShowAuthFeatures(isAuthenticated, pathname);

  return (
    <>
      <nav className="navbar-container sticky top-0 z-50 w-full">
        <div className="container mx-auto flex h-16 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4">
          {/* Logo or Back Button based on current page */}
          <div className={`flex items-center transition-all duration-300 ${searchState.isOpen ? 'md:flex w-0 md:w-auto opacity-0 md:opacity-100' : 'w-auto opacity-100'}`}>
            {isHomepage ? (
              <Link href="/" className="flex items-center gap-2 group">
                <Image 
                  src="/logo.svg" 
                  alt="GhostNote Logo" 
                  width={28} 
                  height={28} 
                  className="h-7 w-7 logo-hover-scale"
                />
                <h1 className="text-2xl font-bold gradient-text">
                  GhostNote
                </h1>
              </Link>
            ) : (
              <Button 
                onClick={handleBack}
                variant="ghost" 
                className="navbar-item flex items-center text-gray-300 hover:text-ghost-neon gap-1 px-2"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Button>
            )}
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-md mx-4 relative">
            {!searchState.isOpen && (
              <div className="hidden md:block">
                <Button
                  onClick={openSearch}
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/10 border border-ghost-purple/20 rounded-lg px-4 py-2"
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span className="truncate">{searchPlaceholder}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            {!searchState.isOpen && (
              <>
                {showAuthFeatures ? (
                  <div className="hidden md:flex items-center gap-3">
                    {/* Create Note Button */}
                    {(isDashboardPage || isHomepage) && (
                      <Link href="/create">
                        <Button
                          variant="ghost"
                          className="navbar-item text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/10 flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="hidden lg:inline">Create</span>
                        </Button>
                      </Link>
                    )}

                    {/* User Dropdown */}
                    <UserDropdown 
                      user={user} 
                      onSignOut={() => {
                        // Handle sign out logic
                        console.log('Sign out');
                      }} 
                    />
                  </div>
                ) : (
                  <NavigationButtons
                    isAuthenticated={isAuthenticated}
                    onLoginClick={() => handleAuth('login')}
                    onSignUpClick={() => handleAuth('signup')}
                    showCreateButton={false}
                  />
                )}
              </>
            )}

            {/* Mobile Search Button */}
            <Button
              onClick={openSearch}
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-ghost-neon"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <MobileMenu
              isAuthenticated={isAuthenticated}
              onLoginClick={() => handleAuth('login')}
              onSignUpClick={() => handleAuth('signup')}
              onSearchClick={openSearch}
            />
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <NavbarSearch
        isOpen={searchState.isOpen}
        onClose={closeSearch}
        onSearch={(query) => {
          navigateToSearch(query);
        }}
        placeholder={searchPlaceholder}
        suggestions={[]} // TODO: Connect to actual search suggestions
        recentSearches={user?.preferences?.searchHistory || []}
      />
    </>
  );
};

export default Navbar;
