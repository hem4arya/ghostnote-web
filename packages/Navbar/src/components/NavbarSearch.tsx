"use client";

import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavbarSearchProps } from "../types";
import styles from "./Navbar.module.css";

// For React 19 compatibility
const SearchIcon = Search as React.ElementType;
const XIcon = X as React.ElementType;

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  placeholder = "Search notes, authors, and tags...",
  onSearch,
  className = "",
  isOpen = false,
  onOpenChange,
  inputRef,
  variant = "desktop",
  autoFocus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const effectiveRef = inputRef || internalRef;

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle clear
  const handleClear = () => {
    setSearchQuery("");
    if (effectiveRef.current) {
      effectiveRef.current.focus();
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
    if (e.key === "Escape") {
      handleClear();
      effectiveRef.current?.blur();
    }
  };

  // Auto focus when requested
  useEffect(() => {
    if (autoFocus && effectiveRef.current) {
      effectiveRef.current.focus();
    }
  }, [autoFocus]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        effectiveRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const isMobile = variant === "mobile";

  return (
    <form
      onSubmit={handleSearch}
      className={`${styles.searchWrap} ${className}`}
    >
      <div className="relative group">
        {/* Search Icon */}
        <SearchIcon
          className={`${
            isMobile ? styles.mobileSearchIcon : styles.searchIcon
          } transition-all duration-300 group-hover:scale-110 group-focus-within:text-ghost-purple`}
        />

        {/* Search Input */}
        <input
          ref={(el) => {
            if (effectiveRef && "current" in effectiveRef) {
              effectiveRef.current = el;
            }
          }}
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`${
            isMobile ? styles.mobileSearchInput : styles.searchInput
          } transition-all duration-300 hover:shadow-lg focus:shadow-xl`}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className={`${
              isMobile
                ? styles.mobileSearchClose
                : "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ghost-neon transition-all duration-200 p-1 rounded-full hover:bg-ghost-purple/20 hover:scale-110"
            }`}
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}

        {/* Search shortcut hint */}
        {!isMobile && !isFocused && !searchQuery && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none select-none hidden lg:block transition-opacity duration-300">
            <kbd className="px-2 py-1 bg-ghost-gray/30 rounded border border-ghost-purple/20 font-mono text-xs">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Search suggestions/results overlay */}
      {isFocused && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ghost-dark/95 backdrop-blur-md border border-ghost-purple/30 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <SearchIcon className="h-4 w-4" />
              Press Enter to search for "{searchQuery}"
            </div>

            {/* Recent searches or suggestions */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Recent Searches
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-ghost-purple/10 cursor-pointer text-sm text-gray-300 hover:text-white transition-all duration-200 group">
                <SearchIcon className="h-3 w-3 text-gray-500 group-hover:text-ghost-neon transition-colors" />
                <span className="group-hover:translate-x-1 transition-transform">
                  react hooks tutorial
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-ghost-purple/10 cursor-pointer text-sm text-gray-300 hover:text-white transition-all duration-200 group">
                <SearchIcon className="h-3 w-3 text-gray-500 group-hover:text-ghost-neon transition-colors" />
                <span className="group-hover:translate-x-1 transition-transform">
                  typescript best practices
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-ghost-purple/10 cursor-pointer text-sm text-gray-300 hover:text-white transition-all duration-200 group">
                <SearchIcon className="h-3 w-3 text-gray-500 group-hover:text-ghost-neon transition-colors" />
                <span className="group-hover:translate-x-1 transition-transform">
                  javascript performance
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default NavbarSearch;
