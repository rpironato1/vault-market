import { 
  ICatalogRepository, 
  IOrdersRepository, 
  IVaultCoinsRepository, 
  IRewardsRepository 
} from '../../domain/ports';
import { products, orders, vaultCoinLedger, prizeLedger, withdrawalRequests } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Product, Order, WithdrawalRequest } from '../../../../packages/contracts';

const getDb = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const sqlClient = neon(url);
  return drizzle(sqlClient);
};

export class DrizzleCatalogRepo implements ICatalogRepository {
  async findAll(page: number, limit: number) {
    const db = getDb();
    const items = await db.select().from(products).limit(limit).offset((page - 1) * limit);
    
    const total = 100; 

    const mappedItems: Product[] = items.map(p => ({
      ...p,
      priceUsdt: Number(p.priceUsdt),
      stock: p.stock,
      isHot: p.isHot || false,
      tier: p.tier as any
    }));

    return { items: mappedItems, total };
  }

  async findById(id: string) {
    const db = getDb();
    const [item] = await db.select().from(products).where(eq(products.id, id));
    if (!item) return null;
    
    return {
      ...item,
      priceUsdt: Number(item.priceUsdt),
      stock: item.stock,
      isHot: item.isHot || false,
      tier: item.tier as any
    };
  }

  async create(p: Product) {
    const db = getDb();
    await db.insert(products).values({
      ...p,
      priceUsdt: p.priceUsdt.toString(),
    });
    return p;
  }

  async updateStock(id: string, qty: number) {
    const db = getDb();
    await db.update(products).set({ stock: qty }).where(eq(products.id, id));
  }
}

export class DrizzleOrdersRepo implements IOrdersRepository {
  async create(o: Order) {
    const db = getDb();
    await db.insert(orders).values({
      ...o,
      totalAmountUsdt: o.totalAmountUsdt.toString(),
      items: o.items as any
    });
    return o;
  }

  async findById(_id: string) { return null; }
  async findByUserId(_uid: string) { return []; }
  async updateStatus(_id: string, _status: any, _tx?: string) {}
}

export class DrizzleVaultCoinsRepo implements IVaultCoinsRepository {
  async getBalance(userId: string) {
    const db = getDb();
    
    const result = await db.execute(sql`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END), 0) as balance 
      FROM ${vaultCoinLedger} 
      WHERE user_id = ${userId}
    `);
    
    // Cast to any to handle raw query result
    return Number((result as any).rows[0]?.balance || 0);
  }

  async addTransaction(_userId: string, _tx: any) {}
  async getLedger(_userId: string) { return []; }
}

export class DrizzleRewardsRepo implements IRewardsRepository {
  async getAvailableBalance(userId: string) {
    const db = getDb();
    const result = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0) as balance 
      FROM ${prizeLedger} 
      WHERE user_id = ${userId} AND status = 'AVAILABLE'
    `);
    return Number((result as any).rows[0]?.balance || 0);
  }

  async createWithdrawal(req: WithdrawalRequest) {
    const db = getDb();
    await db.insert(withdrawalRequests).values({
      ...req,
      amount: req.amount.toString()
    });
    return req;
  }
  
  async getWithdrawalsByStatus(_status: any) { return []; }
  async updateWithdrawalStatus() {}
}