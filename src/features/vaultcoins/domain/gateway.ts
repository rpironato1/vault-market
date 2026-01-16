import { VaultCoinsData } from './entities';

export interface IVaultCoinsGateway {
  fetchWalletData(): Promise<VaultCoinsData>;
}