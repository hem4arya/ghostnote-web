"use client";

import { Search, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useNavbar } from "../hooks/useNavbar";
import { NavbarProps } from "../types";
import styles from "./Navbar.module.css";
import { UserDropdown } from "./UserDropdown";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

// For React 19 compatibility
const SearchIcon = Search as React.ElementType;
const SettingsIcon = Settings as React.ElementType;
const UserIcon = User as React.ElementType;

// Next.js component wrappers
const SafeLink = Link as React.ElementType;
const SafeImage = Image as React.ElementType;

/**
 * Main Navbar component for GhostNote - Updated with beautiful Lovable design
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

  return (
    <nav className={`${styles.navbar} ${styles.cyberBorder}`}>
      <div className={`${styles.container}`}>
        {/* Logo Section */}
        <div className={`${styles.logoContainer}`}>
          <SafeLink
            href="/"
            className={`${styles.logoLink} ${styles.glowEffect}`}
          >
            <h1 className={`${styles.logoText}`}>GhostNote</h1>
          </SafeLink>
        </div>

        {/* Search Bar - Center */}
        <div className={`${styles.searchContainer}`}>
          <div className={`${styles.searchWrap} ${styles.searchGlow}`}>
            <SearchIcon className={`${styles.searchIcon}`} />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${styles.searchInput}`}
            />
          </div>
        </div>

        {/* Action Buttons - Right */}
        <div className={`${styles.desktopActions}`}>
          {user ? (
            <UserDropdown user={user} menuItems={overrides.menuItems} />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={`${styles.loginButton}`}
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button
                size="sm"
                className={`${styles.signupButton}`}
                onClick={handleSignUpClick}
              >
                Dashboard
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className={`${styles.navButton}`}>
            <SafeLink href="/settings">
              <SettingsIcon className="h-4 w-4" />
            </SafeLink>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className={`${styles.mobileActions}`}>
          {user ? (
            <UserDropdown user={user} menuItems={overrides.menuItems} />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={`${styles.navButton}`}
              onClick={handleLoginClick}
            >
              <UserIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Private Account Setup Modal - Will be added later */}
      {showPrivateSetup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-primary/20 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Enter Your Private Vault
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Create your anonymous account - secure, private, no traces.
            </p>
            <Button
              onClick={() => setShowPrivateSetup(false)}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
            >
              Close (Coming Soon)
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
