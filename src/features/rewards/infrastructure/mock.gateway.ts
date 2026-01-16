import { IRewardsGateway } from '../domain/gateway';
import { RewardsData } from '../domain/entities';

const MOCK_DATA: RewardsData = {
  balance: {
    totalEarned: 1250.50,
    locked: 450.00,
    available: 150.50,
    paid: 650.00
  },
  transactions: [
    {
      id: 'rw-1',
      source: 'GAME_WIN',
      description: 'Vitória em Mines (Multiplier 5x)',
      amount: 50.00,
      status: 'AVAILABLE',
      referenceId: 'sess-882',
      timestamp: Date.now() - 1000 * 60 * 30 // 30 min atrás
    },
    {
      id: 'rw-2',
      source: 'AFFILIATE_COMMISSION',
      description: 'Comissão de Nível 1',
      amount: 15.50,
      status: 'AVAILABLE',
      referenceId: 'usr-999',
      timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 horas atrás
    },
    {
      id: 'rw-3',
      source: 'GAME_WIN',
      description: 'Vitória em Crash (Jackpot)',
      amount: 450.00,
      status: 'LOCKED',
      referenceId: 'sess-771',
      timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 horas atrás
      unlockDate: Date.now() + 1000 * 60 * 60 * 24 // Desbloqueia em 24h
    },
    {
      id: 'rw-4',
      source: 'GAME_WIN',
      description: 'Vitória em Wheel',
      amount: 85.00,
      status: 'PAID',
      referenceId: 'sess-552',
      timestamp: Date.now() - 1000 * 60 * 60 * 48 // 2 dias atrás
    },
    {
      id: 'rw-5',
      source: 'SYSTEM_ADJUSTMENT',
      description: 'Bônus de Campanha',
      amount: 565.00,
      status: 'PAID',
      referenceId: 'camp-01',
      timestamp: Date.now() - 1000 * 60 * 60 * 72 // 3 dias atrás
    }
  ]
};

export class MockRewardsGateway implements IRewardsGateway {
  async fetchRewardsData(): Promise<RewardsData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DATA;
  }
}