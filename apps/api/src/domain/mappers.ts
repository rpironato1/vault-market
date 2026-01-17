import { Product } from '@contracts/catalog';
import { Order } from '@contracts/orders';
import { InferSelectModel } from 'drizzle-orm';
import { products, orders } from '../infrastructure/db/schema';

// Tipos inferidos do Drizzle (Camada B)
type DbProduct = InferSelectModel<typeof products>;
type DbOrder = InferSelectModel<typeof orders>;

export class CatalogMapper {
  static toContract(dbProduct: DbProduct): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description || '',
      priceUsdt: Number(dbProduct.priceUsdt), // Conversão Numeric -> Number
      bonusVaultCoins: dbProduct.bonusVaultCoins,
      imageUrl: dbProduct.imageUrl,
      tier: dbProduct.tier as any, // Cast seguro se validado na entrada
      stock: dbProduct.stock,
      isHot: dbProduct.isHot || false
    };
  }
}

export class OrderMapper {
  static toContract(dbOrder: DbOrder): Order {
    return {
      id: dbOrder.id,
      userId: dbOrder.userId,
      items: dbOrder.items as any, // JSONB cast
      totalAmountUsdt: Number(dbOrder.totalAmountUsdt),
      status: dbOrder.status as any,
      txHash: dbOrder.txHash || undefined,
      createdAt: dbOrder.createdAt.toISOString()
    };
  }
}