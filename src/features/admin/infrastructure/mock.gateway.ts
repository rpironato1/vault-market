import { IAdminGateway } from '../domain/gateway';
import { AdminDashboardData, AdminWithdrawalRequest, AdminUserSummary } from '../domain/entities';

// Mock Data Stores
const MOCK_DASHBOARD: AdminDashboardData = {
  stats: {
    totalUsers: 12450,
    totalVaultCoinsInCirculation: 8500000,
    totalUsdtPaid: 142500.00,
    pendingWithdrawalsCount: 12,
    flaggedAccountsCount: 3
  },
  pendingActions: [
    {
      id: 'act-1',
      type: 'WITHDRAWAL_REVIEW',
      user: 'neo@matrix.com',
      details: 'Saque de $450.00 (Polygon)',
      riskScore: 'MEDIUM',
      timestamp: Date.now() - 1000 * 60 * 45 
    },
    {
      id: 'act-2',
      type: 'SUSPICIOUS_ACTIVITY',
      user: 'cypher@matrix.com',
      details: 'Múltiplas contas detectadas (IP)',
      riskScore: 'CRITICAL',
      timestamp: Date.now() - 1000 * 60 * 10
    }
  ],
  recentAlerts: [
    {
      id: 'alt-1',
      severity: 'CRITICAL',
      message: 'Hot Wallet com saldo baixo (< $5k USDT)',
      timestamp: Date.now()
    },
    {
      id: 'alt-2',
      severity: 'WARNING',
      message: 'Spike de novos cadastros (+400% em 1h)',
      timestamp: Date.now() - 1000 * 60 * 30
    }
  ]
};

const MOCK_WITHDRAWALS: AdminWithdrawalRequest[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `wd-${1000 + i}`,
  userId: `usr-${i}`,
  userEmail: `operator${i}@vault.net`,
  amount: Math.floor(Math.random() * 5000) + 50,
  walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
  status: i < 5 ? 'PENDING' : i < 12 ? 'APPROVED' : 'REJECTED',
  riskScore: Math.floor(Math.random() * 100),
  createdAt: Date.now() - (Math.random() * 1000 * 60 * 60 * 24 * 3),
  txHash: i >= 5 && i < 12 ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined
}));

const MOCK_USERS: AdminUserSummary[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `usr-${i}`,
  name: `Operator ${i}`,
  email: `op${i}@vault.net`,
  status: i === 3 ? 'FLAGGED' : i === 7 ? 'SUSPENDED' : 'ACTIVE',
  joinedAt: Date.now() - (Math.random() * 1000 * 60 * 60 * 24 * 30),
  balanceUsdt: Math.random() * 1000,
  balanceVaultCoins: Math.floor(Math.random() * 50000),
  riskLevel: i === 3 ? 'HIGH' : i % 5 === 0 ? 'MEDIUM' : 'LOW',
  lastIp: `192.168.1.${i}`
}));

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAdminGateway implements IAdminGateway {
  async fetchDashboardData(): Promise<AdminDashboardData> {
    await delay(600);
    return MOCK_DASHBOARD;
  }

  async fetchWithdrawals(): Promise<AdminWithdrawalRequest[]> {
    await delay(800);
    return MOCK_WITHDRAWALS.sort((a, b) => b.createdAt - a.createdAt);
  }

  async fetchUsers(): Promise<AdminUserSummary[]> {
    await delay(700);
    return MOCK_USERS;
  }

  async approveAction(actionId: string): Promise<void> {
    await delay(500);
    console.log(`[Admin] Action ${actionId} approved`);
  }

  async rejectAction(actionId: string, reason: string): Promise<void> {
    await delay(500);
    console.log(`[Admin] Action ${actionId} rejected: ${reason}`);
  }

  async processWithdrawal(id: string, action: 'APPROVE' | 'REJECT'): Promise<void> {
    await delay(1000);
    console.log(`[Admin] Withdrawal ${id} processed: ${action}`);
  }

  async updateUserStatus(userId: string, status: AdminUserSummary['status']): Promise<void> {
    await delay(800);
    console.log(`[Admin] User ${userId} status updated to ${status}`);
  }
}