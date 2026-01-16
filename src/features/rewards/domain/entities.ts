export type RewardStatus = 'EARNED' | 'LOCKED' | 'AVAILABLE' | 'PAID' | 'REJECTED';
export type RewardSource = 'GAME_WIN' | 'AFFILIATE_COMMISSION' | 'SYSTEM_ADJUSTMENT';

export interface RewardTransaction {
  id: string;
  source: RewardSource;
  description: string;
  amount: number;
  status: RewardStatus;
  referenceId?: string;
  timestamp: number;
  unlockDate?: number; // Data estimada para desbloqueio se LOCKED
}

export interface RewardBalance {
  totalEarned: number;
  locked: number;
  available: number;
  paid: number;
}

export interface RewardsData {
  balance: RewardBalance;
  transactions: RewardTransaction[];
}