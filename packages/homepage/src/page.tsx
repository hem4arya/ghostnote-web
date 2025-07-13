"use client";

import { useState, useEffect } from "react";
// Feature-local imports (relative)
import HeroSection from "./components/HeroSection";
// import SearchBar from "./components/SearchBar"; // TODO: Integrate search bar
// Global imports (absolute)
import Navbar from "packages/shell/src/Navbar";
import Footer from "packages/shell/src/Footer";
import NoteCard from "packages/notes/components/NoteCard";
import { sampleNotes } from "packages/notes/src/data/sampleNotes";
import AuthModal from "packages/auth/src/trash/AuthModal";

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<"login" | "signup">("login");

  const handleLoginClick = () => {
    setInitialMode("login");
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setInitialMode("signup");
    setIsAuthModalOpen(true);
  };

  // Listen for auth modal events from Navbar
  useEffect(() => {
    const handleAuthModalEvent = (e: CustomEvent) => {
      setInitialMode(e.detail.mode);
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
      <Navbar onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} />
      <main className="flex-grow">
        <HeroSection onGetStarted={handleSignUpClick} onExplore={() => {}} />
        <section className="container mx-auto px-3 xs:px-4 pb-12 sm:pb-16 md:pb-20">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
            {sampleNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={initialMode}
      />
    </div>
  );
}
