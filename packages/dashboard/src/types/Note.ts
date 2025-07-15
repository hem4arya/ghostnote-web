// Local Note types for dashboard package

export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  views: number;
  purchases: number;
  created_at: string;
  updated_at?: string;
  is_free?: boolean;
  snippet?: string;
  purchase_count?: number;
  view_count?: number;
  previewText?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublished?: boolean;
  metadata?: {
    wordCount?: number;
    readTime?: number;
    difficulty?: "beginner" | "intermediate" | "advanced";
  };
}
