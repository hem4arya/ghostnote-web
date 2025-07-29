'use client';

import * as React from 'react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '@/components/navbar';
import { useNoteDetail } from './hooks/useNoteDetail';

interface NoteDetailPageProps {
  className?: string;
}

export const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ className = '' }) => {
  const { note, isLoading, error, hasAccess, checkingAccess, user, refreshAccess } = useNoteDetail();
  const [purchasing, setPurchasing] = useState(false);
  const supabase = createClientComponentClient();

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setPurchasing(true);
    
    try {
      if (!user) {
        alert('Please log in to purchase this note.');
        return;
      }

      if (!note) {
        alert('Note not found.');
        return;
      }

      console.log('Attempting to purchase note:', note.id, 'for user:', user.id);

      const { data, error } = await supabase
        .from('purchases')
        .insert([
          {
            note_id: note.id,
            buyer_id: user.id
          }
        ]);

      if (error) {
        console.error('Purchase error:', error);
        alert('Purchase failed. Please try again.');
      } else {
        console.log('Purchase successful:', data);
        alert('Purchase successful!');
        // Refresh access check
        await refreshAccess();
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading || checkingAccess) {
    return (
      <div className={`flex flex-col min-h-screen bg-background ${className}`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {isLoading ? 'Loading note...' : 'Checking access permissions...'}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={`flex flex-col min-h-screen bg-background ${className}`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Note Not Found</h1>
              <p className="text-muted-foreground">{error || 'The note you are looking for does not exist.'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background text-foreground ${className}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
            {note.title}
          </h1>
          
          <div className="mb-6 text-sm text-muted-foreground">
            Created: {new Date(note.created_at).toLocaleDateString()}
            {note.price && (
              <span className="ml-4 font-semibold text-purple-600">
                Price: ${note.price}
              </span>
            )}
          </div>
          
          {hasAccess ? (
            // Show full content if user has access
            <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          ) : (
            // Show preview and buy option if user doesn't have access
            <div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  🔒 This is a premium note
                </h3>
                <p className="text-muted-foreground mb-4">
                  This note contains premium content. Purchase it to view the full content.
                </p>
                
                {/* Show a preview of the content (first 200 characters) */}
                <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground mb-4">
                  <div className="text-sm text-muted-foreground border-l-4 border-purple-500 pl-4">
                    <strong>Preview:</strong>
                    <div dangerouslySetInnerHTML={{ 
                      __html: note.content.length > 200 
                        ? note.content.substring(0, 200) + '...' 
                        : note.content 
                    }} />
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={handleBuy}
                    disabled={purchasing}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {purchasing ? 'Processing...' : `Buy Note${note.price ? ` - $${note.price}` : ''}`}
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Please log in to purchase this note.
                    </p>
                    <a
                      href="/auth"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
                    >
                      Log In
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NoteDetailPage;
