import { z } from 'zod';

export const WithdrawalStatusSchema = z.enum(['PENDING_REVIEW', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED']);

export const CreateWithdrawalSchema = z.object({
  amount: z.number().positive(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço Polygon inválido'),
  network: z.literal('POLYGON').default('POLYGON'),
});

export const WithdrawalRequestSchema = CreateWithdrawalSchema.extend({
  id: z.string(),
  userId: z.string(),
  status: WithdrawalStatusSchema,
  createdAt: z.string().datetime(),
  txHash: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type CreateWithdrawalDTO = z.infer<typeof CreateWithdrawalSchema>;
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;