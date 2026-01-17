import { z } from 'zod';

export const TransactionTypeSchema = z.enum(['CREDIT', 'DEBIT']);
export const TransactionSourceSchema = z.enum(['NFT_PURCHASE', 'GAME_ENTRY', 'GAME_REWARD', 'AFFILIATE_BONUS', 'SYSTEM_ADJUSTMENT']);

export const VaultCoinTransactionSchema = z.object({
  id: z.string(),
  type: TransactionTypeSchema,
  source: TransactionSourceSchema,
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  timestamp: z.number(),
});

export const VaultCoinBalanceSchema = z.object({
  current: z.number(),
  totalEarned: z.number(),
  totalSpent: z.number(),
});

export const VaultCoinsWalletResponseSchema = z.object({
  balance: VaultCoinBalanceSchema,
  transactions: z.array(VaultCoinTransactionSchema),
});

export type VaultCoinsWalletResponse = z.infer<typeof VaultCoinsWalletResponseSchema>;