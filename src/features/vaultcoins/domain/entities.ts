export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionSource = 'NFT_PURCHASE' | 'GAME_ENTRY' | 'GAME_REWARD' | 'AFFILIATE_BONUS' | 'SYSTEM_ADJUSTMENT';

export interface VaultCoinTransaction {
  id: string;
  type: TransactionType;
  source: TransactionSource;
  amount: number;
  description: string;
  referenceId?: string; // ID do pedido, sessão de jogo, etc.
  timestamp: number;
}

export interface VaultCoinBalance {
  current: number;
  totalEarned: number;
  totalSpent: number;
}

export interface VaultCoinsData {
  balance: VaultCoinBalance;
  transactions: VaultCoinTransaction[];
}