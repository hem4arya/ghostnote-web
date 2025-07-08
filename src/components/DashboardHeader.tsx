import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="p-4 sm:p-6 md:p-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage your notes and track your success
        </p>
      </div>
      <Button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 text-base sm:text-lg">
        <Plus className="mr-2 h-5 w-5" />
        Create New Note
      </Button>
    </header>
  );
};

export default DashboardHeader;
