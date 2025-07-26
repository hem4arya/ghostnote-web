'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/shared/ui/components/button';
import { Card } from '@/components/shared/ui/components/card';
import IntelligentSearch from '@/components/IntelligentSearch';
import PersonalizedRecommendations from '@/components/dashboard/components/PersonalizedRecommendations';
import AuthForm from '@/components/AuthForm';

export default function PersonalizedSearchDemo() {
  const [showAuth, setShowAuth] = useState(false);
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghost-dark via-ghost-gray to-ghost-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Personalized Search Demo
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Experience AI-powered, personalized note discovery
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setShowAuth(true)}
              className="bg-ghost-neon hover:bg-ghost-neon/90 text-black"
            >
              Sign In for Personalization
            </Button>
            <Button 
              variant="outline"
              onClick={handleSignOut}
              className="border-ghost-purple text-white hover:bg-ghost-purple/20"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-8 bg-ghost-dark/50 border-ghost-purple/30 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Intelligent Search
          </h2>
          <p className="text-gray-400 mb-6">
            Try searching for topics like &quot;productivity&quot;, &quot;writing tips&quot;, or &quot;motivation&quot;. 
            Authenticated users will see personalized results based on their behavior and similar users.
          </p>
          <IntelligentSearch 
            placeholder="Search for notes... (try 'productivity tips' or 'creative writing')"
            className="mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-ghost-gray/20 rounded-lg">
              <div className="text-ghost-neon text-2xl mb-2">🌟</div>
              <h3 className="font-medium text-white mb-1">Semantic Search</h3>
              <p className="text-sm text-gray-400">Vector similarity matching for all users</p>
            </div>
            <div className="text-center p-4 bg-ghost-gray/20 rounded-lg">
              <div className="text-blue-400 text-2xl mb-2">👤</div>
              <h3 className="font-medium text-white mb-1">Behavioral Results</h3>
              <p className="text-sm text-gray-400">Based on your interaction history</p>
            </div>
            <div className="text-center p-4 bg-ghost-gray/20 rounded-lg">
              <div className="text-pink-400 text-2xl mb-2">📈</div>
              <h3 className="font-medium text-white mb-1">Collaborative Filtering</h3>
              <p className="text-sm text-gray-400">What similar users are reading</p>
            </div>
          </div>
        </Card>

        {/* Recommendations Section */}
        <PersonalizedRecommendations 
          limit={9}
          showHeader={true}
          className="mb-8"
        />

        {/* Feature Explanation */}
        <Card className="p-8 bg-ghost-dark/50 border-ghost-purple/30">
          <h2 className="text-2xl font-semibold text-white mb-6">
            How Personalization Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">For Anonymous Users</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Basic semantic search using AI embeddings</li>
                <li>• Popular and trending note recommendations</li>
                <li>• No tracking or data collection</li>
                <li>• Instant results without signup</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">For Authenticated Users</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Behavioral scoring based on your activity</li>
                <li>• Collaborative filtering from similar users</li>
                <li>• Learning from your preferences over time</li>
                <li>• Enhanced search result ranking</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-ghost-purple/10 border border-ghost-purple/30 rounded-lg">
            <h4 className="font-medium text-white mb-2">Privacy & Data</h4>
            <p className="text-sm text-gray-400">
              We only track interaction data to improve your experience. All data is encrypted, 
              and you can delete your data at any time. We never share personal information 
              with third parties.
            </p>
          </div>
        </Card>

        {/* Auth Modal */}
        <AuthForm open={showAuth} onOpenChange={setShowAuth} />
      </div>
    </div>
  );
}
