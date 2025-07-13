'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User as SupabaseUser } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Note } from 'packages/notes/components/NoteCard';

interface RecommendationResult extends Note {
  score?: number;
  source: 'behavioral' | 'collaborative' | 'popular';
}

interface PersonalizedRecommendationsProps {
  className?: string;
  limit?: number;
  showHeader?: boolean;
}

const PersonalizedRecommendations = ({ 
  className = "",
  limit = 6,
  showHeader = true
}: PersonalizedRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<'behavioral' | 'collaborative' | 'popular'>('behavioral');
  const supabase = createClientComponentClient();

  // Check user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const loadRecommendations = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Use personalized search with empty query to get recommendations
      const { data, error } = await supabase.functions.invoke('personalized-search', {
        body: { 
          user_id: user.id,
          query: '', // Empty query for general recommendations
          include_behavioral: activeTab === 'behavioral',
          include_collaborative: activeTab === 'collaborative',
          limit: limit
        }
      });

      if (error) {
        console.error('Recommendations error:', error);
        return;
      }

      let results: RecommendationResult[] = [];
      
      switch (activeTab) {
        case 'behavioral':
          results = data.behavioral_results.map((r: Note) => ({ 
            ...r, 
            source: 'behavioral' as const 
          }));
          break;
        case 'collaborative':
          results = data.collaborative_results.map((r: Note) => ({ 
            ...r, 
            source: 'collaborative' as const 
          }));
          break;
        case 'popular':
          results = data.fallback_results.map((r: Note) => ({ 
            ...r, 
            source: 'popular' as const 
          }));
          break;
      }

      setRecommendations(results);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, activeTab, limit, supabase.functions]);

  // Load recommendations when user changes or component mounts
  useEffect(() => {
    if (user?.id) {
      loadRecommendations();
    }
  }, [user, activeTab, loadRecommendations]);

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'behavioral':
        return <Heart className="h-4 w-4" />;
      case 'collaborative':
        return <TrendingUp className="h-4 w-4" />;
      case 'popular':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'behavioral':
        return 'For You';
      case 'collaborative':
        return 'Similar Users Like';
      case 'popular':
        return 'Popular Now';
      default:
        return 'Recommended';
    }
  };

  if (!user) {
    return (
      <Card className={`p-6 bg-ghost-dark/50 border-ghost-purple/30 ${className}`}>
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-ghost-neon mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Get Personalized Recommendations</h3>
          <p className="text-gray-400 mb-4">
            Sign in to see notes tailored just for you based on your reading history and preferences.
          </p>
          <Button className="bg-ghost-neon hover:bg-ghost-neon/90 text-black">
            Sign In
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 bg-ghost-dark/50 border-ghost-purple/30 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recommended for You</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadRecommendations}
            disabled={isLoading}
            className="text-ghost-neon hover:bg-ghost-purple/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {(['behavioral', 'collaborative', 'popular'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="flex items-center gap-2"
          >
            {getTabIcon(tab)}
            {getTabLabel(tab)}
          </Button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-ghost-gray/20 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="block p-4 bg-ghost-gray/20 hover:bg-ghost-purple/20 rounded-lg transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white group-hover:text-ghost-neon transition-colors line-clamp-2 flex-1">
                  {note.title}
                </h4>
                {note.score && (
                  <Badge variant="outline" className="text-xs border-green-300/30 text-green-300 ml-2">
                    {note.score.toFixed(1)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {note.previewText}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {note.category}
                </Badge>
                <span className="text-sm font-medium text-ghost-neon">${note.price}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No recommendations available yet</div>
          <div className="text-sm text-gray-500">
            Start exploring notes to get personalized recommendations!
          </div>
        </div>
      )}
    </Card>
  );
};

export default PersonalizedRecommendations;
