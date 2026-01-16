export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'AFFILIATE' | 'ADMIN';
  joinedAt: number;
}

export interface LinkedWallet {
  id: string;
  address: string;
  label: string; // Ex: "Metamask Principal"
  network: 'POLYGON';
  isDefault: boolean;
  status: 'VERIFIED' | 'UNVERIFIED';
  addedAt: number;
}

export interface SettingsData {
  profile: UserProfile;
  wallets: LinkedWallet[];
}