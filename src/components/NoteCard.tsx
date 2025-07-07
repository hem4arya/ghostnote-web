import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export type Note = {
  id: number;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  author: string;
  price: number;
  image: string;
};

const NoteCard = ({ note }: { note: Note }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-ghost-dark/50 to-ghost-gray/30 backdrop-blur-sm border border-ghost-purple/20 transition-all duration-300 hover:border-ghost-purple/50 hover:scale-105 hover:shadow-2xl hover:shadow-ghost-purple/20">
      <div className="relative overflow-hidden">
        <Image 
          src={note.image} 
          alt={note.title} 
          width={400} 
          height={192} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-ghost-purple/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-white">{note.category}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
          <Star className="w-3 h-3 text-ghost-neon fill-current" />
          <span className="text-xs font-medium text-white">{note.rating}</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg text-white line-clamp-2 group-hover:text-ghost-neon transition-colors">
          {note.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-ghost-gray">
          <span className="font-medium text-ghost-purple">by {note.author}</span>
          <span className="text-ghost-gray">{note.reviews} reviews</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold text-ghost-neon">
            ${note.price}
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-medium hover:from-ghost-cyan hover:to-ghost-neon transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
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
