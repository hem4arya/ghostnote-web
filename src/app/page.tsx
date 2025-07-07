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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      <main className="flex-grow">
        <Hero />
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
