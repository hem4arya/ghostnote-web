import { Button } from '@/components/shared/ui/components/button';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DashboardHeader = () => {
  return (
    <header className="p-4 sm:p-6 md:p-8 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="mr-1 text-muted-foreground hover:text-accent md:flex hidden"
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your notes and track your success
          </p>
        </div>
      </div>
      <Button>
        <Plus className="mr-2 h-5 w-5" />
        <span className="hidden sm:inline">Create New Note</span>
        <span className="sm:hidden">New</span>
      </Button>
    </header>
  );
};

export default DashboardHeader;
