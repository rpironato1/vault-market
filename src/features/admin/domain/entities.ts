export interface AdminStats {
  totalUsers: number;
  totalVaultCoinsInCirculation: number;
  totalUsdtPaid: number;
  pendingWithdrawalsCount: number;
  flaggedAccountsCount: number;
}

export interface PendingAction {
  id: string;
  type: 'WITHDRAWAL_REVIEW' | 'KYC_CHECK' | 'SUSPICIOUS_ACTIVITY';
  user: string;
  details: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}

export interface RiskAlert {
  id: string;
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
  timestamp: number;
  metadata?: Record<string, string>;
}

export interface AdminWithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  walletAddress: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  riskScore: number; // 0-100
  createdAt: number;
  txHash?: string;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'FLAGGED';
  joinedAt: number;
  balanceUsdt: number;
  balanceVaultCoins: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastIp: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  pendingActions: PendingAction[];
  recentAlerts: RiskAlert[];
}