import { z } from 'zod';

export const ProductTierSchema = z.enum(['Common', 'Rare', 'Epic', 'Legendary']);

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priceUsdt: z.number().positive(),
  bonusVaultCoins: z.number().nonnegative(),
  imageUrl: z.string().url(),
  tier: ProductTierSchema,
  stock: z.number().int().nonnegative(),
  isHot: z.boolean().optional(),
});

export const CatalogResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;