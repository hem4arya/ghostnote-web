import { useState, useEffect } from "react";

interface UseHomepageProps {
  initialMode?: "login" | "signup";
}

export function useHomepage({ initialMode = "login" }: UseHomepageProps = {}) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialMode);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoginClick = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log("Searching for:", query);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Listen for auth modal events from other components
  useEffect(() => {
    const handleAuthModalEvent = (e: CustomEvent) => {
      setAuthMode(e.detail.mode);
      setIsAuthModalOpen(true);
    };

    window.addEventListener(
      "open-auth-modal",
      handleAuthModalEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        "open-auth-modal",
        handleAuthModalEvent as EventListener
      );
    };
  }, []);

  return {
    // Auth state
    isAuthModalOpen,
    authMode,
    handleLoginClick,
    handleSignUpClick,
    closeAuthModal,
    
    // Search state
    searchQuery,
    handleSearch,
    
    // Utility functions
    openAuthModal: (mode: "login" | "signup") => {
      setAuthMode(mode);
      setIsAuthModalOpen(true);
    }
  };
}
