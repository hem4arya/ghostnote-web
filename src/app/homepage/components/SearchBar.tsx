"use client";

import { useState } from "react";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search notes, topics, or authors...",
  showFilters = true 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-12 pr-24 h-12 bg-ghost-gray/50 border-ghost-purple/30 text-white placeholder:text-gray-400 focus:border-ghost-purple/60"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan h-8"
          size="sm"
        >
          Search
        </Button>
      </div>

      {/* Quick Actions */}
      {showFilters && (
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-gray-300 hover:text-ghost-neon"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-ghost-neon"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
          
          {/* Quick Search Tags */}
          <div className="flex gap-2 ml-4">
            {["Tech", "Design", "Business"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  if (onSearch) onSearch(tag);
                }}
                className="px-3 py-1 text-xs bg-ghost-purple/20 text-ghost-purple border border-ghost-purple/30 rounded-full hover:bg-ghost-purple/30 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters (conditionally shown) */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-ghost-gray/30 rounded-lg border border-ghost-purple/20">
          <h4 className="text-sm font-medium text-white mb-3">Advanced Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="bg-ghost-gray/50 border border-ghost-purple/30 text-white rounded px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Design</option>
              <option>Business</option>
            </select>
            
            <select className="bg-ghost-gray/50 border border-ghost-purple/30 text-white rounded px-3 py-2 text-sm">
              <option>Any Time</option>
              <option>Past Week</option>
              <option>Past Month</option>
              <option>Past Year</option>
            </select>
            
            <select className="bg-ghost-gray/50 border border-ghost-purple/30 text-white rounded px-3 py-2 text-sm">
              <option>Most Relevant</option>
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
