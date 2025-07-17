"use client";

import { ChevronLeft, Plus, Search, Settings, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useNavbar } from "../hooks/useNavbar";
import { NavbarProps } from "../types";
import styles from "./Navbar.module.css";
import { NavbarSearch } from "./NavbarSearch";
import { UserDropdown } from "./UserDropdown";

// For React 19 compatibility
const ChevronLeftIcon = ChevronLeft as React.ElementType;
const PlusIcon = Plus as React.ElementType;
const SearchIcon = Search as React.ElementType;
const SettingsIcon = Settings as React.ElementType;
const UserIcon = User as React.ElementType;
const XIcon = X as React.ElementType;

// Next.js component wrappers
const SafeLink = Link as React.ElementType;
const SafeImage = Image as React.ElementType;

/**
 * Main Navbar component for GhostNote
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

  // Handle back button click
  const handleBack = () => {
    if (isNoteDetailPage) {
      router.push("/");
    } else {
      router.back();
    }
  };

  // Handle signup button click
  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else if (pathname === "/") {
      // If we're on the homepage, we're expecting the auth modal to be there
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("open-auth-modal", { detail: { mode: "signup" } })
        );
      }
    } else {
      // Otherwise redirect to homepage with auth query param
      router.push("/?auth=signup");
    }
  };

  const inputRef = searchInputRef as React.RefObject<HTMLInputElement>;

  return (
    <nav className={`${styles.navbar} ${overrides.className || ""}`}>
      <div className={styles.container}>
        {/* Logo or Back Button based on current page */}
        <div
          className={`${styles.logoContainer} ${
            isSearchOpen ? styles.searchOpenLogo : ""
          }`}
        >
          {isHomepage ? (
            <SafeLink href="/" className={styles.logoLink}>
              <SafeImage
                src={overrides.logo ? "/custom-logo.svg" : "/logo.svg"}
                alt="GhostNote Logo"
                width={28}
                height={28}
                className={styles.logoImage}
              />
              <h1 className={styles.logoText}>GhostNote</h1>
            </SafeLink>
          ) : (
            <button onClick={handleBack} className={styles.backButton}>
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
          )}
        </div>

        {/* Search Bar (Desktop) */}
        {!overrides.hideSearch && (
          <div className={styles.searchContainer}>
            <NavbarSearch
              inputRef={searchInputRef}
              placeholder={
                overrides.searchPlaceholder ||
                "Search notes, authors, and tags..."
              }
              onSearch={(query) =>
                router.push(`/search?q=${encodeURIComponent(query)}`)
              }
              className="w-full"
            />
          </div>
        )}

        {/* Action Buttons (Desktop) */}
        <div className={styles.desktopActions}>
          {user ? (
            <UserDropdown user={user} menuItems={overrides.menuItems} />
          ) : (
            <>
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors h-10 px-4 py-2 text-sm text-gray-300 hover:text-[#00ff41] hover:bg-[rgba(107,70,193,0.2)] focus:outline-none focus:ring-0"
                onClick={onLoginClick}
              >
                Login
              </button>
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors h-10 px-4 py-2 text-sm bg-gradient-to-r from-[#6b46c1] to-[#00ff41] text-black hover:from-[#00ff41] hover:to-[#00ffff] focus:outline-none focus:ring-0"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </>
          )}

          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors h-10 px-4 py-2 text-sm bg-gradient-to-r from-[#00ffff] to-[#00ff41] text-black hover:from-[#00ff41] hover:to-[#00ffff] focus:outline-none focus:ring-0">
            <SafeLink href="/create" className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              Create
            </SafeLink>
          </button>

          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors h-10 w-10 text-gray-300 hover:text-[#00ff41] hover:bg-[rgba(107,70,193,0.2)] focus:outline-none focus:ring-0">
            <SettingsIcon className="h-5 w-5" />
          </button>

          {/* Custom Right Buttons */}
          {overrides.rightButtons}
        </div>

        {/* Mobile Icons & Search */}
        <div className={styles.mobileActions}>
          {isSearchOpen ? (
            <div className={styles.mobileSearchOpen}>
              <div className={styles.mobileSearchWrap}>
                <SearchIcon className={styles.mobileSearchIcon} />
                <input
                  ref={(el) => {
                    if (el) searchInputRef.current = el;
                  }}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => router.push("/search")}
                  onClick={() => router.push("/search")}
                  placeholder="Search..."
                  className={styles.mobileSearchInput}
                  readOnly
                />
                <button
                  className={styles.mobileSearchClose}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.mobileIcons}>
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors h-12 w-12 text-gray-300 hover:text-[#00ff41] focus:outline-none focus:ring-0"
                onClick={() => setIsSearchOpen(true)}
              >
                <SearchIcon className="h-6 w-6" />
              </button>

              {user ? (
                <UserDropdown user={user} menuItems={overrides.menuItems} />
              ) : (
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors h-12 w-12 text-gray-300 hover:text-[#00ff41] focus:outline-none focus:ring-0"
                  onClick={onLoginClick}
                >
                  <UserIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
