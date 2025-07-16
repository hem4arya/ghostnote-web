"use client";

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Slider } from "@ui/slider";
import {
  BarChart3,
  Eye,
  Filter,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Fix React 19 type compatibility issues
const TrendingUpIcon = TrendingUp as React.ElementType;
const StarIcon = Star as React.ElementType;
const EyeIcon = Eye as React.ElementType;
const ShoppingCartIcon = ShoppingCart as React.ElementType;
const ShieldIcon = Shield as React.ElementType;
const FilterIcon = Filter as React.ElementType;
const BarChart3Icon = BarChart3 as React.ElementType;
const LinkSafe = Link as React.ElementType;

// Replace problematic imports with local copies
import { sampleNotes } from "../data/sampleNotes";
import { Note } from "../types/Note";

interface RankedNote extends Note {
  content_similarity?: number;
  popularity_score?: number;
  recency_score?: number;
  creator_score?: number;
  personalization_score?: number;
  final_score?: number;
  purchase_count?: number;
  view_count?: number;
  is_verified_creator?: boolean;
  creator_trust_score?: number;
}

interface AdvancedSearchProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  userId?: string;
}

const AdvancedSmartSearch = ({
  query,
  isOpen,
  onClose,
  className = "",
  userId,
}: AdvancedSearchProps) => {
  const [results, setResults] = useState<RankedNote[]>([]);
  const [fallbackResults, setFallbackResults] = useState<RankedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minRating, setMinRating] = useState<number[]>([0]);
  const [maxPrice, setMaxPrice] = useState<number[]>([100]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  const categories = [
    "All",
    "Development",
    "AI/ML",
    "Design",
    "Security",
    "Interview",
    "Writing",
    "Marketing",
    "Blockchain",
  ];

  // Enhanced semantic mapping with weights
  const getSemanticScore = useCallback(
    (searchQuery: string, note: Note): number => {
      const queryLower = searchQuery.toLowerCase();
      const keywords = queryLower.split(" ").filter((word) => word.length > 1);

      const semanticMap: {
        [key: string]: { synonyms: string[]; weight: number };
      } = {
        motivation: {
          synonyms: [
            "motivational",
            "inspiration",
            "encouragement",
            "uplift",
            "positive",
          ],
          weight: 1.0,
        },
        breakup: {
          synonyms: ["relationship", "love", "heart", "emotional", "dating"],
          weight: 1.0,
        },
        dark: {
          synonyms: ["gothic", "noir", "mysterious", "shadow", "thriller"],
          weight: 0.8,
        },
        writing: {
          synonyms: ["content", "text", "author", "creative", "copywriting"],
          weight: 0.9,
        },
        startup: {
          synonyms: ["business", "entrepreneur", "pitch", "company", "venture"],
          weight: 1.0,
        },
        interview: {
          synonyms: ["job", "career", "professional", "coding", "technical"],
          weight: 1.0,
        },
        ai: {
          synonyms: [
            "artificial",
            "intelligence",
            "machine",
            "learning",
            "neural",
          ],
          weight: 1.0,
        },
        design: {
          synonyms: ["ui", "ux", "visual", "interface", "user"],
          weight: 0.9,
        },
        security: {
          synonyms: ["cyber", "protection", "hack", "safe", "privacy"],
          weight: 1.0,
        },
        react: {
          synonyms: ["javascript", "frontend", "component", "jsx", "hooks"],
          weight: 1.0,
        },
        advanced: {
          synonyms: ["expert", "professional", "complex", "sophisticated"],
          weight: 0.8,
        },
      };

      let score = 0;
      const searchableText =
        `${note.title} ${note.previewText} ${note.category} ${note.author}`.toLowerCase();

      // Exact phrase match (highest score)
      if (searchableText.includes(queryLower)) {
        score += 100;
      }

      // Title match boost
      if (note.title.toLowerCase().includes(queryLower)) {
        score += 75;
      }

      // Category match
      if (note.category.toLowerCase().includes(queryLower)) {
        score += 50;
      }

      // Semantic keyword matching
      keywords.forEach((keyword) => {
        if (searchableText.includes(keyword)) {
          score += 20;
        }

        // Check semantic alternatives
        Object.entries(semanticMap).forEach(([key, data]) => {
          if (
            keyword.includes(key) ||
            data.synonyms.some((syn) => keyword.includes(syn))
          ) {
            score += 15 * data.weight;
          }
        });
      });

      return Math.min(score / 100, 1);
    },
    []
  );

  // Advanced ranking algorithm
  const calculateAdvancedScore = useCallback(
    (note: RankedNote, contentScore: number): RankedNote => {
      // Simulate note metrics (in real app, these come from database)
      const mockMetrics = {
        purchase_count: Math.floor(Math.random() * 500) + 10,
        view_count: Math.floor(Math.random() * 2000) + 50,
        creator_trust_score: 0.3 + Math.random() * 0.7,
        is_verified_creator: Math.random() > 0.7,
        days_old: Math.floor(Math.random() * 365),
      };

      // 1. Content Similarity (35% weight)
      const content_similarity = contentScore;

      // 2. Popularity Score (25% weight)
      const purchaseScore = Math.min(
        1.0,
        Math.log(1 + mockMetrics.purchase_count) / Math.log(101)
      );
      const viewScore = Math.min(
        1.0,
        Math.log(1 + mockMetrics.view_count) / Math.log(1001)
      );
      const ratingScore = note.rating
        ? (note.rating / 5.0) * Math.min(1.0, (note.reviews || 0) / 10.0)
        : 0;
      const popularity_score =
        purchaseScore * 0.5 + ratingScore * 0.3 + viewScore * 0.2;

      // 3. Recency Score (15% weight)
      let recency_score: number;
      if (mockMetrics.days_old <= 7) recency_score = 1.0;
      else if (mockMetrics.days_old <= 30) recency_score = 0.8;
      else if (mockMetrics.days_old <= 90) recency_score = 0.6;
      else if (mockMetrics.days_old <= 180) recency_score = 0.4;
      else recency_score = 0.2;

      // 4. Creator Score (15% weight)
      const creator_score = mockMetrics.is_verified_creator
        ? mockMetrics.creator_trust_score * 1.2
        : mockMetrics.creator_trust_score;

      // 5. Personalization Score (10% weight) - simulated based on category preference
      const personalization_score = userId ? Math.random() * 0.5 : 0;

      // Final weighted score
      const final_score =
        content_similarity * 0.35 +
        popularity_score * 0.25 +
        recency_score * 0.15 +
        creator_score * 0.15 +
        personalization_score * 0.1;

      return {
        ...note,
        content_similarity,
        popularity_score,
        recency_score,
        creator_score,
        personalization_score,
        final_score,
        purchase_count: mockMetrics.purchase_count,
        view_count: mockMetrics.view_count,
        is_verified_creator: mockMetrics.is_verified_creator,
        creator_trust_score: mockMetrics.creator_trust_score,
      };
    },
    [userId]
  );

  // Enhanced search function
  const performAdvancedSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setFallbackResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Apply category filter
      let filteredNotes =
        selectedCategory === "All"
          ? sampleNotes
          : sampleNotes.filter((note) => note.category === selectedCategory);

      // Apply rating filter
      if (minRating[0] > 0) {
        filteredNotes = filteredNotes.filter(
          (note) => (note.rating || 0) >= minRating[0]
        );
      }

      // Apply price filter
      filteredNotes = filteredNotes.filter(
        (note) => (note.price || 0) <= maxPrice[0]
      );

      // Calculate scores for each note
      const scoredResults = filteredNotes.map((note) => {
        const contentScore = getSemanticScore(searchQuery, note);
        return calculateAdvancedScore(note, contentScore);
      });

      // Filter by minimum similarity threshold
      const qualityResults = scoredResults.filter(
        (result) => result.content_similarity! > 0
      );

      // Sort based on selected criteria
      let sortedResults: RankedNote[];
      switch (sortBy) {
        case "popularity":
          sortedResults = qualityResults.sort(
            (a, b) => (b.popularity_score || 0) - (a.popularity_score || 0)
          );
          break;
        case "recency":
          sortedResults = qualityResults.sort(
            (a, b) => (b.recency_score || 0) - (a.recency_score || 0)
          );
          break;
        case "price_low":
          sortedResults = qualityResults.sort(
            (a, b) => (a.price || 0) - (b.price || 0)
          );
          break;
        case "price_high":
          sortedResults = qualityResults.sort(
            (a, b) => (b.price || 0) - (a.price || 0)
          );
          break;
        case "rating":
          sortedResults = qualityResults.sort(
            (a, b) => (b.rating || 0) - (a.rating || 0)
          );
          break;
        default: // relevance
          sortedResults = qualityResults.sort(
            (a, b) => (b.final_score || 0) - (a.final_score || 0)
          );
      }

      setResults(sortedResults.slice(0, 10));

      // Fallback trending results if low quality or few results
      if (
        sortedResults.length < 3 ||
        (sortedResults[0]?.final_score || 0) < 0.4
      ) {
        const trending = sampleNotes
          .map((note) => calculateAdvancedScore(note, 0))
          .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
          .slice(0, 3);
        setFallbackResults(trending);
      } else {
        setFallbackResults([]);
      }

      setIsLoading(false);
    },
    [
      selectedCategory,
      minRating,
      maxPrice,
      sortBy,
      getSemanticScore,
      calculateAdvancedScore,
    ]
  );

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        performAdvancedSearch(query);
      } else {
        setResults([]);
        setFallbackResults([]);
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (query.length <= 2) {
        setIsLoading(false);
      }
    };
  }, [query, performAdvancedSearch]);

  if (!isOpen) {
    if (isLoading) {
      setIsLoading(false);
    }
    return null;
  }

  const ScoreBar = ({
    score,
    label,
    color,
  }: {
    score: number;
    label: string;
    color: string;
  }) => (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-gray-400">{label}:</span>
      <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${Math.max(score * 100, 2)}%` }}
        />
      </div>
      <span className="w-8 text-gray-300">{Math.round(score * 100)}</span>
    </div>
  );

  return (
    <Card
      className={`absolute top-full mt-2 w-full bg-ghost-dark/95 backdrop-blur-lg border-ghost-purple/30 shadow-2xl shadow-ghost-purple/10 z-50 max-h-[600px] overflow-y-auto ${className}`}
    >
      <div className="p-4">
        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Search Results</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-ghost-neon hover:bg-ghost-purple/20"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Card className="bg-ghost-gray/20 border-ghost-purple/20 p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-ghost-dark border-ghost-purple/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-ghost-dark border-ghost-purple/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="recency">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Min Rating: {minRating[0]} stars
                </label>
                <Slider
                  value={minRating}
                  onValueChange={setMinRating}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Max Price: ${maxPrice[0]}
                </label>
                <Slider
                  value={maxPrice}
                  onValueChange={setMaxPrice}
                  max={100}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-ghost-purple border-t-ghost-neon mr-3"></div>
            <span className="text-gray-300">
              Analyzing with advanced AI ranking...
            </span>
          </div>
        )}

        {/* Main Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3Icon className="h-5 w-5 text-ghost-neon" />
              <h4 className="font-semibold text-white">Ranked Results</h4>
              <Badge
                variant="secondary"
                className="bg-ghost-neon/20 text-ghost-neon"
              >
                {results.length} found
              </Badge>
            </div>

            {results.map((note, index) => (
              <LinkSafe
                key={note.id}
                href={`/notes/${note.id}`}
                onClick={onClose}
                className="block"
              >
                <Card className="p-4 bg-ghost-gray/20 hover:bg-ghost-purple/20 transition-colors group border-ghost-purple/30">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-white group-hover:text-ghost-neon transition-colors">
                          {note.title}
                        </h5>
                        {note.is_verified_creator && (
                          <ShieldIcon className="h-4 w-4 text-ghost-neon" />
                        )}
                        <Badge
                          variant="outline"
                          className="text-xs border-ghost-neon/30 text-ghost-neon"
                        >
                          #{index + 1}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {note.previewText}
                      </p>

                      {/* Ranking Scores */}
                      <div className="space-y-1 mb-3">
                        <ScoreBar
                          score={note.final_score || 0}
                          label="Overall"
                          color="bg-gradient-to-r from-ghost-neon to-ghost-cyan"
                        />
                        <ScoreBar
                          score={note.content_similarity || 0}
                          label="Content"
                          color="bg-blue-500"
                        />
                        <ScoreBar
                          score={note.popularity_score || 0}
                          label="Popular"
                          color="bg-green-500"
                        />
                        <ScoreBar
                          score={note.recency_score || 0}
                          label="Fresh"
                          color="bg-yellow-500"
                        />
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-ghost-neon">
                        ${note.price}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                        <ShoppingCartIcon className="h-3 w-3" />
                        {note.purchase_count || 0}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <EyeIcon className="h-3 w-3" />
                        {note.view_count || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        by {note.author}
                      </span>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-400">
                          {note.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </LinkSafe>
            ))}
          </div>
        )}

        {/* Fallback Trending Results */}
        {!isLoading && fallbackResults.length > 0 && (
          <div className="mt-6 pt-4 border-t border-ghost-purple/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUpIcon className="h-5 w-5 text-ghost-cyan" />
              <h4 className="font-semibold text-white">
                Trending Alternatives
              </h4>
            </div>
            <div className="space-y-3">
              {fallbackResults.map((note) => (
                <LinkSafe
                  key={note.id}
                  href={`/notes/${note.id}`}
                  onClick={onClose}
                  className="block p-3 rounded-lg bg-ghost-cyan/10 hover:bg-ghost-cyan/20 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-white">{note.title}</h5>
                      <p className="text-sm text-gray-400">
                        {note.category} • {note.author}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-ghost-cyan">
                      ${note.price}
                    </span>
                  </div>
                </LinkSafe>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading &&
          query.length > 2 &&
          results.length === 0 &&
          fallbackResults.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                No notes found for &ldquo;{query}&rdquo;
              </div>
              <div className="text-sm text-gray-500">
                Try adjusting your filters or search terms
              </div>
            </div>
          )}
      </div>
    </Card>
  );
};

export default AdvancedSmartSearch;
