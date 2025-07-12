export interface TransparencyData {
  note_id: number;
  is_clone: boolean;
  originality_score: number;
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number;
  original_note?: {
    id: number;
    title: string;
    creator_id: string;
    creator_username?: string;
    creator_is_public: boolean;
    created_at: string;
  };
  transparency_badge: {
    text: string;
    severity: 'none' | 'low' | 'medium' | 'high';
    show_source_link: boolean;
  };
  buyer_message: {
    title: string;
    description: string;
    recommendation: string;
  };
}

export interface TransparencyBadgeData {
  text: string;
  severity: 'none' | 'low' | 'medium' | 'high';
  show_source_link: boolean;
}

export interface OriginalNote {
  id: number;
  title: string;
  creator_id: string;
  creator_username?: string;
  creator_is_public: boolean;
  created_at: string;
}

export interface BuyerMessage {
  title: string;
  description: string;
  recommendation: string;
}

export interface CloneTransparencyBadgeProps {
  is_clone: boolean;
  originality_score: number;
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number;
  original_note?: OriginalNote;
  transparency_badge: TransparencyBadgeData;
  buyer_message: BuyerMessage;
  className?: string;
  showDetailedInfo?: boolean;
}

export interface CloneTransparencyWrapperProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}
