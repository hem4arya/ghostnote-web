import { Button } from "@ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

// React 19 compatibility wrappers
const ArrowLeftIcon = ArrowLeft as React.ElementType;
const PlusIcon = Plus as React.ElementType;
// Next.js component wrappers
const LinkSafe = Link as React.ElementType;

const DashboardHeader = () => {
  return (
    <header className="p-4 sm:p-6 md:p-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="mr-1 text-gray-300 hover:text-ghost-neon md:flex hidden"
            >
              <LinkSafe href="/">
                <ArrowLeftIcon className="h-5 w-5" />
              </LinkSafe>
            </Button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Manage your notes and track your success
          </p>
        </div>
      </div>
      <Button className="bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-medium hover:from-ghost-cyan hover:to-ghost-neon transition-all duration-300 focus:outline-none focus:ring-0 border-0 px-6 py-2">
        <PlusIcon className="mr-2 h-5 w-5" />
        <span className="hidden sm:inline">Create New Note</span>
        <span className="sm:hidden">New</span>
      </Button>
    </header>
  );
};

export default DashboardHeader;
