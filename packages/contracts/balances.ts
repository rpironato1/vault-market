import { z } from 'zod';

export const BalanceSchema = z.object({
  vaultCoins: z.number().nonnegative(),
  usdt: z.object({
    available: z.number().nonnegative(),
    locked: z.number().nonnegative(),
    totalEarned: z.number().nonnegative(),
  }),
});

export type UserBalance = z.infer<typeof BalanceSchema>;