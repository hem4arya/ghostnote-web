"use client";

import { Search, Star, Users, Zap } from "lucide-react";

// React 19 compatibility wrappers
const SearchIcon = Search as React.ElementType;
const StarIcon = Star as React.ElementType;
const UsersIcon = Users as React.ElementType;
const ZapIcon = Zap as React.ElementType;

// React 19 compatible wrappers for Lucide icons

interface HeroSectionProps {
  onGetStarted?: () => void;
  onExplore?: () => void;
}

export default function HeroSection({
  onGetStarted,
  onExplore,
}: HeroSectionProps) {
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text fade-in">
            GhostNote
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed fade-in fade-in-delay-1">
            Discover, Create, and Share Amazing Content
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 sm:gap-8 sm:mb-14 max-w-md mx-auto sm:max-w-2xl fade-in fade-in-delay-2">
            <div className="flex flex-col items-center p-5 sm:p-8 note-card card-hover scale-in">
              <SearchIcon className="h-10 w-10 sm:h-14 sm:w-14 text-ghost-neon mb-2 sm:mb-4 icon-glow icon-float" />
              <h3 className="text-base sm:text-2xl font-semibold text-white mb-0 sm:mb-1 tracking-wide opacity-90">
                Smart Search
              </h3>
              <p className="hidden md:block text-xs sm:text-sm text-gray-300 text-center mt-1">
                AI-powered search to find exactly what you need
              </p>
            </div>
            <div className="flex flex-col items-center p-5 sm:p-8 note-card card-hover scale-in">
              <StarIcon className="h-10 w-10 sm:h-14 sm:w-14 text-ghost-cyan mb-2 sm:mb-4 icon-glow icon-float" />
              <h3 className="text-base sm:text-2xl font-semibold text-white mb-0 sm:mb-1 tracking-wide opacity-90">
                Quality Content
              </h3>
              <p className="hidden md:block text-xs sm:text-sm text-gray-300 text-center mt-1">
                Curated high-quality notes and articles
              </p>
            </div>
            <div className="flex flex-col items-center p-5 sm:p-8 note-card card-hover scale-in">
              <UsersIcon className="h-10 w-10 sm:h-14 sm:w-14 text-ghost-purple mb-2 sm:mb-4 icon-glow icon-float" />
              <h3 className="text-base sm:text-2xl font-semibold text-white mb-0 sm:mb-1 tracking-wide opacity-90">
                Community
              </h3>
              <p className="hidden md:block text-xs sm:text-sm text-gray-300 text-center mt-1">
                Join thousands of creators and learners
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in fade-in-delay-3">
            <button
              className="btn-primary flex items-center justify-center"
              onClick={onGetStarted}
            >
              <ZapIcon className="h-5 w-5 mr-2" />
              Get Started
            </button>

            <button className="btn-secondary" onClick={onExplore}>
              Explore Notes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
