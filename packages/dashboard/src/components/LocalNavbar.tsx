// Local Navbar component for dashboard package
"use client";

import Link from "next/link";

// Next.js component wrappers
const LinkSafe = Link as React.ElementType;

// React 19 compatibility wrapper
const SafeLink = Link as React.ElementType;

export default function LocalNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-ghost-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <SafeLink href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-ghost-neon to-ghost-purple rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">GN</span>
            </div>
            <span className="text-white font-semibold text-lg">GhostNote</span>
          </SafeLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <SafeLink
              href="/notes"
              className="text-gray-300 hover:text-ghost-neon transition-colors"
            >
              Notes
            </SafeLink>
            <SafeLink
              href="/search"
              className="text-gray-300 hover:text-ghost-neon transition-colors"
            >
              Search
            </SafeLink>
            <SafeLink
              href="/dashboard"
              className="text-gray-300 hover:text-ghost-neon transition-colors"
            >
              Dashboard
            </SafeLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
