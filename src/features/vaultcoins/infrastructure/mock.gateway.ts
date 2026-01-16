import { IVaultCoinsGateway } from '../domain/gateway';
import { VaultCoinsData } from '../domain/entities';

const MOCK_DATA: VaultCoinsData = {
  balance: {
    current: 1250,
    totalEarned: 5000,
    totalSpent: 3750
  },
  transactions: [
    {
      id: 'tx-1',
      type: 'DEBIT',
      source: 'GAME_ENTRY',
      amount: -50,
      description: 'Entrada em Mines',
      referenceId: 'sess-123',
      timestamp: Date.now() - 1000 * 60 * 5 // 5 min atrás
    },
    {
      id: 'tx-2',
      type: 'CREDIT',
      source: 'GAME_REWARD',
      amount: 120,
      description: 'Vitória em Wheel',
      referenceId: 'sess-120',
      timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 horas atrás
    },
    {
      id: 'tx-3',
      type: 'CREDIT',
      source: 'NFT_PURCHASE',
      amount: 1000,
      description: 'Bônus: Cyber Sentinel Unit',
      referenceId: 'ord-992',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 dia atrás
    },
    {
      id: 'tx-4',
      type: 'DEBIT',
      source: 'GAME_ENTRY',
      amount: -100,
      description: 'Entrada em Crash',
      referenceId: 'sess-098',
      timestamp: Date.now() - 1000 * 60 * 60 * 25 // 1 dia e 1 hora atrás
    },
    {
      id: 'tx-5',
      type: 'CREDIT',
      source: 'AFFILIATE_BONUS',
      amount: 280,
      description: 'Indicação Confirmada',
      referenceId: 'usr-ref-01',
      timestamp: Date.now() - 1000 * 60 * 60 * 48 // 2 dias atrás
    }
  ]
};

export class MockVaultCoinsGateway implements IVaultCoinsGateway {
  async fetchWalletData(): Promise<VaultCoinsData> {
    await new Promise(resolve => setTimeout(resolve, 600)); // Latência simulada
    return MOCK_DATA;
  }
}