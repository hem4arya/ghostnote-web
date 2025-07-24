/**
 * Homepage Component - Main homepage container with theme integration
 * Orchestrates all homepage sections and handles global state
 */

'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { NoteCard, sampleNotes, categories } from '@/components/note-card';
import { Footer } from '@/components/shared/Footer';
import { AuthModal } from './modals/AuthModal';
import type { HomepageProps, AuthMode } from './types';
import './styles/homepage.css';
import { HeroSection } from './sections/HeroSection';

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
    if(onLoginClick) onLoginClick();
  };

  const handleSignUpClick = () => {
    setInitialMode("signup");
    setIsAuthModalOpen(true);
    if(onSignUpClick) onSignUpClick();
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

    const eventName = "open-auth-modal";

    window.addEventListener(eventName, handleAuthModalEvent as EventListener);
    
    return () => {
      window.removeEventListener(eventName, handleAuthModalEvent as EventListener);
    };
  }, [onLoginClick, onSignUpClick]);

  return (
    <div className="homepage-container bg-background text-foreground">
      {/* Navigation */}
      <Navbar 
        onLoginClick={handleLoginClick} 
        onSignUpClick={handleSignUpClick} 
      />
      
      {/* Main Content */}
      <main className="homepage-main">
        {/* Hero Section */}
        <HeroSection 
          onLoginClick={handleLoginClick}
          onSignUpClick={handleSignUpClick}
        />
        
        {/* Category Filters */}
        <section className="homepage-category-section py-8 md:py-12">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Explore Categories
            </h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ease-in-out
                    ${selectedCategory === category 
                      ? 'bg-primary text-primary-foreground shadow-lg transform scale-105' 
                      : 'bg-secondary text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notes Grid */}
        <section className="homepage-notes-section pb-12 md:pb-24">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
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
