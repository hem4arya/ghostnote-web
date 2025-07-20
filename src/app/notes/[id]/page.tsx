'use client';

import { useState, useEffect } from 'react';
import { Share2, Flag, Bookmark, ShoppingCart, Lock, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@shared/ui/components/button';
import { sampleNotes } from '@/data/sampleNotes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Note } from '@/components/NoteCard';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';

const NoteDetailPage = () => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // In a real app, you would fetch the note from an API
  // For now, we'll simulate it using the sampleNotes
  useEffect(() => {
    const fetchNote = () => {
      setIsLoading(true);
      try {
        // Find the note with the matching ID
        const foundNote = sampleNotes.find((n) => n.id === parseInt(id));
        setNote(foundNote || null);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handlePurchase = () => {
    // Show a loading toast
    toast.loading('Processing purchase...', {
      duration: 1500,
    });
    
    // In a real app, this would trigger a payment flow
    setTimeout(() => {
      setIsPurchased(true);
      toast.success(`Successfully purchased "${note?.title}"!`);
    }, 1500);
  };
  
  const handleReadNow = () => {
    router.push(`/reader/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-ghost-purple">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ghost-purple mb-4">Note Not Found</h2>
            <p className="text-gray-400 mb-6">The note you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const whyBuyText = "Unlock exclusive insights and advanced techniques with this note. It's a comprehensive guide filled with rare information, practical examples, and expert analysis that you won't find anywhere else. Perfect for accelerating your skills.";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black text-gray-300 font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Note Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-gray-400">
                <span>by <span className="text-ghost-purple font-medium">{note.author}</span></span>
                <span className="text-sm">Published on July 8, 2025</span>
              </div>

              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-ghost-neon">
                <p className="text-lg leading-relaxed">{note.previewText}</p>
                
                {!isPurchased && (
                  <div className="mt-8 p-6 rounded-lg bg-ghost-dark/30 border border-ghost-purple/20 shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
                      <Sparkles className="h-6 w-6 mr-3 text-ghost-neon" />
                      Why Buy This Note?
                    </h2>
                    <p className="text-gray-400 leading-relaxed">{whyBuyText}</p>
                  </div>
                )}

                {isPurchased && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-ghost-purple/20 pb-2">Full Note Content</h2>
                    <p>
                      This is the full content that is revealed after purchase.
                      <br/><br/>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                      <br /><br />
                      Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                      <br /><br />
                      Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Purchase Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-xl border border-ghost-purple/20 bg-black/20 backdrop-blur-lg shadow-2xl shadow-ghost-purple/5">
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
                        <p className="text-gray-400">You have full access to this note.</p>
                        <Button 
                          onClick={handleReadNow} 
                          className="w-full bg-gradient-to-r from-ghost-purple to-ghost-neon text-white font-bold text-lg py-6 rounded-lg shadow-[0_0_20px_rgba(127,90,240,0.5)] hover:shadow-[0_0_30px_rgba(127,90,240,0.7)] transition-all duration-300 transform hover:scale-105"
                        >
                          <BookOpen className="mr-3 h-6 w-6" />
                          Read Now
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <span className="text-4xl font-bold text-white">${note.price}</span>
                        </div>
                        <Button 
                          onClick={handlePurchase} 
                          className="w-full bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-bold text-lg py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.ghost.neon)] hover:scale-105 border-0"
                        >
                          <ShoppingCart className="mr-3 h-5 w-5" />
                          Buy & Unlock
                        </Button>
                      </>
                    )}
                    
                    <div className="mt-6 border-t border-ghost-purple/20 pt-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Author</span>
                        <span className="font-medium text-white">{note.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating</span>
                        <span className="font-medium text-white">{note.rating} ({note.reviews} reviews)</span>
                      </div>
                       <div className="flex justify-between items-center">
                        <span className="text-gray-400">Tags</span>
                        <div className="px-2 py-0.5 rounded-full bg-ghost-purple/20 text-xs sm:text-sm text-ghost-neon">
                          {note.category}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Bar */}
                    <div className="mt-4 border-t border-ghost-purple/20 pt-4 flex justify-around items-center">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/10 rounded-full"><Share2 className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/10 rounded-full"><Bookmark className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-ghost-purple/10 rounded-full"><Flag className="h-5 w-5" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NoteDetailPage;
