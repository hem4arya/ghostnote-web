'use client';

import { Loader2 } from 'lucide-react';
import type { LoadingStateProps } from '../types';

export function LoadingState({ message = 'Loading Note' }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-ghost-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{message}</h2>
          <p className="text-gray-400">Retrieving your content...</p>
        </div>
        
        {/* Loading skeleton */}
        <div className="mt-8 space-y-4 max-w-2xl">
          <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2"></div>
          <div className="h-32 bg-gray-800 rounded animate-pulse mt-6"></div>
        </div>
      </div>
    </div>
  );
}
