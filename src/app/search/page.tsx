'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/shared/ui/components/button';
import { Card } from '@/components/shared/ui/components/card';
import { Input } from '@/components/shared/ui/components/input';
import AdvancedSmartSearch from '@/components/search/components/AdvancedSmartSearch';
import IntelligentSearch from '@/components/search/components/IntelligentSearch';
import PersonalizedRecommendations from '@/components/dashboard/components/PersonalizedRecommendations';
import AuthForm from '@/components/AuthForm';

export default function SearchPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'basic' | 'advanced' | 'intelligent'>('intelligent');
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      global: {
        headers: {
          'Accept': 'application/json'
        }
      }
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghost-dark via-ghost-gray to-ghost-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Search & Discover Notes
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Experience AI-powered, personalized note discovery with advanced search capabilities
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => setShowAuth(true)} className="bg-ghost-neon text-black">
              Sign In
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="border-ghost-purple text-white">
              Sign Out
            </Button>
          </div>

          {/* Search Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button 
              onClick={() => setSearchMode('intelligent')}
              variant={searchMode === 'intelligent' ? 'default' : 'outline'}
              size="sm"
            >
              Intelligent Search
            </Button>
            <Button 
              onClick={() => setSearchMode('advanced')}
              variant={searchMode === 'advanced' ? 'default' : 'outline'}
              size="sm"
            >
              Advanced Search
            </Button>
          </div>
        </div>

        {/* Search Components */}
        <div className="max-w-4xl mx-auto mb-12">
          {searchMode === 'intelligent' && (
            <IntelligentSearch />
          )}
          
          {searchMode === 'advanced' && (
            <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30">
              <div className="relative max-w-2xl mx-auto">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  placeholder="Search for notes..."
                  className="w-full bg-ghost-gray/20 border-ghost-purple/30 text-white"
                />
                
                <AdvancedSmartSearch
                  query={query}
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                />
              </div>
              
              <div className="mt-8 text-gray-400">
                <p>Try searching for terms like &quot;React&quot;, &quot;AI&quot;, &quot;design&quot;, etc.</p>
              </div>
            </Card>
          )}
        </div>

        {/* Personalized Recommendations */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Recommended For You
          </h2>
          <PersonalizedRecommendations />
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30">
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Search</h3>
            <p className="text-gray-300">
              Advanced machine learning algorithms understand your search intent and deliver highly relevant results.
            </p>
          </Card>

          <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30">
            <h3 className="text-xl font-bold text-white mb-3">Smart Suggestions</h3>
            <p className="text-gray-300">
              Get instant search suggestions and discover content you didn&apos;t know you were looking for.
            </p>
          </Card>

          <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30">
            <h3 className="text-xl font-bold text-white mb-3">Personalized Results</h3>
            <p className="text-gray-300">
              Results tailored to your interests, reading history, and preferences for a better discovery experience.
            </p>
          </Card>
        </div>

        <AuthForm open={showAuth} onOpenChange={setShowAuth} />
      </div>
    </div>
  );
}
