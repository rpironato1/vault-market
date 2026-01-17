import { http } from '@infra/http/apiClient';
import type { 
  CatalogResponse, 
  CreateOrderDTO, 
  Order, 
  UserBalance, 
  GameSession, 
  WithdrawalRequest 
} from '@contracts/index';

// Este arquivo serve como um SDK interno para o frontend,
// garantindo que todas as chamadas respeitem os contratos Zod definidos.

export const api = {
  auth: {
    // login e register seriam implementados aqui
  },
  catalog: {
    list: () => http.get<CatalogResponse>('/catalog'),
    get: (id: string) => http.get<any>(`/catalog/${id}`), // Tipar corretamente Product
  },
  orders: {
    create: (data: CreateOrderDTO) => http.post<Order>('/orders', data),
  },
  wallet: {
    balance: () => http.get<UserBalance>('/me/balances'),
  },
  games: {
    session: (id: string) => http.get<GameSession>(`/games/sessions/${id}`),
  },
  rewards: {
    withdraw: (amount: number, address: string) => 
      http.post<WithdrawalRequest>('/withdrawals', { amount, walletAddress: address }),
  }
};