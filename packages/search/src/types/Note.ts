export interface Note {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  category: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished?: boolean;
  metadata?: {
    wordCount?: number;
    readTime?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}
