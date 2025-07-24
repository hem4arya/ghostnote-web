/**
 * NoteCard Component - Modular note card with theme system integration
 * Features glassmorphism design, interactive hover effects, and responsive layout
 */

'use client';

import React from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import type { NoteCardProps } from './NoteCard.types';
import { noteToast } from './utils/noteToast';
import './styles/note-card.css';

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  className = '',
  variant = 'default',
  showActions = true,
  onFavorite
}) => {

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFavorite) {
      onFavorite(note);
    } else {
      noteToast.favoriteAdded(note);
    }
  };

  // Keep for future use - favorite functionality
  void handleFavorite;

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'note-card note-card--compact';
      case 'featured':
        return 'note-card note-card--featured';
      default:
        return 'note-card';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className} group`}>
      {/* Header with rating */}
      <div className="note-card-header">
        <div className="note-card-rating text-green-400">
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
            {note.previewText.length > 250 
              ? `${note.previewText.substring(0, 250)}...`
              : note.previewText}
          </p>
        </div>
      </Link>
      
      {/* Tags - simplified */}
      {note.tags && note.tags.length > 0 && (
        <div className="note-card-tags">
          {note.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className="note-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Footer with reviews and price */}
      <div className="note-card-footer">
        <div className="note-card-meta">
          <span className="note-card-reviews">{note.reviews} reviews</span>
        </div>
        
        {showActions && (
          <div className="note-card-actions">
            <div className="note-card-price text-green-400 font-bold">
              <span className="note-card-price-symbol">$</span>
              <span className="note-card-price-amount">{note.price}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Hover overlay effect */}
      <div className="note-card-hover-effect" />
      <Link 
        href={`/notes/${note.id}`} 
        className="note-card-overlay"
        aria-label={`View details for ${note.title}`}
      />
    </div>
  );
};

export default NoteCard;
