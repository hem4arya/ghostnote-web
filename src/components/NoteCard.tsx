import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Note = {
  id: number;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  author: string;
  price: number;
  previewText: string; // Changed from image to previewText
};

const NoteCard = ({ note }: { note: Note }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-ghost-dark/50 to-ghost-gray/30 backdrop-blur-sm border border-ghost-purple/20 transition-all duration-300 hover:border-ghost-purple/50 hover:shadow-2xl hover:shadow-ghost-purple/20 flex flex-col h-full">
      {/* Tags header section */}
      <div className="flex items-center justify-between p-2 sm:p-3 bg-ghost-dark/90">
        <div className="px-2 py-0.5 sm:py-1 rounded-full bg-ghost-purple/80 backdrop-blur-sm">
          <span className="text-xs sm:text-sm font-medium text-white">{note.category}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full bg-black/50 backdrop-blur-sm">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-ghost-neon fill-current" />
          <span className="text-xs sm:text-sm font-medium text-white">{note.rating}</span>
        </div>
      </div>
      
      {/* Title */}
      <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-0 sm:pb-1">
        <h3 className="font-bold text-base sm:text-lg md:text-xl text-white line-clamp-2 group-hover:text-ghost-neon transition-colors">
          {note.title}
        </h3>
      </div>
      
      {/* Preview text section */}
      <div className="relative overflow-hidden flex-grow">
        <div className="w-full h-auto min-h-[7rem] sm:min-h-[9rem] md:min-h-[10rem] p-3 sm:p-4 pt-1 sm:pt-2 bg-ghost-dark/60">
          <p className="text-xs sm:text-sm md:text-base text-gray-400 break-words">
            {note.previewText.length > 200 
              ? note.previewText.substring(0, 200) 
              : note.previewText}
          </p>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 pt-2 sm:pt-3 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm text-ghost-gray">
          <span className="font-medium text-ghost-purple">by {note.author}</span>
          <span className="text-ghost-gray">{note.reviews} reviews</span>
        </div>
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <div className="flex items-center">
            <span className="text-sm sm:text-base md:text-lg font-bold text-ghost-neon">$</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-ghost-neon">{note.price}</span>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-medium hover:from-ghost-cyan hover:to-ghost-neon transition-all duration-300 focus:outline-none focus:ring-0 border-0 text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-3"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Buy Now
          </Button>
        </div>
      </div>
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-ghost-purple/10 via-transparent to-ghost-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default NoteCard;
