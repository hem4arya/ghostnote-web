"use client";

import { useEffect, useState } from "react";
// Import self-contained styles
import "./styles/homepage.css";
// Import Navbar from the shared package
import { Navbar } from "../../Navbar/src/components/Navbar";
// Feature-local imports (relative) - self-contained homepage components
import Hero from "./components/Hero";
import LocalAuthModal from "./components/LocalAuthModal";
import LocalFooter from "./components/LocalFooter";
import LocalNoteCard from "./components/LocalNoteCard";
import { localSampleNotes } from "./data/localSampleNotes";

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
      <Navbar
        user={null}
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
      />
      <main className="flex-grow">
        <Hero />
        <section className="container mx-auto px-3 xs:px-4 pb-12 sm:pb-16 md:pb-20">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
            {localSampleNotes.map((note) => (
              <LocalNoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </main>
      <LocalFooter />
      <LocalAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={initialMode}
      />
    </div>
  );
}
