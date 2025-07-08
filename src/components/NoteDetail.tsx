'use client';

import { useState } from 'react';
import { Share2, Flag, Bookmark, ShoppingCart, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note } from '@/components/NoteCard';
import Image from 'next/image';

// Types
type NoteDetailProps = {
  note: Note;
};

const NoteDetail = ({ note }: NoteDetailProps) => {
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePurchase = () => {
    // In a real app, this would trigger a payment flow
    setIsPurchased(true);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {note.title}
          </h1>
          
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:text-lg prose-p:leading-relaxed mb-8">
            <p>{note.previewText}</p>
            {isPurchased && (
              <div className="mt-6 border-t border-ghost-purple/20 pt-6">
                <p>
                  This is the full content of the note that is revealed after purchase. 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                  <br /><br />
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                </p>
              </div>
            )}
          </div>

          <div className="bg-ghost-dark/30 border border-ghost-purple/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-ghost-neon mb-3">Why Buy This Note?</h2>
            <p className="text-gray-300 leading-relaxed">
              Unlock exclusive insights and expert techniques that you won&apos;t find anywhere else. This note provides a comprehensive breakdown, saving you hours of research and accelerating your learning curve. It&apos;s a one-time investment for lifetime knowledge.
            </p>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative rounded-xl overflow-hidden border border-ghost-purple/20 shadow-lg shadow-ghost-purple/10">
            <Image 
              src="/file.svg" // Placeholder image
              alt="Note preview"
              width={500}
              height={300}
              className="object-cover w-full h-full"
            />
            {!isPurchased && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center">
                 <Lock className="w-16 h-16 text-ghost-purple/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ghost-dark via-transparent to-transparent"></div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-ghost-dark/50 to-ghost-dark/20 border border-ghost-purple/20 shadow-2xl shadow-ghost-purple/5 backdrop-blur-sm">
            {!isPurchased ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-white">${note.price}</span>
                </div>
                <Button 
                  onClick={handlePurchase} 
                  className="w-full bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-bold text-lg py-6 rounded-lg shadow-[0_0_20px_rgba(5,255,205,0.5)] hover:shadow-[0_0_30px_rgba(5,255,205,0.7)] transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Buy & Unlock
                </Button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-lg text-ghost-neon font-semibold">Note Unlocked!</p>
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-semibold text-gray-300">Author</span>
              <span>{note.author}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-semibold text-gray-300">Published</span>
              <span>July 8, 2025</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-semibold text-gray-300">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-ghost-neon" fill="currentColor" />
                <span>{note.rating} ({note.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-semibold text-gray-300">Category</span>
              <span className="px-2 py-1 rounded-full bg-ghost-purple/20 text-ghost-neon text-xs font-medium">
                {note.category}
              </span>
            </div>
          </div>

          <div className="border-t border-ghost-purple/20 pt-4 flex justify-around items-center">
            <Button variant="ghost" className="text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/10 flex-1 flex-col h-auto py-2">
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/10 flex-1 flex-col h-auto py-2">
              <Bookmark className="h-5 w-5 mb-1" />
              <span className="text-xs">Save</span>
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-red-500 hover:bg-ghost-purple/10 flex-1 flex-col h-auto py-2">
              <Flag className="h-5 w-5 mb-1" />
              <span className="text-xs">Report</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoteDetail;
