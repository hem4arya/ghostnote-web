'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/ui/components/button';
import { Card } from '@/components/shared/ui/components/card';
import { Input } from '@/components/shared/ui/components/input';
import IntelligentSearch from '../components/IntelligentSearchFixed';
import AdvancedSmartSearch from '../components/AdvancedSmartSearch';
import PremiumSearchExperience from '../components/PremiumSearchExperienceFixed';
import PersonalizedRecommendations from '@/components/dashboard/components/PersonalizedRecommendations';
import Navbar from '@/components/navbar/Navbar';

export default function SearchPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [searchMode, setSearchMode] = useState<'basic' | 'advanced' | 'premium'>('premium');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const renderSearchComponent = () => {
    switch (searchMode) {
      case 'basic':
        return <IntelligentSearch />;
      case 'advanced':
        return (
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search for notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full px-4 py-3 bg-ghost-dark/30 border border-ghost-purple/30 rounded-lg text-white placeholder-ghost-gray focus:border-ghost-neon focus:outline-none"
            />
            <AdvancedSmartSearch
              query={query}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        );
      case 'premium':
      default:
        return <PremiumSearchExperience />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-ghost-dark dark:via-ghost-gray dark:to-ghost-dark">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Amazing Notes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find exactly what you&apos;re looking for with our intelligent search system. 
              Get instant suggestions, smart previews, and discover trending content.
            </p>
          </div>

          {/* Search Mode Toggle */}
          <div className="flex justify-center mb-8">
            <Card className="p-2 bg-white/90 dark:bg-ghost-dark/90 backdrop-blur-sm border border-gray-200 dark:border-ghost-purple/30">
              <div className="flex space-x-2">
                <Button
                  variant={searchMode === 'basic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchMode('basic')}
                  className="text-sm"
                >
                  Basic Search
                </Button>
                <Button
                  variant={searchMode === 'advanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchMode('advanced')}
                  className="text-sm"
                >
                  Advanced Search
                </Button>
                <Button
                  variant={searchMode === 'premium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchMode('premium')}
                  className="text-sm"
                >
                  Premium Experience
                </Button>
              </div>
            </Card>
          </div>

          {/* Search Component */}
          <div className="mb-12">
            {renderSearchComponent()}
          </div>

          {/* Personalized Recommendations */}
          <div className="mb-12">
            <PersonalizedRecommendations 
              className="max-w-6xl mx-auto"
              showHeader={true}
              limit={6}
            />
          </div>

          {/* Auth Section */}
          {!showAuth ? (
            <div className="text-center">
              <Card className="max-w-md mx-auto p-6 bg-white/90 dark:bg-ghost-dark/90 backdrop-blur-sm border border-gray-200 dark:border-ghost-purple/30">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Get Personalized Results
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sign in to get personalized search results based on your interests and reading history.
                </p>
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="w-full"
                >
                  Sign In for Better Results
                </Button>
              </Card>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <Card className="p-6 bg-white/90 dark:bg-ghost-dark/90 backdrop-blur-sm border border-gray-200 dark:border-ghost-purple/30">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sign in to unlock personalized features and save your preferences.
                </p>
              </Card>
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAuth(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
