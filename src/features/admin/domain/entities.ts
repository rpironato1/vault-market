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
  details: string; // Ex: "Saque de $500.00 para 0x..."
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}

export interface RiskAlert {
  id: string;
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  pendingActions: PendingAction[];
  recentAlerts: RiskAlert[];
}