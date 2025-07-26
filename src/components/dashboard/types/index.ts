export interface Note {
  id: string | number;
  title: string;
  content?: string;
  user_id?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  embedding?: number[];
  previewText: string;
  category: string;
  price: number;
  tags?: string[];
  author: string;
  rating: number;
  reviews: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime?: number;
}

export interface RecommendationResult extends Note {
  score?: number;
  source: 'behavioral' | 'collaborative' | 'popular';
}
