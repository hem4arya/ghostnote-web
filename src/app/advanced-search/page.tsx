"use client";

import React, { useState } from 'react';
import AdvancedSmartSearch from '@/features/search/components/AdvancedSmartSearch';
import HybridSmartSearch from '@/features/search/components/HybridSmartSearch';
import PremiumSearchExperience from '@/features/search/components/PremiumSearchExperience';
import SmartSearch from '@/features/search/components/SmartSearch';
import IntelligentSearch from '@/features/search/components/IntelligentSearch';
import IntelligentSearchFixed from '@/features/search/components/IntelligentSearchFixed';

export default function AdvancedSearchPage() {
  const [query, setQuery] = useState('');
  const [openAdvanced, setOpenAdvanced] = useState(true);
  const [openSmart, setOpenSmart] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghost-gray via-ghost-purple to-black px-4 py-12 flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl bg-ghost-gray/60 rounded-2xl shadow-lg shadow-ghost-purple/30 border border-ghost-purple/40 p-8 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold mb-8 text-ghost-purple drop-shadow-neon text-center tracking-tight">Advanced Search</h1>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type to search across advanced features..."
          className="w-full p-4 mb-10 rounded-xl border border-ghost-purple/50 bg-black/60 text-black placeholder:text-ghost-purple/60 focus:ring-2 focus:ring-ghost-purple focus:outline-none shadow-neon"
        />
        <div className="space-y-10">
          <AdvancedSmartSearch
            query={query}
            isOpen={openAdvanced}
            onClose={() => setOpenAdvanced(false)}
          />
          <HybridSmartSearch />
          <PremiumSearchExperience />
          <SmartSearch
            query={query}
            isOpen={openSmart}
            onClose={() => setOpenSmart(false)}
          />
          <IntelligentSearch placeholder="Try searching for 'motivational notes for breakup', 'dark writing prompts'..." />
          <IntelligentSearchFixed placeholder="Try searching for 'AI writing prompts', 'productivity hacks'..." />
        </div>
      </div>
    </div>
  );
}
