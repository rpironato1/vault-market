import { z } from 'zod';

// --- Entidades Base ---

export const AdminStatsSchema = z.object({
  totalUsers: z.number(),
  totalVaultCoinsInCirculation: z.number(),
  totalUsdtPaid: z.number(),
  pendingWithdrawalsCount: z.number(),
  flaggedAccountsCount: z.number(),
});

export const RiskAlertSchema = z.object({
  id: z.string(),
  severity: z.enum(['WARNING', 'CRITICAL', 'INFO']),
  message: z.string(),
  timestamp: z.number(),
  metadata: z.record(z.string()).optional(),
});

export const PendingActionSchema = z.object({
  id: z.string(),
  type: z.enum(['WITHDRAWAL_REVIEW', 'KYC_CHECK', 'SUSPICIOUS_ACTIVITY']),
  user: z.string(),
  details: z.string(),
  riskScore: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  timestamp: z.number(),
});

// --- Requests & Responses ---

export const AdminDashboardResponseSchema = z.object({
  stats: AdminStatsSchema,
  pendingActions: z.array(PendingActionSchema),
  recentAlerts: z.array(RiskAlertSchema),
});

export const ProcessActionSchema = z.object({
  actionId: z.string(),
  decision: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(), // Obrigatório se REJECT
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;
export type AdminDashboardResponse = z.infer<typeof AdminDashboardResponseSchema>;