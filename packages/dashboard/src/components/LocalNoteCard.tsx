// Local NoteCard component for dashboard package
"use client";

import { Badge } from "@ui/badge";
import { Card } from "@ui/card";
import { Eye, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Note } from "../types/Note";

// React 19 compatibility wrappers
const EyeIcon = Eye as React.ElementType;
const ShoppingCartIcon = ShoppingCart as React.ElementType;
const StarIcon = Star as React.ElementType;
// Next.js component wrappers
const LinkSafe = Link as React.ElementType;

const SafeLink = Link as React.ElementType;

interface NoteCardProps {
  note: Note;
  className?: string;
}

export default function LocalNoteCard({ note, className = "" }: NoteCardProps) {
  return (
    <SafeLink href={`/notes/${note.id}`}>
      <Card
        className={`p-6 bg-ghost-gray/10 border-ghost-purple/20 hover:border-ghost-neon/50 hover:bg-ghost-purple/10 transition-all duration-300 cursor-pointer group ${className}`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white group-hover:text-ghost-neon transition-colors line-clamp-2">
                {note.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">by {note.author}</p>
            </div>
            {note.price > 0 && (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-lg font-bold text-ghost-neon">
                  ${note.price}
                </span>
              </div>
            )}
          </div>

          {/* Content Preview */}
          <p className="text-gray-300 text-sm line-clamp-3">
            {note.snippet || note.previewText || note.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-ghost-purple/20 text-ghost-neon text-xs"
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-ghost-purple/20 text-gray-400 text-xs"
              >
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-ghost-purple/20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">{note.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">{note.views}</span>
              </div>
              {note.price > 0 && (
                <div className="flex items-center space-x-1">
                  <ShoppingCartIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {note.purchases}
                  </span>
                </div>
              )}
            </div>
            <Badge
              variant="outline"
              className="border-ghost-purple/30 text-gray-400"
            >
              {note.category}
            </Badge>
          </div>
        </div>
      </Card>
    </SafeLink>
  );
}

// Also export the Note type for compatibility
export type { Note };
