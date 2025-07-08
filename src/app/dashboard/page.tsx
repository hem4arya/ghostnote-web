import DashboardHeader from '@/components/DashboardHeader';
import NoteCard from '@/components/NoteCard';
import QuickStats from '@/components/QuickStats';
import { sampleNotes } from '@/data/sampleNotes';
import Alerts from '@/components/Alerts';

const DashboardPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <DashboardHeader />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">My Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sampleNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <QuickStats />
            <Alerts />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
