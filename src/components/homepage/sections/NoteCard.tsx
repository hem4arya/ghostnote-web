/**
 * Note Card Component - Individual note display with theme system
 * Features glassmorphism design and interactive hover effects
 */

'use client';

import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@shared/ui/components/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { NoteCardProps } from '@/components/homepage/types';

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const router = useRouter();

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Simulate purchase process
    toast.loading('Processing purchase...', {
      duration: 1500,
    });
    
    setTimeout(() => {
      toast.success(`Successfully purchased "${note.title}"!`);
      // Navigate to reader view after simulated purchase
      router.push(`/reader/${note.id}`);
    }, 1500);
  };

  return (
    <div className="note-card">
      {/* Header with category and rating */}
      <div className="note-card-header">
        <div className="note-card-category">
          <span className="note-card-category-text">{note.category}</span>
        </div>
        <div className="note-card-rating">
          <Star className="note-card-star-icon" />
          <span className="note-card-rating-text">{note.rating}</span>
        </div>
      </div>
      
      {/* Title with link */}
      <Link href={`/notes/${note.id}`} className="note-card-title-link">
        <h3 className="note-card-title">
          {note.title}
        </h3>
      </Link>
      
      {/* Preview text section */}
      <Link href={`/notes/${note.id}`} className="note-card-preview-link">
        <div className="note-card-preview">
          <p className="note-card-preview-text">
            {note.previewText.length > 200 
              ? `${note.previewText.substring(0, 200)}...`
              : note.previewText}
          </p>
        </div>
      </Link>
      
      {/* Footer with author, reviews, and purchase */}
      <div className="note-card-footer">
        <div className="note-card-meta">
          <span className="note-card-author">by {note.author}</span>
          <span className="note-card-reviews">{note.reviews} reviews</span>
        </div>
        
        <div className="note-card-purchase">
          <div className="note-card-price">
            <span className="note-card-price-symbol">$</span>
            <span className="note-card-price-amount">{note.price}</span>
          </div>
          
          <Button 
            size="sm" 
            onClick={handlePurchase}
            className="note-card-buy-btn"
          >
            <ShoppingCart className="note-card-cart-icon" />
            Buy Now
          </Button>
        </div>
      </div>
      
      Hover overlay effect
      <Link 
        href={`/notes/${note.id}`} 
        className="note-card-overlay"
      />
    </div>
  );
};

export default NoteCard;
