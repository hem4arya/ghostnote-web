'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, User, Flag, Volume2 } from "lucide-react";
import { Button } from '@shared/ui/components/button';
import { Progress } from '@shared/ui/components/progress';
import { Card } from '@shared/ui/components/card';
import { Badge } from "@shared/ui/components/badge";
import { Separator } from "@shared/ui/components/separator";
import { toast } from "sonner";
import '../reader.css';

// Mock purchased note data
const purchasedNote = {
  id: "1",
  title: "Advanced React Patterns & Performance Optimization",
  author: "Sarah Chen",
  authorHandle: "@sarahchen_dev",
  purchaseDate: "2025-07-10",
  buyerHandle: "@ghost_8xk92",
  pdfUrl: "/sample-note.pdf", // In real app, this would be a secure URL
  hasAudioIntro: true,
  audioUrl: "/intro-audio.mp3",
  isFavorited: false,
  highlights: [] as Array<{ id: string; text: string; page: number; position: number }>
};

const ReaderView = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  // In a real app, fetch the note data using the ID
  console.log(`Viewing note with ID: ${id}`);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFavorited, setIsFavorited] = useState(purchasedNote.isFavorited);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Mock scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out "${purchasedNote.title}" by ${purchasedNote.author} on GhostNote`);
    toast("Note metadata copied to clipboard");
  };

  const handleReportClone = () => {
    toast("Report submitted. We'll investigate and notify the author.");
  };

  const handlePlayAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // In real app, this would control audio playback
    toast(isAudioPlaying ? "Audio paused" : "Playing intro audio");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b cyber-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              GhostNote
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit Reader
            </Button>
          </div>
        </div>
      </div>

      {/* Note Metadata */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              {purchasedNote.title}
            </h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>by <span className="text-foreground font-medium">{purchasedNote.authorHandle}</span></span>
              <Separator orientation="vertical" className="h-4" />
              <span>Purchased on {new Date(purchasedNote.purchaseDate).toLocaleDateString()}</span>
            </div>

            {purchasedNote.hasAudioIntro && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayAudio}
                  className="gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  {isAudioPlaying ? "Pause" : "Play"} Intro
                </Button>
                <span className="text-sm text-muted-foreground">Author&apos;s introduction audio</span>
              </div>
            )}
          </div>

          {/* PDF Viewer */}
          <Card className="note-card mb-8">
            <div className="relative">
              {/* Watermark */}
              <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs text-muted-foreground border border-border/50">
                {purchasedNote.buyerHandle} • {new Date(purchasedNote.purchaseDate).toLocaleDateString()}
              </div>
              
              {/* PDF Iframe - In real app, use react-pdf with restrictions */}
              <div className="w-full h-[800px] bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center">
                <div className="text-center space-y-4 p-4">
                  <div className="text-6xl">📄</div>
                  <div className="text-lg font-medium">PDF Viewer</div>
                  <div className="text-sm text-muted-foreground max-w-md">
                    In a real implementation, this would be a secure PDF viewer using react-pdf 
                    with download, print, and copy protections enabled.
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    Viewing: {purchasedNote.title}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button
              variant="outline"
              onClick={handleFavorite}
              className={`gap-2 ${isFavorited ? 'text-red-500 border-red-500/50' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              variant="outline"
              onClick={() => toast("Author profile feature coming soon")}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Author
            </Button>

            <Button
              variant="outline"
              onClick={handleReportClone}
              className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>

          {/* Reading Stats */}
          <Card className="note-card p-6">
            <h3 className="font-semibold mb-4">Reading Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>{Math.round(scrollProgress)}%</span>
              </div>
              <Progress value={scrollProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Highlights: 0</span>
                <span>Reading time: ~20 min</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-muted/30 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ReaderView;
