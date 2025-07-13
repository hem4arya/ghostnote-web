import { Button } from "packages/ui-components/src/components/button";

const categories = ["All", "Development", "AI/ML", "Design", "Security", "Interview", "Writing", "Marketing", "Blockchain"];

const Hero = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-20 lg:py-24 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent mb-3 md:mb-4">
          Discover Premium Notes
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-1">
          A curated marketplace for high-quality notes, guides, and resources from top experts in every field.
        </p>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-2.5 mb-8 sm:mb-10 md:mb-14">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="text-sm sm:text-base border-ghost-purple/30 bg-ghost-dark/50 hover:bg-ghost-purple/20 hover:border-ghost-purple/60 text-white hover:text-ghost-neon transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-0 py-1.5 px-3 sm:py-2 sm:px-4 h-auto"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ghost-purple/5 via-transparent to-ghost-neon/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-72 md:w-80 lg:w-96 h-64 sm:h-72 md:h-80 lg:h-96 bg-ghost-purple/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default Hero;
