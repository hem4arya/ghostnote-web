import { TransparencyData } from '@/utils/transparency';

/**
 * Sample transparency data for testing and demonstration
 * This simulates the response from the Edge Function
 */
export const sampleTransparencyData: Record<string, TransparencyData> = {
  // Original content - not a clone
  '1': {
    note_id: 1,
    is_clone: false,
    originality_score: 95,
    originality_level: 'Original',
    similarity_score: undefined,
    original_note: undefined,
    transparency_badge: {
      text: '',
      severity: 'none',
      show_source_link: false,
    },
    buyer_message: {
      title: 'Original Content',
      description: 'This note contains original content created from scratch.',
      recommendation: 'High confidence purchase recommendation.',
    },
  },

  // Modified content
  '2': {
    note_id: 2,
    is_clone: true,
    originality_score: 65,
    originality_level: 'Modified',
    similarity_score: 35,
    original_note: {
      id: 15,
      title: 'Advanced React Patterns - Original Guide',
      creator_id: 'user123',
      creator_username: 'reactexpert',
      creator_is_public: true,
      created_at: '2024-12-15T10:30:00Z',
    },
    transparency_badge: {
      text: '35% Match – View Source',
      severity: 'low',
      show_source_link: true,
    },
    buyer_message: {
      title: 'Modified Content',
      description: 'This note significantly builds upon existing material with substantial modifications and additions.',
      recommendation: 'Good value with additional insights beyond the original.',
    },
  },

  // Heavily inspired content
  '3': {
    note_id: 3,
    is_clone: true,
    originality_score: 40,
    originality_level: 'Heavily Inspired',
    similarity_score: 60,
    original_note: {
      id: 28,
      title: 'JavaScript Best Practices',
      creator_id: 'user456',
      creator_username: 'jsmaster',
      creator_is_public: true,
      created_at: '2024-11-20T14:15:00Z',
    },
    transparency_badge: {
      text: '60% Match – View Source',
      severity: 'medium',
      show_source_link: true,
    },
    buyer_message: {
      title: 'Heavily Inspired',
      description: 'This note draws heavily from existing sources with some modifications.',
      recommendation: 'Consider checking the original source before purchasing.',
    },
  },

  // Clone content
  '4': {
    note_id: 4,
    is_clone: true,
    originality_score: 15,
    originality_level: 'Clone',
    similarity_score: 85,
    original_note: {
      id: 42,
      title: 'Machine Learning Fundamentals',
      creator_id: 'user789',
      creator_username: 'mlpro',
      creator_is_public: true,
      created_at: '2024-10-10T09:00:00Z',
    },
    transparency_badge: {
      text: '85% Match – View Source',
      severity: 'high',
      show_source_link: true,
    },
    buyer_message: {
      title: 'High Similarity Detected',
      description: 'This note is very similar to existing material with minimal changes.',
      recommendation: 'We recommend checking the original source which may offer better value.',
    },
  },

  // Anonymous original creator
  '5': {
    note_id: 5,
    is_clone: true,
    originality_score: 50,
    originality_level: 'Heavily Inspired',
    similarity_score: 70,
    original_note: {
      id: 67,
      title: 'Data Structures Deep Dive',
      creator_id: 'anonymous_user',
      creator_username: undefined,
      creator_is_public: false,
      created_at: '2024-09-05T16:45:00Z',
    },
    transparency_badge: {
      text: '70% Match – Source Private',
      severity: 'medium',
      show_source_link: false,
    },
    buyer_message: {
      title: 'Heavily Inspired',
      description: 'This note draws heavily from existing sources. The original creator prefers to remain private.',
      recommendation: 'Consider the similarity level when making your purchase decision.',
    },
  },
};

/**
 * Mock function to simulate the transparency API call
 * In a real app, this would be replaced by the actual API call
 */
export function getMockTransparencyData(noteId: string): TransparencyData | null {
  return sampleTransparencyData[noteId] || null;
}

/**
 * Simulate network delay for realistic testing
 */
export function mockApiDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
