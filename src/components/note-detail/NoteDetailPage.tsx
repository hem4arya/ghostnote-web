'use client';

import * as React from 'react';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/shared/Footer';
import { useNoteDetail } from './hooks/useNoteDetail';
import { NoteContent } from './components/NoteContent';
import { PurchaseSidebar } from './components/PurchaseSidebar';
import { NoteLoading } from './components/NoteLoading';
import { NoteNotFound } from './components/NoteNotFound';

interface NoteDetailPageProps {
  className?: string;
}

export const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ className = '' }) => {
  const { note, isLoading, isPurchased, handlePurchase, handleReadNow } = useNoteDetail();

  const whyBuyText = "Unlock exclusive insights and advanced techniques with this note. It's a comprehensive guide filled with rare information, practical examples, and expert analysis that you won't find anywhere else. Perfect for accelerating your skills.";

  if (isLoading) {
    return (
      <div className={`flex flex-col min-h-screen bg-background ${className}`}>
        <Navbar />
        <NoteLoading />
        <Footer />
      </div>
    );
  }

  if (!note) {
    return (
      <div className={`flex flex-col min-h-screen bg-background ${className}`}>
        <Navbar />
        <NoteNotFound />
        <Footer />
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background text-foreground font-sans ${className}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <NoteContent 
              note={note}
              isPurchased={isPurchased}
              whyBuyText={whyBuyText}
            />
            <PurchaseSidebar 
              note={note}
              isPurchased={isPurchased}
              onPurchase={handlePurchase}
              onReadNow={handleReadNow}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NoteDetailPage;
