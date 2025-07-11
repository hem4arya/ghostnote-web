'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, ShoppingCart, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useContentAccess } from '@/features/access-control/hooks/useContentAccess';
import { sampleNotes } from '@/features/notes/data/sampleNotes';
import { Note } from '@/features/notes/components/NoteCard';

interface ReaderPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ReaderPage = ({ params }: ReaderPageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const router = useRouter();

  // Resolve the params promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Get note data (in production, this would come from your API)
  useEffect(() => {
    if (!resolvedParams) return;
    
    const foundNote = sampleNotes.find((n) => n.id === parseInt(resolvedParams.id));
    setNote(foundNote || null);
  }, [resolvedParams]);

  // Use access control hook
  const {
    accessResult,
    loading: accessLoading,
    error: accessError,
    hasAccess,
    isOwner,
    isPurchaser
  } = useContentAccess(
    resolvedParams ? parseInt(resolvedParams.id) : 0,
    {
      requireAuth: true,
      allowOwner: true,
      allowPurchaser: true
    }
  );

  // Loading state
  if (!resolvedParams || accessLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-ghost-purple mb-4">
              <Lock className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-400">Verifying access permissions...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (accessError) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md bg-black/20 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Access Verification Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                We couldn&apos;t verify your access to this content. Please try again.
              </p>
              <Button asChild className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Access denied state
  if (!hasAccess) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-lg bg-black/20 border-ghost-purple/20 backdrop-blur-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-ghost-purple/10">
                <Lock className="h-8 w-8 text-ghost-purple" />
              </div>
              <CardTitle className="text-2xl text-white">Premium Content</CardTitle>
              <CardDescription className="text-gray-400">
                {accessResult?.reason || 'This content requires purchase to access'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {note && (
                <div className="p-4 rounded-lg bg-ghost-dark/30 border border-ghost-purple/20">
                  <h3 className="font-semibold text-white mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{note.previewText}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-ghost-neon">${note.price}</span>
                    <Badge variant="outline" className="text-ghost-purple border-ghost-purple/50">
                      Premium
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-bold">
                  <Link href={`/notes/${resolvedParams.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase to Unlock
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full border-ghost-purple/50 text-ghost-purple hover:bg-ghost-purple/10">
                  <Link href={`/notes/${resolvedParams.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    View Note Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Note not found
  if (!note) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md bg-black/20 border-ghost-purple/20">
            <CardHeader>
              <CardTitle className="text-white">Note Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                The note you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button asChild className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Success - user has access, show the content
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black text-gray-300">
      <Navbar />
      
      {/* Access Status Banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-ghost-neon/10 border-b border-green-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">
                {isOwner ? 'Owner Access' : 'Premium Content Unlocked'}
              </span>
              {isPurchaser && accessResult?.purchase && (
                <Badge variant="outline" className="text-green-400 border-green-400/50">
                  Purchased {new Date(accessResult.purchase.purchased_at).toLocaleDateString()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {isOwner ? 'Your Content' : 'Licensed Access'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.back()}
                className="border-ghost-purple/50 text-ghost-purple hover:bg-ghost-purple/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-ghost-neon border-ghost-neon/50">
                  Reader Mode
                </Badge>
                {isOwner && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                    Owner
                  </Badge>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {note.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span>by <span className="text-ghost-purple font-medium">{note.author}</span></span>
              <span className="text-sm">Premium Content</span>
              <Badge variant="outline" className="text-ghost-neon border-ghost-neon/50">
                {note.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none prose-lg">
            <div className="bg-black/20 rounded-xl border border-ghost-purple/20 p-8 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-ghost-purple/20 pb-4">
                Full Premium Content
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  {note.previewText}
                </p>
                
                <p>
                  Welcome to the full premium content! This is where the complete, detailed information would be displayed. 
                  Only users who have purchased this note or are the original creator can see this content.
                </p>
                
                <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                  Advanced Techniques
                </h3>
                
                <p>
                  This section contains advanced insights and techniques that provide significant value beyond the preview. 
                  The content here represents the core value proposition that users have purchased.
                </p>
                
                <div className="bg-ghost-dark/30 border border-ghost-purple/20 rounded-lg p-6 my-8">
                  <h4 className="text-lg font-semibold text-ghost-neon mb-3">💡 Key Insights</h4>
                  <ul className="space-y-2">
                    <li>• Exclusive methodology and frameworks</li>
                    <li>• Step-by-step implementation guides</li>
                    <li>• Real-world examples and case studies</li>
                    <li>• Best practices from industry experts</li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                  Implementation Guide
                </h3>
                
                <p>
                  Here&apos;s where detailed implementation instructions would be provided, giving users actionable steps 
                  to apply the knowledge they&apos;ve purchased. This content justifies the premium price point.
                </p>
                
                <div className="bg-gradient-to-r from-ghost-purple/10 to-ghost-neon/10 border border-ghost-purple/20 rounded-lg p-6 mt-8">
                  <p className="text-center text-ghost-neon font-medium">
                    🎉 You have full access to this premium content!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline" className="border-ghost-purple/50 text-ghost-purple hover:bg-ghost-purple/10">
              <Link href={`/notes/${resolvedParams.id}`}>
                View Note Page
              </Link>
            </Button>
            
            {isOwner && (
              <Button asChild variant="outline" className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10">
                <Link href={`/notes/${resolvedParams.id}/edit`}>
                  Edit Note
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReaderPage;
