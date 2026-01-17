import { z } from 'zod';

export const AffiliateTierSchema = z.enum(['BRONZE', 'SILVER', 'GOLD', 'DIAMOND']);

export const ReferralSchema = z.object({
  id: z.string(),
  name: z.string(),
  joinedAt: z.number(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  earningsGenerated: z.number(),
});

export const AffiliateStatsSchema = z.object({
  totalReferrals: z.number(),
  activeReferrals: z.number(),
  totalEarnings: z.number(),
  conversionRate: z.number(),
  currentTier: AffiliateTierSchema,
});

export const AffiliateDataResponseSchema = z.object({
  stats: AffiliateStatsSchema,
  referralCode: z.string(),
  referralLink: z.string().url(),
  recentReferrals: z.array(ReferralSchema),
});

export type AffiliateStats = z.infer<typeof AffiliateStatsSchema>;
export type AffiliateDataResponse = z.infer<typeof AffiliateDataResponseSchema>;