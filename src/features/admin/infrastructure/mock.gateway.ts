import { IAdminGateway } from '../domain/gateway';
import { AdminDashboardData } from '../domain/entities';

const MOCK_DATA: AdminDashboardData = {
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
      timestamp: Date.now() - 1000 * 60 * 45 // 45 min atrás
    },
    {
      id: 'act-2',
      type: 'WITHDRAWAL_REVIEW',
      user: 'trinity@matrix.com',
      details: 'Saque de $2,500.00 (Polygon)',
      riskScore: 'HIGH',
      timestamp: Date.now() - 1000 * 60 * 120 // 2 horas atrás
    },
    {
      id: 'act-3',
      type: 'SUSPICIOUS_ACTIVITY',
      user: 'cypher@matrix.com',
      details: 'Múltiplas contas detectadas (IP)',
      riskScore: 'CRITICAL',
      timestamp: Date.now() - 1000 * 60 * 10 // 10 min atrás
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

export class MockAdminGateway implements IAdminGateway {
  async fetchDashboardData(): Promise<AdminDashboardData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DATA;
  }

  async approveAction(actionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[Admin] Ação aprovada: ${actionId}`);
  }

  async rejectAction(actionId: string, reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[Admin] Ação rejeitada: ${actionId} - Motivo: ${reason}`);
  }
}