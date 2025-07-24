'use client';

import React from 'react';
import { Button } from '@shared/ui';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-b-3xl bg-background text-center px-4">
      <div
        className="absolute inset-0 w-full h-full bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-tighter">
          Unleash Your Inner Ghostwriter
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
          A decentralized marketplace for unique, high-quality content. Buy, sell, and trade notes securely.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={onSignUpClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Button>
          <Button 
            onClick={onLoginClick}
            variant="outline"
            className="font-bold text-lg py-3 px-8 rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          >
            Login
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
