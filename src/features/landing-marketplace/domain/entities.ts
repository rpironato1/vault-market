import { z } from 'zod';
import { ProductSchema, ProductTierSchema } from '@contracts/catalog';

// O contrato é a verdade absoluta.
// Se precisarmos de campos de UI (como 'isHot' que já está no schema, ou 'coverImage'),
// garantimos que o contrato suporte ou estendemos aqui.

export type BoxTier = z.infer<typeof ProductTierSchema>;
export type MarketBox = z.infer<typeof ProductSchema>;

export interface UnboxedItem {
  id: string;
  name: string;
  type: 'GAME_CURRENCY' | 'NFT_FRAGMENT' | 'GIFT_CARD';
  value: number;
  tier: BoxTier;
  image?: string;
}