import { z } from 'zod';

export const CreateOrderSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export const OrderStatusSchema = z.enum(['PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']);

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    priceAtPurchase: z.number(),
  })),
  totalAmountUsdt: z.number(),
  status: OrderStatusSchema,
  txHash: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
export type Order = z.infer<typeof OrderSchema>;