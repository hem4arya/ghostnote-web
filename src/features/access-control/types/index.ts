export interface AccessCheckResult {
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

export interface AccessControlOptions {
  requireAuth?: boolean;
  allowOwner?: boolean;
  allowPurchaser?: boolean;
  contentType?: 'note' | 'course' | 'template' | 'premium_content';
}
