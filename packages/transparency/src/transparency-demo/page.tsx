'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'packages/ui-components/src/components/card';
import { sampleTransparencyData } from '../data/sampleTransparencyData';
import Navbar from 'packages/shell/src/Navbar';
import Footer from 'packages/shell/src/Footer';

const TransparencyDemoPage = () => {
  const scenarios = [
    {
      id: '1',
      title: 'Original Content',
      description: 'A note with completely original content',
    },
    {
      id: '2', 
      title: 'Modified Content',
      description: 'Content that builds upon existing material with significant modifications',
    },
    {
      id: '3',
      title: 'Heavily Inspired Content', 
      description: 'Content that draws heavily from existing sources',
    },
    {
      id: '4',
      title: 'Clone Content',
      description: 'Content that is very similar to existing material',
    },
    {
      id: '5',
      title: 'Private Original Source',
      description: 'Content similar to a source where the original creator is private',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black text-gray-300 font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Clone Transparency Demo</h1>
            <p className="text-xl text-gray-400">
              See how GhostNote helps buyers understand content originality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {scenarios.map((scenario) => {
              const data = sampleTransparencyData[scenario.id];
              
              return (
                <Card key={scenario.id} className="bg-black/20 border-ghost-purple/20 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">{scenario.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Compact badge version */}
                    <div>
                      <h4 className="text-sm font-medium text-ghost-purple mb-2">Compact Badge:</h4>
                      {data.is_clone ? (
                        <div className="transparency-badge bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm">
                          {data.transparency_badge.text}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No badge shown for original content</span>
                      )}
                    </div>

                    {/* Detailed version */}
                    <div>
                      <h4 className="text-sm font-medium text-ghost-purple mb-2">Detailed Info:</h4>
                      {data.is_clone ? (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="transparency-badge bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm">
                              {data.transparency_badge.text}
                            </div>
                            <span className="text-sm text-gray-400">Score: {data.originality_score}%</span>
                          </div>
                          <p className="text-gray-300 text-sm">{data.buyer_message.description}</p>
                          {data.similarity_score && (
                            <p className="text-yellow-400 text-sm mt-1">Similarity: {data.similarity_score}%</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-green-400 text-sm font-medium">✓ Original Content</p>
                          <p className="text-gray-400 text-sm mt-1">
                            This content was created from scratch by the author.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Raw data preview */}
                    <details className="text-xs">
                      <summary className="text-ghost-purple cursor-pointer hover:text-ghost-neon">
                        View Raw Data
                      </summary>
                      <pre className="mt-2 p-2 bg-black/40 rounded border text-gray-400 overflow-x-auto">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-6 rounded-xl bg-ghost-dark/30 border border-ghost-purple/20">
            <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-ghost-neon mb-2">1. Analysis</h3>
                <p className="text-gray-400">
                  Our system analyzes content similarity using advanced algorithms to detect potential clones.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-ghost-neon mb-2">2. Classification</h3>
                <p className="text-gray-400">
                  Content is classified as Original, Modified, Heavily Inspired, or Clone based on similarity scores.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-ghost-neon mb-2">3. Transparency</h3>
                <p className="text-gray-400">
                  Buyers see clear information about content originality before making purchase decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TransparencyDemoPage;
