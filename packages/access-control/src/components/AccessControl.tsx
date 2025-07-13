import React from 'react';
import { Lock, ShoppingCart, AlertTriangle, CheckCircle, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { useMockContentAccess } from '../utils/mockAccessControl';

// Type-safe component wrappers
const SafeLink = Link as React.ElementType;
const LockIcon = Lock as React.ElementType;
const ShoppingCartIcon = ShoppingCart as React.ElementType;
const AlertTriangleIcon = AlertTriangle as React.ElementType;
const CheckCircleIcon = CheckCircle as React.ElementType;
const UserIcon = User as React.ElementType;

interface AccessControlProps {
  contentId: number;
  children: React.ReactNode;
  fallbackUrl?: string;
  showPurchaseOptions?: boolean;
}

/**
 * Access Control wrapper component that protects content based on ownership/purchase status
 * This component handles all access control logic and UI states
 */
export function AccessControlWrapper({
  contentId,
  children,
  fallbackUrl = '/',
  showPurchaseOptions = true
}: AccessControlProps) {
  const {
    accessResult,
    loading,
    error,
    hasAccess,
    isOwner,
    isPurchaser
  } = useMockContentAccess(contentId);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse text-ghost-purple mb-4">
            <Lock className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-400">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
              <Link href={fallbackUrl}>Return</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied state
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
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
            {accessResult?.note && (
              <div className="p-4 rounded-lg bg-ghost-dark/30 border border-ghost-purple/20">
                <h3 className="font-semibold text-white mb-2">{accessResult.note.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-ghost-neon">${accessResult.note.price}</span>
                  <Badge variant="outline" className="text-ghost-purple border-ghost-purple/50">
                    Premium
                  </Badge>
                </div>
              </div>
            )}
            
            {showPurchaseOptions && (
              <div className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-bold">
                  <Link href={`/notes/${contentId}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase to Unlock
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full border-ghost-purple/50 text-ghost-purple hover:bg-ghost-purple/10">
                  <Link href={`/notes/${contentId}`}>
                    View Note Details
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success - user has access, show access status and content
  return (
    <div className="space-y-4">
      {/* Access Status Banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-ghost-neon/10 border border-green-500/20 rounded-lg p-4">
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

      {/* Protected Content */}
      {children}
    </div>
  );
}

interface ProtectedRouteProps {
  contentId: number;
  children: React.ReactNode;
  requireAuth?: boolean;
  allowOwner?: boolean;
  allowPurchaser?: boolean;
}

/**
 * Higher-order component for protecting entire routes
 */
export function ProtectedRoute({
  contentId,
  children
}: ProtectedRouteProps) {
  return (
    <AccessControlWrapper
      contentId={contentId}
      showPurchaseOptions={true}
    >
      {children}
    </AccessControlWrapper>
  );
}

/**
 * Hook to check if current user can access content
 * Useful for conditional rendering without full protection wrapper
 */
export function useCanAccess(contentId: number) {
  const { hasAccess, isOwner, isPurchaser, loading } = useMockContentAccess(contentId);
  
  return {
    canAccess: hasAccess,
    isOwner,
    isPurchaser,
    loading
  };
}
