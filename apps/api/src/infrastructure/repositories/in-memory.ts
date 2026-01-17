import { 
  ICatalogRepository, 
  IOrdersRepository, 
  IVaultCoinsRepository, 
  IRewardsRepository 
} from '../../domain/ports';
import { Product, Order, WithdrawalRequest, VaultCoinTransactionSchema } from '../../../../../packages/contracts';
import { z } from 'zod';

type VaultCoinTransaction = z.infer<typeof VaultCoinTransactionSchema>;

// Estado Global (Simulando DB)
const DB = {
  products: new Map<string, Product>(),
  orders: new Map<string, Order>(),
  ledger: new Map<string, VaultCoinTransaction[]>(), // userId -> txs
  withdrawals: new Map<string, WithdrawalRequest>(),
};

// Seed inicial
DB.products.set('box-1', {
  id: 'box-1',
  name: 'Cyber Sentinel Unit',
  description: 'Mocked Product',
  priceUsdt: 49.90,
  bonusVaultCoins: 500,
  imageUrl: 'https://placehold.co/400',
  tier: 'Rare',
  stock: 100,
  isHot: true
});

export class InMemoryCatalogRepo implements ICatalogRepository {
  async findAll(page: number, limit: number) {
    const all = Array.from(DB.products.values());
    return { items: all.slice((page - 1) * limit, page * limit), total: all.length };
  }
  async findById(id: string) { return DB.products.get(id) || null; }
  async create(p: Product) { DB.products.set(p.id, p); return p; }
  async updateStock(id: string, qty: number) {
    const p = DB.products.get(id);
    if (p) p.stock = qty;
  }
}

export class InMemoryOrdersRepo implements IOrdersRepository {
  async create(o: Order) { DB.orders.set(o.id, o); return o; }
  async findById(id: string) { return DB.orders.get(id) || null; }
  async findByUserId(uid: string) { 
    return Array.from(DB.orders.values()).filter(o => o.userId === uid); 
  }
  async updateStatus(id: string, status: any, tx?: string) {
    const o = DB.orders.get(id);
    if (o) { o.status = status; if(tx) o.txHash = tx; }
  }
}

export class InMemoryVaultCoinsRepo implements IVaultCoinsRepository {
  async getBalance(userId: string) {
    const txs = DB.ledger.get(userId) || [];
    return txs.reduce((acc, tx) => 
      tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount, 0);
  }
  async addTransaction(userId: string, tx: VaultCoinTransaction) {
    const current = DB.ledger.get(userId) || [];
    DB.ledger.set(userId, [tx, ...current]);
  }
  async getLedger(userId: string, limit: number, offset: number) {
    const txs = DB.ledger.get(userId) || [];
    return txs.slice(offset, offset + limit);
  }
}

export class InMemoryRewardsRepo implements IRewardsRepository {
  async createWithdrawal(req: WithdrawalRequest) { DB.withdrawals.set(req.id, req); return req; }
  async getWithdrawalsByStatus(status: any) {
    return Array.from(DB.withdrawals.values()).filter(w => w.status === status);
  }
  async updateWithdrawalStatus(id: string, status: any, tx?: string) {
    const w = DB.withdrawals.get(id);
    if (w) { w.status = status; if(tx) w.txHash = tx; }
  }
  async getAvailableBalance(_userId: string) { return 1000; } // Mock fixo
}