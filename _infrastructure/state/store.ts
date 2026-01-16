import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserAccount, Reward } from '@core/domain/entities';

interface UserState extends UserAccount {
  // Actions agora são apenas "Setters"
  setBalance: (balance: number) => void;
  setTokens: (tokens: number) => void;
  addVaultItem: (item: Reward) => void;
  
  // Helpers de UI (não alteram estado crítico)
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      balance: 1500.00, // USDT
      engagementTokens: 5000, // VaultCoins
      vaultItems: [],
      isAuthenticated: false,

      setBalance: (balance) => set({ balance }),
      setTokens: (engagementTokens) => set({ engagementTokens }),
      addVaultItem: (item) => set((state) => ({ vaultItems: [item, ...state.vaultItems] })),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    }),
    { name: 'vault-market-storage' }
  )
);