import { useEffect, useRef, useState } from "react";
import { isBrowser } from "../utils/helpers";

interface UseNavbarOptions {
  initialRoute?: string;
}

export function useNavbar(options: UseNavbarOptions = {}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Current route handling
  const [currentRoute, setCurrentRoute] = useState<string>(
    options.initialRoute || "/"
  );

  // Detect if we're on the homepage
  const isHomepage = currentRoute === "/";
  const isNoteDetailPage = currentRoute?.startsWith("/notes/");

  // Handle search opening/closing
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    if (!isBrowser) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  // Listen for auth modal events when on homepage
  useEffect(() => {
    if (!isBrowser || currentRoute !== "/") return;

    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get("auth");

    if (authParam === "login" || authParam === "signup") {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", {
          detail: { mode: authParam },
        })
      );

      // Clean up the URL
      const newUrl = `${
        window.location.pathname
      }${window.location.search.replace(/[?&]auth=\\w+/, "")}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [currentRoute]);

  return {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchInputRef,
    isHomepage,
    isNoteDetailPage,
    currentRoute,
    setCurrentRoute,
  };
}

export default useNavbar;
