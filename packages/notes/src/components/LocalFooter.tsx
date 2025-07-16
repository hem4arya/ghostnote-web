// Local Footer component for notes package
"use client";

import Link from "next/link";

// Next.js component wrappers
const LinkSafe = Link as React.ElementType;

// React 19 compatibility wrapper
const SafeLink = Link as React.ElementType;

export default function LocalFooter() {
  return (
    <footer className="bg-black border-t border-ghost-purple/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-ghost-neon to-ghost-purple rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">GN</span>
              </div>
              <span className="text-white font-semibold text-lg">
                GhostNote
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Discover and share knowledge through curated notes, tutorials, and
              insights from experts around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <SafeLink
                  href="/notes"
                  className="text-gray-400 hover:text-ghost-neon transition-colors"
                >
                  Browse Notes
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/search"
                  className="text-gray-400 hover:text-ghost-neon transition-colors"
                >
                  Search
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/dashboard"
                  className="text-gray-400 hover:text-ghost-neon transition-colors"
                >
                  Dashboard
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <SafeLink
                  href="/help"
                  className="text-gray-400 hover:text-ghost-neon transition-colors"
                >
                  Help Center
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/contact"
                  className="text-gray-400 hover:text-ghost-neon transition-colors"
                >
                  Contact
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/privacy"
                  className="text-gray-400 hover:text-ghost-neon transition-colors"
                >
                  Privacy
                </SafeLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ghost-purple/20 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} GhostNote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
