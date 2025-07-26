import React from 'react';
import DashboardHeader from './DashboardHeader';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-background text-foreground min-h-screen", className)}>
      <div className="flex">
        {/* <DashboardSidebar /> */}
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
