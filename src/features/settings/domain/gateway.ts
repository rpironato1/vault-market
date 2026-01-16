import { SettingsData, LinkedWallet } from './entities';

export interface ISettingsGateway {
  fetchSettings(): Promise<SettingsData>;
  addWallet(address: string, label: string): Promise<LinkedWallet>;
  removeWallet(walletId: string): Promise<void>;
  setDefaultWallet(walletId: string): Promise<void>;
}