'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NoteCard from "@/components/NoteCard";
import { sampleNotes } from "@/data/sampleNotes";
import Footer from "@/components/Footer";
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'login' | 'signup'>('login');

  const handleLoginClick = () => {
    setInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setInitialMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
      <Navbar onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} />
      <main className="flex-grow">
        <Hero />
        <section className="container mx-auto px-3 xs:px-4 pb-12 sm:pb-16 md:pb-20">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
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
