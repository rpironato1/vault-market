export interface DashboardBalances {
  vaultCoins: number;
  usdtAvailable: number;
  usdtLocked: number;
}

export type ActivityType = 'NFT_PURCHASE' | 'GAME_WIN' | 'GAME_LOSS' | 'WITHDRAWAL';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  amount: number;
  currency: 'VAULT' | 'USDT';
  timestamp: number; // Unix timestamp
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface DashboardData {
  balances: DashboardBalances;
  recentActivity: ActivityItem[];
}