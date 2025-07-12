"use client";

import { Search, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-6 bg-ghost-gray/30 rounded-lg border border-ghost-purple/20">
              <Search className="h-8 w-8 text-ghost-neon mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
              <p className="text-gray-400 text-center">AI-powered search to find exactly what you need</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-ghost-gray/30 rounded-lg border border-ghost-purple/20">
              <Star className="h-8 w-8 text-ghost-cyan mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Quality Content</h3>
              <p className="text-gray-400 text-center">Curated high-quality notes and articles</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-ghost-gray/30 rounded-lg border border-ghost-purple/20">
              <Users className="h-8 w-8 text-ghost-purple mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-400 text-center">Join thousands of creators and learners</p>
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
