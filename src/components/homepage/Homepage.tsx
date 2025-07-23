/**
 * Homepage Component - Main homepage container with theme integration
 * Orchestrates all homepage sections and handles global state
 */

'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Hero } from './sections/Hero';
import { NoteCard } from './sections/NoteCard';
import { Footer } from './sections/Footer';
import { AuthModal } from './modals/AuthModal';
import { sampleNotes } from './data';
import type { HomepageProps, AuthMode } from './types';
import './styles/homepage.css';

export const Homepage: React.FC<HomepageProps> = ({ 
  onLoginClick, 
  onSignUpClick 
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<AuthMode>("login");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter notes based on selected category
  const filteredNotes = selectedCategory === "All" 
    ? sampleNotes 
    : sampleNotes.filter(note => note.category === selectedCategory);

  const handleLoginClick = () => {
    setInitialMode("login");
    setIsAuthModalOpen(true);
    onLoginClick();
  };

  const handleSignUpClick = () => {
    setInitialMode("signup");
    setIsAuthModalOpen(true);
    onSignUpClick();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
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
    <div className="homepage-container">
      {/* Navigation */}
      <Navbar 
        onLoginClick={handleLoginClick} 
        onSignUpClick={handleSignUpClick} 
      />
      
      {/* Main Content */}
      <main className="homepage-main">
        {/* Hero Section */}
        <Hero 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        {/* Notes Grid */}
        <section className="homepage-notes-section">
          <div className="homepage-notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={initialMode}
      />
    </div>
  );
};

export default Homepage;
