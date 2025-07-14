// Mock data for access control testing
const sampleNotes = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    category: "Technology",
    rating: 4.8,
    reviews: 230,
    author: "Sarah Chen",
    price: 15.99,
    previewText: "A comprehensive guide to machine learning fundamentals covering supervised and unsupervised learning algorithms.",
    isPublic: false
  },
  {
    id: 2,
    title: "Creative Writing Techniques",
    category: "Writing",
    rating: 4.6,
    reviews: 150,
    author: "Marcus Johnson",
    price: 9.99,
    previewText: "Master the art of storytelling with proven techniques used by professional writers and authors.",
    isPublic: true
  }
];

export interface MockAccessCheckResult {
  hasAccess: boolean;
  accessType: 'owner' | 'purchaser' | 'none';
  reason?: string;
  note?: {
    id: number;
    title: string;
    creator_id: string;
    price: number;
    is_premium: boolean;
  };
  purchase?: {
    id: string;
    purchased_at: string;
    amount_paid: number;
  };
}

// Mock user data for testing
const mockUsers = {
  'creator-1': { id: 'creator-1', name: 'Sarah Chen', owns: [1, 2] },
  'buyer-1': { id: 'buyer-1', name: 'John Doe', purchased: [3, 4] },
  'buyer-2': { id: 'buyer-2', name: 'Jane Smith', purchased: [1] }
};

// Mock purchase data
const mockPurchases = {
  'buyer-1': [
    { note_id: 3, purchased_at: '2025-07-08T10:00:00Z', amount_paid: 19.99 },
    { note_id: 4, purchased_at: '2025-07-05T14:30:00Z', amount_paid: 24.99 }
  ],
  'buyer-2': [
    { note_id: 1, purchased_at: '2025-07-01T09:15:00Z', amount_paid: 15.99 }
  ]
};

/**
 * Mock access control function for development/testing
 * This simulates the real access control without requiring Supabase
 */
export async function checkMockContentAccess(
  contentId: number,
  userId?: string
): Promise<MockAccessCheckResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // 1. Check if authentication is required
    if (!userId) {
      return {
        hasAccess: false,
        accessType: 'none',
        reason: 'Authentication required'
      };
    }

    // 2. Get content information from sample data
    const note = sampleNotes.find(n => n.id === contentId);
    if (!note) {
      return {
        hasAccess: false,
        accessType: 'none',
        reason: 'Content not found'
      };
    }

    const noteData = {
      id: note.id,
      title: note.title,
      creator_id: note.author === 'Sarah Chen' ? 'creator-1' : 'other-creator',
      price: note.price,
      is_premium: note.price > 0
    };

    // 3. Check if content is free
    if (!noteData.is_premium || noteData.price === 0) {
      return {
        hasAccess: true,
        accessType: 'none',
        note: noteData
      };
    }

    // 4. Check if user is the creator/owner
    const user = Object.values(mockUsers).find(u => u.id === userId);
    if (user && 'owns' in user && user.owns.includes(contentId)) {
      return {
        hasAccess: true,
        accessType: 'owner',
        note: noteData
      };
    }

    // 5. Check if user has purchased the content
    if (userId in mockPurchases) {
      const userPurchases = mockPurchases[userId as keyof typeof mockPurchases];
      const purchase = userPurchases.find(p => p.note_id === contentId);
      
      if (purchase) {
        return {
          hasAccess: true,
          accessType: 'purchaser',
          note: noteData,
          purchase: {
            id: `purchase-${userId}-${contentId}`,
            purchased_at: purchase.purchased_at,
            amount_paid: purchase.amount_paid
          }
        };
      }
    }

    // 6. No access granted
    return {
      hasAccess: false,
      accessType: 'none',
      reason: 'Purchase required to access this premium content',
      note: noteData
    };

  } catch (error) {
    console.error('Mock access control check failed:', error);
    return {
      hasAccess: false,
      accessType: 'none',
      reason: 'Access verification failed'
    };
  }
}

/**
 * React hook for mock access control (development/testing)
 */
export function useMockContentAccess(contentId: number) {
  const [accessResult, setAccessResult] = React.useState<MockAccessCheckResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      setError(null);
      
      try {
        // For demo purposes, simulate different user types based on note ID
        let mockUserId: string | undefined;
        
        if (contentId === 1 || contentId === 2) {
          mockUserId = 'creator-1'; // Owner access
        } else if (contentId === 3 || contentId === 4) {
          mockUserId = 'buyer-1'; // Purchaser access
        } else if (contentId === 5) {
          mockUserId = 'buyer-2'; // No access (for testing)
        }
        
        const result = await checkMockContentAccess(contentId, mockUserId);
        setAccessResult(result);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Access check failed');
      } finally {
        setLoading(false);
      }
    }

    if (contentId) {
      checkAccess();
    }
  }, [contentId]);

  return {
    accessResult,
    loading,
    error,
    hasAccess: accessResult?.hasAccess || false,
    accessType: accessResult?.accessType || 'none',
    isOwner: accessResult?.accessType === 'owner',
    isPurchaser: accessResult?.accessType === 'purchaser'
  };
}

// Import React for the hook
import React from 'react';
