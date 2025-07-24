/**
 * Purchase Sidebar Component - Displays purchase information and actions
 */

'use client';

import * as React from 'react';
import { Share2, Flag, Bookmark, ShoppingCart, Lock, BookOpen } from 'lucide-react';
import type { Note } from '@/components/note-card';
import { Button } from '@shared/ui/components/button';

interface PurchaseSidebarProps {
  note: Note;
  isPurchased: boolean;
  onPurchase: () => void;
  onReadNow: () => void;
  className?: string;
}

export const PurchaseSidebar: React.FC<PurchaseSidebarProps> = ({
  note,
  isPurchased,
  onPurchase,
  onReadNow,
  className = '',
}) => {
  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div className="sticky top-24">
        <div className="rounded-xl border border-border bg-card/20 backdrop-blur-lg shadow-2xl shadow-ghost-purple/5">
          {/* Blurred Preview Image */}
          <div className="relative aspect-video rounded-t-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ghost-purple to-ghost-cyan opacity-50"></div>
            <div className="absolute inset-0 backdrop-blur-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="h-12 w-12 text-white/50" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
               <h3 className="text-lg font-bold text-white text-center">Content Locked</h3>
            </div>
          </div>
          
          <div className="p-6">
            {isPurchased ? (
              <div className="text-center py-4 space-y-4">
                <h3 className="text-xl font-bold text-ghost-neon mb-2">Purchased!</h3>
                <p className="text-muted-foreground">You have full access to this note.</p>
                <Button 
                  onClick={onReadNow} 
                  className="w-full bg-gradient-to-r from-ghost-purple to-ghost-neon text-white font-bold text-lg py-6 rounded-lg shadow-[0_0_20px_rgba(127,90,240,0.5)] hover:shadow-[0_0_30px_rgba(127,90,240,0.7)] transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  Read Now
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-foreground">${note.price}</span>
                </div>
                <Button 
                  onClick={onPurchase} 
                  className="w-full bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-bold text-lg py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.ghost.neon)] hover:scale-105 border-0"
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Buy & Unlock
                </Button>
              </>
            )}
            
            <div className="mt-6 border-t border-border pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Author</span>
                <span className="font-medium text-foreground">{note.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium text-foreground">{note.rating} ({note.reviews} reviews)</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tags</span>
                <div className="px-2 py-0.5 rounded-full bg-ghost-purple/20 text-xs sm:text-sm text-ghost-neon">
                  {note.category}
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="mt-4 border-t border-border pt-4 flex justify-around items-center">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-ghost-neon hover:bg-ghost-purple/10 rounded-full"><Share2 className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-ghost-neon hover:bg-ghost-purple/10 rounded-full"><Bookmark className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-ghost-purple/10 rounded-full"><Flag className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSidebar;
