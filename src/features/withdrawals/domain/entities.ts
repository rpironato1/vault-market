export type WithdrawalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export interface WithdrawalRequest {
  id: string;
  amount: number;
  walletAddress: string;
  network: 'POLYGON';
  status: WithdrawalStatus;
  timestamp: number;
  txHash?: string;
  rejectionReason?: string;
}

export interface WithdrawalLimits {
  dailyLimit: number;
  dailyUsed: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

export interface WithdrawalData {
  availableBalance: number; // Saldo disponível para saque (USDT)
  limits: WithdrawalLimits;
  history: WithdrawalRequest[];
}