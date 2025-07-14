'use client';

import React from 'react';
import PremiumSearchExperience from './src/components/PremiumSearchExperience';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Amazing Notes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for with our intelligent search system. 
            Get instant suggestions, smart previews, and discover trending content.
          </p>
        </div>

        {/* Premium Search Component */}
        <PremiumSearchExperience />

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Suggestions</h3>
            <p className="text-gray-600">Get real-time suggestions including recent searches, trending queries, popular notes, and related categories as you type</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Filters</h3>
            <p className="text-gray-600">Filter by price (free/paid), category, sort by relevance/recent/popularity/rating, and set minimum rating thresholds</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Previews</h3>
            <p className="text-gray-600">Rich previews showing title, creator, tags, content snippet, price, rating, views, and purchase count before you click</p>
          </div>
        </div>

        {/* UX Flow Demonstration */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Premium Search Experience</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Start Typing</h4>
                    <p className="text-sm text-gray-600">Get instant suggestions including recent searches, trending queries, and auto-completions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Apply Filters</h4>
                    <p className="text-sm text-gray-600">Use advanced filters to narrow down results by price, category, rating, and recency</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Browse Previews</h4>
                    <p className="text-sm text-gray-600">See rich previews with all the information you need to make informed decisions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-orange-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fallback & Suggestions</h4>
                    <p className="text-sm text-gray-600">If no results found, get similar suggestions and trending alternatives</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Voice Search (Coming Soon)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mobile Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Keyboard Navigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Recent Search History</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Trending Suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Smart Auto-complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Category Filters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Price & Rating Filters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 