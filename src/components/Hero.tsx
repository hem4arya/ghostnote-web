import { Button } from "@/components/ui/button";

const categories = ["All", "Development", "AI/ML", "Design", "Security", "Interview", "Writing", "Marketing", "Blockchain"];

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent mb-6">
          Discover Premium Notes
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          A curated marketplace for high-quality notes, guides, and resources from top experts in every field.
        </p>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="border-ghost-purple/30 bg-ghost-dark/50 hover:bg-ghost-purple/20 hover:border-ghost-purple/60 text-white hover:text-ghost-neon transition-all duration-300 backdrop-blur-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ghost-purple/5 via-transparent to-ghost-neon/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ghost-purple/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default Hero;
