export interface Note {
  id: string;
  title: string;
  content: string;
  previewText: string;
  category: string;
  author: string;
  rating?: number;
  reviews?: number;
  price?: number;
  description?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublished?: boolean;
  metadata?: {
    wordCount?: number;
    readTime?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface RankedNote extends Note {
  content_similarity?: number;
  popularity_score?: number;
  recency_score?: number;
  creator_score?: number;
  personalization_score?: number;
  final_score?: number;
  purchase_count?: number;
  view_count?: number;
  is_verified_creator?: boolean;
  creator_trust_score?: number;
}
