'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoteCard from '@/components/NoteCard';
import { sampleNotes } from '@/data/sampleNotes';
import { Note } from '@/components/NoteCard';

interface SearchResult extends Note {
  similarity?: number;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Development', 'AI/ML', 'Design', 'Security', 'Interview', 'Writing', 'Marketing', 'Blockchain'];
  
  const trendingSearches = [
    "React performance optimization",
    "AI writing prompts",
    "Startup pitch deck",
    "UI/UX design principles",
    "Cybersecurity best practices",
    "Content marketing strategies"
  ];

  // Load recent searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ghostnote-recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing recent searches:', e);
        }
      }
    }
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    if (typeof window !== 'undefined') {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('ghostnote-recent-searches', JSON.stringify(updated));
    }
  };

  // Smart search function
  const performSearch = (searchQuery: string, category = selectedCategory) => {
    setIsLoading(true);

    // Process immediately without artificial delay
    let filteredNotes = sampleNotes;

    // Filter by category first
    if (category !== 'All') {
      filteredNotes = filteredNotes.filter(note => note.category === category);
    }

    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      const keywords = queryLower.split(' ').filter(word => word.length > 1);

      // Semantic mapping for intelligent search
      const semanticMap: { [key: string]: string[] } = {
        'motivation': ['motivational', 'inspiration', 'encouragement', 'uplift', 'positive'],
        'breakup': ['relationship', 'love', 'heart', 'emotional', 'dating'],
        'dark': ['gothic', 'noir', 'mysterious', 'shadow', 'thriller'],
        'writing': ['content', 'text', 'author', 'creative', 'copywriting'],
        'startup': ['business', 'entrepreneur', 'pitch', 'company', 'venture'],
        'interview': ['job', 'career', 'professional', 'coding', 'technical'],
        'ai': ['artificial', 'intelligence', 'machine', 'learning', 'neural'],
        'design': ['ui', 'ux', 'visual', 'interface', 'user'],
        'security': ['cyber', 'protection', 'hack', 'safe', 'privacy'],
        'crypto': ['blockchain', 'bitcoin', 'digital', 'currency', 'trading'],
        'marketing': ['growth', 'sales', 'promotion', 'business', 'advertising'],
        'react': ['javascript', 'frontend', 'component', 'jsx', 'hooks'],
        'performance': ['optimization', 'speed', 'fast', 'efficient', 'improve'],
        'advanced': ['expert', 'professional', 'complex', 'sophisticated']
      };

      // Expand keywords with semantic alternatives
      const expandedKeywords = new Set(keywords);
      keywords.forEach(keyword => {
        Object.entries(semanticMap).forEach(([key, synonyms]) => {
          if (keyword.includes(key) || synonyms.some(syn => keyword.includes(syn))) {
            expandedKeywords.add(key);
            synonyms.forEach(syn => expandedKeywords.add(syn));
          }
        });
      });

      // Score and filter notes
      const scoredResults = filteredNotes.map(note => {
        let score = 0;
        const searchableText = `${note.title} ${note.previewText} ${note.category} ${note.author}`.toLowerCase();

        // Exact phrase match (highest score)
        if (searchableText.includes(queryLower)) {
          score += 100;
        }

        // Individual keyword matches
        Array.from(expandedKeywords).forEach(keyword => {
          if (searchableText.includes(keyword)) {
            score += 15;
          }
        });

        // Category boost
        if (note.category.toLowerCase().includes(queryLower)) {
          score += 50;
        }

        // Title match boost
        if (note.title.toLowerCase().includes(queryLower)) {
          score += 75;
        }

        // Author match
        if (note.author.toLowerCase().includes(queryLower)) {
          score += 25;
        }

        return { ...note, similarity: Math.min(score / 100, 1) };
      });

      filteredNotes = scoredResults
        .filter(result => result.similarity > 0)
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

      if (filteredNotes.length > 0) {
        saveRecentSearch(searchQuery);
      }
    }

    setResults(filteredNotes);
    setIsLoading(false);
  };

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    performSearch(query, category);
  };

  // Load all notes initially
  useEffect(() => {
    setResults(sampleNotes);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black text-gray-300">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <Sparkles className="inline h-8 w-8 text-ghost-neon mr-2" />
              Intelligent Search
            </h1>
            <p className="text-gray-400 text-lg">
              Discover notes using natural language. Try &ldquo;motivational notes for breakup&rdquo; or &ldquo;React performance tips&rdquo;
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search with AI: 'motivational notes for breakup', 'dark writing prompts'..."
                className="pl-12 pr-4 py-4 text-lg bg-ghost-dark/50 border-ghost-purple/30 focus:border-ghost-neon focus:ring-ghost-neon/20 text-white placeholder-gray-400"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-medium"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Categories */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-ghost-purple" />
              <h3 className="text-lg font-semibold text-white">Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={selectedCategory === category 
                    ? "bg-gradient-to-r from-ghost-purple to-ghost-neon text-white" 
                    : "border-ghost-purple/30 text-gray-400 hover:text-ghost-neon hover:border-ghost-neon"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <Card className="bg-ghost-dark/50 border-ghost-purple/20 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-ghost-purple" />
                    <h4 className="font-semibold text-white">Recent Searches</h4>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 5).map((recent, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(recent);
                          performSearch(recent);
                        }}
                        className="block w-full text-left text-sm text-gray-400 hover:text-ghost-neon p-2 rounded hover:bg-ghost-purple/20 transition-colors"
                      >
                        {recent}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Trending Searches */}
              <Card className="bg-ghost-dark/50 border-ghost-purple/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-ghost-neon" />
                  <h4 className="font-semibold text-white">Trending</h4>
                </div>
                <div className="space-y-2">
                  {trendingSearches.map((trending, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(trending);
                        performSearch(trending);
                      }}
                      className="block w-full text-left text-sm text-gray-400 hover:text-ghost-neon p-2 rounded hover:bg-ghost-purple/20 transition-colors"
                    >
                      {trending}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-ghost-purple border-t-ghost-neon mx-auto mb-4"></div>
                    <p className="text-gray-400">Searching with AI...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">
                        {query ? `Results for "${query}"` : `All ${selectedCategory} Notes`}
                      </h3>
                      <Badge variant="secondary" className="bg-ghost-neon/20 text-ghost-neon">
                        {results.length} found
                      </Badge>
                    </div>
                  </div>

                  {/* Results Grid */}
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.map((note) => (
                        <div key={note.id} className="relative">
                          <NoteCard note={note} />
                          {note.similarity && note.similarity > 0.7 && (
                            <Badge 
                              variant="outline" 
                              className="absolute top-2 right-2 text-xs border-ghost-neon/50 text-ghost-neon bg-ghost-dark/80"
                            >
                              {Math.round(note.similarity * 100)}% match
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                      <p className="text-gray-400 mb-4">
                        Try different keywords or browse our categories
                      </p>
                      <Button
                        onClick={() => {
                          setQuery('');
                          setSelectedCategory('All');
                          setResults(sampleNotes);
                        }}
                        variant="outline"
                        className="border-ghost-purple/30 text-gray-400 hover:text-ghost-neon hover:border-ghost-neon"
                      >
                        Show All Notes
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
