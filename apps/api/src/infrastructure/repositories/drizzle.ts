import { 
  ICatalogRepository, 
  IOrdersRepository, 
  IVaultCoinsRepository, 
  IRewardsRepository 
} from '../../domain/ports';
import { products, orders } from '../db/schema';
import { CatalogMapper, OrderMapper } from '../../domain/mappers';
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
    
    // AQUI OCORRE A TRADUÇÃO: DB -> API Contract
    const items = data.map(CatalogMapper.toContract);
    
    return { items, total: 100 }; 
  }

  async findById(id: string) {
    const db = getDb();
    const [item] = await db.select().from(products).where(eq(products.id, id));
    return item ? CatalogMapper.toContract(item) : null;
  }

  async create(p: any) {
    const db = getDb();
    // Aqui poderíamos usar insertProductSchema.parse(p) para validar antes de inserir
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
    // O mapper reverso (Contract -> DB) seria usado aqui em um cenário real
    await db.insert(orders).values({
      ...o,
      items: JSON.stringify(o.items) // Exemplo de adaptação de dados
    });
    return o;
  }
  
  async findById(id: string) { 
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order ? OrderMapper.toContract(order) : null;
  }

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