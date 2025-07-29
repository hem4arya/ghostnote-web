'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import NoteCard from '@/components/note-card/NoteCard';
import QuickStats from './QuickStats';
import Alerts from '@/components/Alerts';
import { Note } from '@/components/note-card/NoteCard.types';
import { toast } from 'react-toastify';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('private');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      global: {
        headers: {
          'Accept': 'application/json'
        }
      }
    }
  });

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setNotes([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notes:', error);
          setNotes([]);
        } else {
          // Transform the data to match the Note interface with simple structure
          const transformedNotes: Note[] = (data || []).map(note => ({
            id: note.id,
            title: note.title,
            previewText: note.content?.substring(0, 200) || '',
            category: 'General',
            price: note.price || 0,
            author: 'You',
            rating: 0,
            reviews: 0,
            isPublic: note.is_published || false,
            tags: []
          }));
          setNotes(transformedNotes);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotes();
  }, [supabase]);

  // Function to handle publishing a note
  const handlePublishNote = async (noteId: number) => {
    const priceInput = prompt('Enter a price for this note (in dollars):');
    
    if (priceInput === null) {
      // User cancelled
      return;
    }
    
    const price = parseFloat(priceInput);
    
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price (0 or greater)');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          is_published: true,
          price: price 
        })
        .eq('id', noteId);

      if (error) {
        console.error('Error publishing note:', error);
        toast.error('Failed to publish note. Please try again.');
        return; // Exit early if there's an error
      } else {
        console.log('Database update successful:', { noteId, price });
        toast.success('Note published successfully!');
        
        // Update the local state to reflect the change
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId 
              ? { ...note, isPublic: true, price: price }
              : note
          )
        );
      }
    } catch (error) {
      console.error('Error publishing note:', error);
      toast.error('Failed to publish note. Please try again.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'private':
        return <NoteGrid title="My Private Notes" notes={notes.filter(n => !n.isPublic)} onPublish={handlePublishNote} />;
      case 'public':
        return <NoteGrid title="My Public Notes" notes={notes.filter(n => n.isPublic)} onPublish={handlePublishNote} />;
      case 'stats':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Statistics & Alerts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <QuickStats />
              </div>
              <div className="space-y-8">
                <Alerts />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="flex border-b border-border mb-6 overflow-x-auto pb-1 hide-scrollbar">
        <TabButton
          title="Private"
          isActive={activeTab === 'private'}
          onClick={() => setActiveTab('private')}
        />
        <TabButton
          title="Public"
          isActive={activeTab === 'public'}
          onClick={() => setActiveTab('public')}
        />
        <TabButton
          title="Stats"
          isActive={activeTab === 'stats'}
          onClick={() => setActiveTab('stats')}
        />
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

const TabButton = ({ title, isActive, onClick }: { title: string; isActive: boolean; onClick: () => void; }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 -mb-px border-b-2 focus:outline-none ${
      isActive
        ? 'border-accent text-accent'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`}
  >
    {title}
  </button>
);

const NoteGrid = ({ title, notes, onPublish }: { title: string; notes: Note[]; onPublish: (noteId: number) => Promise<void>; }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 md:mb-6 text-foreground">{title}</h2>
    {notes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {notes.map((note) => (
          <DashboardNoteCard key={note.id} note={note} onPublish={onPublish} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 md:py-16 bg-card rounded-lg border border-dashed border-border">
        <p className="text-muted-foreground">No notes here yet.</p>
      </div>
    )}
  </div>
);

// Custom dashboard note card with publish button
const DashboardNoteCard = ({ note, onPublish }: { note: Note; onPublish: (noteId: number) => Promise<void>; }) => (
  <div className="relative">
    <NoteCard note={note} />
    {!note.isPublic && (
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPublish(note.id);
          }}
          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 shadow-sm"
        >
          Publish
        </button>
      </div>
    )}
    {note.isPublic && (
      <div className="absolute top-2 right-2">
        <span className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md shadow-sm">
          Published - ${note.price}
        </span>
      </div>
    )}
  </div>
);

export default DashboardTabs;
