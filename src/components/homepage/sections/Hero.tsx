/**
 * Hero Section Component - Homepage header with category filters
 * Uses centralized theme system and glassmorphism design
 */

'use client';

import React from 'react';
import { Button } from '@shared/ui/components/button';
import { categories } from '@/components/note-card';
import type { CategoryFilterProps } from '@/components/homepage/types';

interface HeroProps extends Partial<CategoryFilterProps> {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  selectedCategory = "All",
  onCategorySelect,
  className = '' 
}) => {
  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <section className={`hero-section ${className}`}>
      <div className="hero-container">
        {/* Main Heading */}
        <h1 className="hero-title">
          A structured arena for chaos—a black market of the mind.
        </h1>
        
        {/* Category Filters */}
        <div className="hero-categories">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => handleCategoryClick(category)}
              className={`
                hero-category-btn
                ${selectedCategory === category ? 'hero-category-btn-active' : ''}
              `}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Background Effects */}
        <div className="hero-bg-gradient" />
        <div className="hero-bg-glow" />
      </div>
    </section>
  );
};

export default Hero;
