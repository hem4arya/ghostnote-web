'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// React 19 compatibility wrappers
const AlertTriangleIcon = AlertTriangle as React.ElementType;
const RefreshCwIcon = RefreshCw as React.ElementType;
const HomeIcon = Home as React.ElementType;
import { Button } from 'packages/ui-components/src/components/button';
import { useRouter } from 'next/navigation';
import type { ErrorStateProps } from '../types';

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const router = useRouter();

  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const errorMessage = error 
    ? (typeof error === 'string' ? error : 'An error occurred')
    : 'Note not found or access denied';

  return (
    <div className="min-h-screen bg-ghost-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <AlertTriangleIcon className="h-16 w-16 mx-auto text-red-500" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
            <p className="text-gray-400">{errorMessage}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
