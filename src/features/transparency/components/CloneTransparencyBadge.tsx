import React from 'react';
import { Badge } from 'packages/ui-components/components/badge';
import { Button } from 'packages/ui-components/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'packages/ui-components/components/card';
import { AlertTriangle, Info, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { CloneTransparencyBadgeProps } from '../types';

export function CloneTransparencyBadge({
  is_clone,
  originality_score,
  originality_level,
  similarity_score,
  original_note,
  transparency_badge,
  buyer_message,
  className = '',
  showDetailedInfo = false
}: CloneTransparencyBadgeProps) {
  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Info className="h-3 w-3" />;
      case 'low': return <Eye className="h-3 w-3" />;
      default: return null;
    }
  };

  const getOriginalityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!is_clone && !showDetailedInfo) {
    return (
      <Badge variant="default" className={`${className} bg-green-500/20 text-green-400 border-green-500/30`}>
        <Eye className="h-3 w-3 mr-1" />
        Original Content
      </Badge>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Transparency Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge 
          variant={getBadgeVariant(transparency_badge.severity)} 
          className="flex items-center gap-1"
        >
          {getIcon(transparency_badge.severity)}
          {transparency_badge.text}
        </Badge>
        
        {/* Originality Score */}
        <span className={`text-sm font-medium ${getOriginalityColor(originality_score)}`}>
          {originality_score}% Original
        </span>
        
        {/* Source Link */}
        {transparency_badge.show_source_link && original_note && original_note.creator_is_public && (
          <Link href={`/notes/${original_note.id}`}>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View Source
            </Button>
          </Link>
        )}
      </div>

      {/* Detailed Information Card (when enabled) */}
      {showDetailedInfo && (
        <Card className="bg-ghost-dark/50 border-ghost-purple/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              {buyer_message.title}
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Content transparency information for informed purchasing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Originality Details */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Originality Level:</span>
              <span className={`font-medium ${getOriginalityColor(originality_score)}`}>
                {originality_level}
              </span>
            </div>
            
            {is_clone && similarity_score && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Similarity to Source:</span>
                <span className="font-medium text-orange-400">
                  {Math.round(similarity_score)}%
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs text-gray-400 leading-relaxed">
              {buyer_message.description}
            </p>

            {/* Recommendation */}
            <div className="bg-ghost-purple/10 border border-ghost-purple/20 rounded p-2">
              <p className="text-xs text-ghost-neon font-medium">
                💡 {buyer_message.recommendation}
              </p>
            </div>

            {/* Original Source Info */}
            {original_note && original_note.creator_is_public && (
              <div className="border-t border-ghost-purple/20 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Original by:</p>
                    <p className="text-sm font-medium text-ghost-neon">
                      {original_note.creator_username || 'Anonymous Creator'}
                    </p>
                  </div>
                  <Link href={`/notes/${original_note.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Original
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CloneTransparencyBadge;
