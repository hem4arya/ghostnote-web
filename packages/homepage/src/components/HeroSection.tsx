"use client";

import { Search, Star, Users, Zap } from "lucide-react";
import { Button } from "../../../ui-components/src/components/button";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onExplore?: () => void;
}

export default function HeroSection({ onGetStarted, onExplore }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ghost-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-ghost-neon/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent">
            GhostNote
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Discover, Create, and Share Amazing Content
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 sm:gap-8 sm:mb-14 max-w-md mx-auto sm:max-w-2xl">
            <div className="flex flex-col items-center p-5 sm:p-8 bg-gradient-to-br from-ghost-gray/40 via-ghost-purple/10 to-ghost-neon/10 bg-opacity-70 rounded-2xl border border-ghost-purple/20 shadow-md shadow-ghost-purple/10 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-ghost-neon/20">
              <Search className="h-10 w-10 sm:h-14 sm:w-14 text-ghost-neon mb-2 sm:mb-4 drop-shadow-md" />
              <h3 className="text-base sm:text-2xl font-semibold text-white mb-0 sm:mb-1 tracking-wide opacity-90">Smart Search</h3>
              <p className="hidden md:block text-xs sm:text-sm text-gray-300 text-center mt-1">AI-powered search to find exactly what you need</p>
            </div>
            <div className="flex flex-col items-center p-5 sm:p-8 bg-gradient-to-br from-ghost-gray/40 via-ghost-cyan/10 to-ghost-purple/10 bg-opacity-70 rounded-2xl border border-ghost-cyan/20 shadow-md shadow-ghost-cyan/10 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-ghost-cyan/20">
              <Star className="h-10 w-10 sm:h-14 sm:w-14 text-ghost-cyan mb-2 sm:mb-4 drop-shadow-md" />
              <h3 className="text-base sm:text-2xl font-semibold text-white mb-0 sm:mb-1 tracking-wide opacity-90">Quality Content</h3>
              <p className="hidden md:block text-xs sm:text-sm text-gray-300 text-center mt-1">Curated high-quality notes and articles</p>
            </div>
            <div className="flex flex-col items-center p-5 sm:p-8 bg-gradient-to-br from-ghost-gray/40 via-ghost-purple/10 to-ghost-cyan/10 bg-opacity-70 rounded-2xl border border-ghost-purple/20 shadow-md shadow-ghost-purple/10 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-ghost-purple/20">
              <Users className="h-10 w-10 sm:h-14 sm:w-14 text-ghost-purple mb-2 sm:mb-4 drop-shadow-md" />
              <h3 className="text-base sm:text-2xl font-semibold text-white mb-0 sm:mb-1 tracking-wide opacity-90">Community</h3>
              <p className="hidden md:block text-xs sm:text-sm text-gray-300 text-center mt-1">Join thousands of creators and learners</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-semibold hover:from-ghost-neon hover:to-ghost-cyan"
              onClick={onGetStarted}
            >
              <Zap className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-ghost-purple text-ghost-purple hover:bg-ghost-purple/10"
              onClick={onExplore}
            >
              Explore Notes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
