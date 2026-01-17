import { 
  ICatalogRepository, 
  IOrdersRepository, 
  IVaultCoinsRepository, 
  IRewardsRepository 
} from '../../domain/ports';
import { products, orders } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Factory simples para conexão
const getDb = () => {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql);
};

export class DrizzleCatalogRepo implements ICatalogRepository {
  async findAll(page: number, limit: number) {
    const db = getDb();
    const data = await db.select().from(products).limit(limit).offset((page - 1) * limit);
    // Cast necessário pois o schema DB pode diferir ligeiramente dos tipos Zod (decimal vs number)
    return { items: data as any[], total: 100 }; // Count real seria outra query
  }
  async findById(id: string) {
    const db = getDb();
    const [item] = await db.select().from(products).where(eq(products.id, id));
    return (item as any) || null;
  }
  async create(p: any) {
    const db = getDb();
    await db.insert(products).values(p);
    return p;
  }
  async updateStock(id: string, qty: number) {
    const db = getDb();
    await db.update(products).set({ stock: qty }).where(eq(products.id, id));
  }
}

export class DrizzleOrdersRepo implements IOrdersRepository {
  async create(o: any) {
    const db = getDb();
    await db.insert(orders).values(o);
    return o;
  }
  async findById(_id: string) { return null as any; }
  async findByUserId(_uid: string) { return []; }
  async updateStatus(_id: string, _status: any, _tx?: string) {}
}

export class DrizzleVaultCoinsRepo implements IVaultCoinsRepository {
  async getBalance(_userId: string) { return 0; }
  async addTransaction(_userId: string, _tx: any) {}
  async getLedger(_userId: string) { return []; }
}

export class DrizzleRewardsRepo implements IRewardsRepository {
  async createWithdrawal(req: any) { return req; }
  async getWithdrawalsByStatus(_status: any) { return []; }
  async updateWithdrawalStatus() {}
  async getAvailableBalance() { return 0; }
}