export interface GameSession {
  id: string;
  type: 'MINES' | 'WHEEL';
  status: 'IDLE' | 'PLAYING' | 'FINISHED';
  betAmount: number;
  multiplier: number;
}

export interface MinesEngine {
  grid: (boolean | null)[];
  mineCount: number;
  revealedCount: number;
  isGameOver: boolean;
  canCashOut: boolean;
}

export interface AffiliateStats {
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  history: { date: string; value: number }[];
}