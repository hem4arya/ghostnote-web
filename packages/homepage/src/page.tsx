"use client";

import { useEffect, useState } from "react";
// Import self-contained styles
import "./styles/homepage.css";
// Import Navbar components from the shared package (styles loaded globally)
import { Button, Navbar } from "@ghostnote/navbar/";
// Feature-local imports (relative) - self-contained homepage components
import { HelpCircle, Settings, Star } from "lucide-react";
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
        overrides={{
          logo: (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                DemoApp
              </span>
            </div>
          ),
          menuItems: [
            {
              label: "Premium Features",
              href: "#premium",
              icon: <Star className="h-4 w-4" />,
            },
            {
              label: "Help Center",
              href: "#help",
              icon: <HelpCircle className="h-4 w-4" />,
            },
            {
              label: "Custom Action",
              onClick: () => alert("Custom action clicked!"),
              icon: <Settings className="h-4 w-4" />,
            },
          ],
          rightButtons: (
            <Button variant="default" size="sm">
              Demo Button
            </Button>
          ),
          hideSearch: true,
          className: "border-b-2 border-cyan-500/30",
        }}
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
