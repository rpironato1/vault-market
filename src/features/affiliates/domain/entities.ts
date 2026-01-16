export interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number; // Usuários que fizeram ao menos uma compra
  totalEarnings: number; // Em USDT ou VaultCoins, dependendo da regra
  conversionRate: number;
  currentTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
}

export interface Referral {
  id: string;
  name: string; // Nome ofuscado para privacidade (ex: "Neo A.")
  joinedAt: number;
  status: 'ACTIVE' | 'INACTIVE';
  earningsGenerated: number;
}

export interface AffiliateData {
  stats: AffiliateStats;
  referralCode: string;
  referralLink: string;
  recentReferrals: Referral[];
}