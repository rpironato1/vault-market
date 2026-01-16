import { IWithdrawalsGateway } from '../domain/gateway';
import { WithdrawalData } from '../domain/entities';

const MOCK_DATA: WithdrawalData = {
  availableBalance: 150.50,
  limits: {
    dailyLimit: 5000.00,
    dailyUsed: 0.00,
    minWithdrawal: 10.00,
    maxWithdrawal: 2000.00
  },
  history: [
    {
      id: 'wd-1',
      amount: 45.00,
      walletAddress: '0x71C...9A21',
      network: 'POLYGON',
      status: 'COMPLETED',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 dias atrás
      txHash: '0xabc...123'
    },
    {
      id: 'wd-2',
      amount: 120.00,
      walletAddress: '0x71C...9A21',
      network: 'POLYGON',
      status: 'PENDING_REVIEW',
      timestamp: Date.now() - 1000 * 60 * 30 // 30 min atrás
    }
  ]
};

export class MockWithdrawalsGateway implements IWithdrawalsGateway {
  async fetchWithdrawalData(): Promise<WithdrawalData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DATA;
  }

  async requestWithdrawal(amount: number, address: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (amount > MOCK_DATA.availableBalance) {
      throw new Error("Saldo insuficiente.");
    }
    
    // Simulação de sucesso (não altera o mock estático, mas a UI reagirá ao sucesso da Promise)
    console.log(`[Mock] Saque solicitado: ${amount} USDT para ${address}`);
  }
}