export interface ApiResult<T> {
  success: boolean;
  data: T;
  error?: string;
}

// --- ECONOMY ---
export interface UserBalance {
  vaultCoins: number;
  usdt: number;
  items: any[];
}

// --- MINES ---
export interface MinesStartResponse {
  gameId: string;
  wager: number;
  balanceAfterWager: number;
}

export interface MinesRevealResponse {
  status: 'SAFE' | 'MINE';
  grid: ('IDLE' | 'SAFE' | 'MINE')[]; // O cliente só recebe o estado atual revelado
  currentMultiplier: number;
  potentialReward: number;
  isGameOver: boolean;
}

export interface MinesCashoutResponse {
  totalPayout: number;
  newBalance: number;
}

// --- WHEEL ---
export interface WheelSpinResponse {
  winningIndex: number; // O backend decide onde para
  rewardLabel: string;
  rewardValue: number;
  isJackpot: boolean;
  newBalance: number;
}

// --- MARKETPLACE ---
export interface BoxPurchaseResponse {
  reward: {
    id: string;
    name: string;
    value: number;
    rarity: string;
  };
  newBalance: number; // Saldo de coins atualizado (se aplicável para compra com coins) ou usdt
}