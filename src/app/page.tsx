export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            GhostNote
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The underground marketplace for original thought. Write, sell, and remix ideas anonymously.
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform">
              Get Started
            </button>
            <button className="px-8 py-3 border border-cyan-500 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500 hover:text-black transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
