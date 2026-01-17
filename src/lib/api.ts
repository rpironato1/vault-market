import { http } from '@infra/http/apiClient';
import type { 
  CatalogResponse, 
  CreateOrderDTO, 
  Order, 
  UserBalance, 
  GameSession, 
  WithdrawalRequest,
  AdminDashboardResponse,
  VaultCoinsWalletResponse,
  AffiliateDataResponse
} from '@contracts/index';

// Este SDK atua como uma ponte tipada.
// Se o backend mudar o contrato, o frontend quebra no build time (desejável).

export const api = {
  auth: {
    // login e register implementados no módulo auth
  },
  catalog: {
    list: () => http.get<CatalogResponse>('/catalog'),
    get: (id: string) => http.get<any>(`/catalog/${id}`),
  },
  orders: {
    create: (data: CreateOrderDTO) => http.post<Order>('/orders', data),
  },
  wallet: {
    balance: () => http.get<UserBalance>('/me/balances'),
    vaultCoins: () => http.get<VaultCoinsWalletResponse>('/me/vaultcoins'),
  },
  games: {
    session: (id: string) => http.get<GameSession>(`/games/sessions/${id}`),
  },
  rewards: {
    withdraw: (amount: number, address: string) => 
      http.post<WithdrawalRequest>('/withdrawals', { amount, walletAddress: address }),
  },
  admin: {
    dashboard: () => http.get<AdminDashboardResponse>('/admin/dashboard'),
    // Outros métodos admin...
  },
  affiliates: {
    data: () => http.get<AffiliateDataResponse>('/affiliates/me'),
  }
};