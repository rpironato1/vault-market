import { IDashboardGateway } from '../domain/gateway';
import { DashboardData } from '../domain/entities';

// Dados estáticos determinísticos para evitar flutuação financeira em dev
const MOCK_DATA: DashboardData = {
  balances: {
    vaultCoins: 1250,
    usdtAvailable: 45.50,
    usdtLocked: 15.00
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'GAME_WIN',
      description: 'Vitória em Mines (3x)',
      amount: 15.00,
      currency: 'USDT',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 min atrás
      status: 'COMPLETED'
    },
    {
      id: 'act-2',
      type: 'GAME_LOSS',
      description: 'Sincronia falha em Crash',
      amount: -50,
      currency: 'VAULT',
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
      status: 'COMPLETED'
    },
    {
      id: 'act-3',
      type: 'NFT_PURCHASE',
      description: 'Compra: Cyber Sentinel Unit',
      amount: 89.90,
      currency: 'USDT', // Referência de valor, embora pago externamente
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 dia atrás
      status: 'COMPLETED'
    }
  ]
};

export class MockDashboardGateway implements IDashboardGateway {
  async fetchDashboardData(): Promise<DashboardData> {
    // Simula delay de rede de 800ms
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DATA;
  }
}