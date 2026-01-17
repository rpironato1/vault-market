import { 
  Product, 
  Order, 
  VaultCoinTransactionSchema, 
  WithdrawalRequest 
} from '../../../../packages/contracts';
import { z } from 'zod';

// Reutilizando tipos do contrato para agilidade, 
// mas em um sistema puro DDD, teríamos entidades de domínio separadas.
type VaultCoinTransaction = z.infer<typeof VaultCoinTransactionSchema>;

export interface ICatalogRepository {
  findAll(page: number, limit: number): Promise<{ items: Product[], total: number }>;
  findById(id: string): Promise<Product | null>;
  // Métodos de admin
  create(product: Product): Promise<Product>;
  updateStock(id: string, quantity: number): Promise<void>;
}

export interface IOrdersRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  updateStatus(id: string, status: Order['status'], txHash?: string): Promise<void>;
}

export interface IVaultCoinsRepository {
  getBalance(userId: string): Promise<number>;
  addTransaction(userId: string, transaction: VaultCoinTransaction): Promise<void>;
  getLedger(userId: string, limit: number, offset: number): Promise<VaultCoinTransaction[]>;
}

export interface IRewardsRepository {
  createWithdrawal(request: WithdrawalRequest): Promise<WithdrawalRequest>;
  getWithdrawalsByStatus(status: WithdrawalRequest['status']): Promise<WithdrawalRequest[]>;
  updateWithdrawalStatus(id: string, status: WithdrawalRequest['status'], txHash?: string): Promise<void>;
  getAvailableBalance(userId: string): Promise<number>;
}