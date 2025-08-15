/**
 * PublishedNotes Component
 * Displays a list of user's published notes
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/components/card';
import { Badge } from '@/components/shared/ui/components/badge';
import type { PublishedNotesProps } from '../types';

export const PublishedNotes: React.FC<PublishedNotesProps> = ({
  notes,
  loading,
  username
}) => {
  if (loading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Published Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-border/50 rounded-lg">
                <div className="space-y-3">
                  <div className="h-6 bg-muted/50 rounded animate-pulse w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted/50 rounded animate-pulse w-16" />
                    <div className="h-6 bg-muted/50 rounded animate-pulse w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Published Notes
          <Badge variant="secondary" className="ml-2">
            {notes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Published Notes</h3>
            <p className="text-muted-foreground">
              {decodeURIComponent(username)} hasn&apos;t published any notes yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block group"
              >
                <div className="p-4 border border-border/50 rounded-lg hover:border-primary/30 hover:bg-muted/20 transition-all duration-200">
                  <div className="space-y-3">
                    {/* Note Title */}
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {note.title}
                    </h3>

                    {/* Note Excerpt */}
                    {note.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">
                        {note.excerpt}
                      </p>
                    )}

                    {/* Note Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(note.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {note.views_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{note.views_count} views</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};