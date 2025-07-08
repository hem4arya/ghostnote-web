'use client';

import { useState } from 'react';
import NoteCard from './NoteCard';
import { sampleNotes } from '@/data/sampleNotes';
import QuickStats from './QuickStats';
import Alerts from './Alerts';
import { Note } from './NoteCard';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('private');

  const renderContent = () => {
    switch (activeTab) {
      case 'private':
        return <NoteGrid title="My Private Notes" notes={sampleNotes.filter(n => !n.isPublic)} />;
      case 'public':
        return <NoteGrid title="My Public Notes" notes={sampleNotes.filter(n => n.isPublic)} />;
      case 'stats':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Statistics & Alerts</h2>
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
      <div className="flex border-b border-ghost-purple/20 mb-6 overflow-x-auto pb-1 hide-scrollbar">
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
        ? 'border-ghost-neon text-ghost-neon'
        : 'border-transparent text-gray-400 hover:text-white'
    }`}
  >
    {title}
  </button>
);

const NoteGrid = ({ title, notes }: { title: string; notes: Note[] }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 md:mb-6 text-white">{title}</h2>
    {notes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 md:py-16 bg-ghost-dark/30 rounded-lg border border-dashed border-ghost-purple/20">
        <p className="text-gray-400">No notes here yet.</p>
      </div>
    )}
  </div>
);

export default DashboardTabs;
