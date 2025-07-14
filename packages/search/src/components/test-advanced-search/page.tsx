'use client';

import { useState } from 'react';
// import { AdvancedSmartSearch } from '@/features/search';
import HybridSmartSearch from '../HybridSmartSearch';
import { Input } from 'packages/ui-components/src/components/input';
import { Card } from 'packages/ui-components/src/components/card';

export default function AdvancedSearchTestPage() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ghost-dark p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Advanced Search Test</h1>
        
        <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30">
          <div className="relative max-w-2xl">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search for notes..."
              className="w-full bg-ghost-gray/20 border-ghost-purple/30 text-white"
            />
            
            <HybridSmartSearch />
          </div>
        </Card>
        
        <div className="mt-8 text-gray-400">
          <p>This page tests the AdvancedSmartSearch component functionality.</p>
          <p>Try searching for terms like &quot;React&quot;, &quot;AI&quot;, &quot;design&quot;, etc.</p>
        </div>
      </div>
    </div>
  );
}
