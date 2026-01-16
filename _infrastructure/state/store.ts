import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserAccount, Reward } from '@core/domain/entities';

interface UserState extends UserAccount {
  addReward: (reward: Reward) => void;
  updateBalance: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      balance: 1500.00,
      engagementTokens: 5000,
      vaultItems: [],
      
      addReward: (reward) => set((state: UserState) => ({
        vaultItems: [reward, ...state.vaultItems],
        engagementTokens: state.engagementTokens + 150 // Recompensa por engajamento
      })),

      updateBalance: (amount) => set((state: UserState) => ({
        balance: state.balance + amount
      })),

      spendTokens: (amount) => {
        const { engagementTokens } = get();
        if (engagementTokens >= amount) {
          set((state: UserState) => ({ engagementTokens: state.engagementTokens - amount }));
          return true;
        }
        return false;
      }
    }),
    { name: 'vault-market-storage' }
  )
);