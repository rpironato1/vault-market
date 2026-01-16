import { ISettingsGateway } from '../domain/gateway';
import { SettingsData, LinkedWallet } from '../domain/entities';

let MOCK_DB: SettingsData = {
  profile: {
    id: 'usr-123',
    name: 'Neo Anderson',
    email: 'neo@matrix.com',
    role: 'USER',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 30 // 30 dias atrás
  },
  wallets: [
    {
      id: 'w-1',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d89A21',
      label: 'Cofre Principal',
      network: 'POLYGON',
      isDefault: true,
      status: 'VERIFIED',
      addedAt: Date.now() - 1000 * 60 * 60 * 24 * 10
    }
  ]
};

export class MockSettingsGateway implements ISettingsGateway {
  async fetchSettings(): Promise<SettingsData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...MOCK_DB };
  }

  async addWallet(address: string, label: string): Promise<LinkedWallet> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_DB.wallets.some(w => w.address === address)) {
      throw new Error("Carteira já vinculada.");
    }

    const newWallet: LinkedWallet = {
      id: `w-${Date.now()}`,
      address,
      label,
      network: 'POLYGON',
      isDefault: MOCK_DB.wallets.length === 0,
      status: 'VERIFIED', // Em prod, seria UNVERIFIED até assinar mensagem
      addedAt: Date.now()
    };

    MOCK_DB.wallets = [...MOCK_DB.wallets, newWallet];
    return newWallet;
  }

  async removeWallet(walletId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_DB.wallets = MOCK_DB.wallets.filter(w => w.id !== walletId);
  }

  async setDefaultWallet(walletId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    MOCK_DB.wallets = MOCK_DB.wallets.map(w => ({
      ...w,
      isDefault: w.id === walletId
    }));
  }
}