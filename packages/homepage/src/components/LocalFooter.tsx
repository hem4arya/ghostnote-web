const LocalFooter = () => {
  return (
    <footer className="bg-ghost-dark/50 border-t border-ghost-purple/20 py-6 sm:py-8 backdrop-blur-sm">
      <div className="container mx-auto text-center text-gray-400 px-4">
        <p className="text-base sm:text-lg">&copy; {new Date().getFullYear()} <span className="text-ghost-neon font-bold">GhostNote</span>. All rights reserved.</p>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base">A marketplace for the modern learner in the digital underground.</p>
      </div>
    </footer>
  );
};

export default LocalFooter;
