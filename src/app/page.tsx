"use client";

// Import the Navbar component using both methods to test
import { Navbar } from "@ghostnote/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-ghost-dark">
      {/* Test Navbar with explicit styles if needed */}
      <div className="border-b border-purple-500 bg-gray-900/80 p-4">
        <div className="text-white text-lg">Test Header (should be styled)</div>
      </div>

      <Navbar
        user={null}
        onLoginClick={() => console.log("Login clicked")}
        onSignUpClick={() => console.log("Sign up clicked")}
      />

      {/* Your app content */}
      <main className="p-8">
        <h1 className="text-2xl font-bold text-white">Welcome to GhostNote</h1>
        <p className="text-gray-300 mt-4">
          The Navbar should now be properly styled with all animations and
          effects.
        </p>
        {/* Test if ghost colors are working */}
        <div className="mt-4 p-4 bg-ghost-purple text-white rounded">
          Test ghost-purple background
        </div>
        <div className="mt-2 p-4 bg-ghost-neon text-black rounded">
          Test ghost-neon background
        </div>

        {/* Debug info */}
        <div className="mt-4 p-4 border border-gray-500 rounded">
          <h3 className="text-white font-bold">Debug:</h3>
          <p className="text-gray-300">
            If the test header above has a dark background with purple border,
            Tailwind is working.
          </p>
          <p className="text-gray-300">
            If the ghost color boxes below show proper colors, custom colors are
            working.
          </p>
        </div>
      </main>
    </div>
  );
}
