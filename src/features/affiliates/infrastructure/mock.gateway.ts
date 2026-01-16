import { IAffiliatesGateway } from '../domain/gateway';
import { AffiliateData } from '../domain/entities';

const MOCK_DATA: AffiliateData = {
  stats: {
    totalReferrals: 42,
    activeReferrals: 18,
    totalEarnings: 350.00,
    conversionRate: 0.12, // 12%
    currentTier: 'SILVER'
  },
  referralCode: 'VAULT-NEO-2077',
  referralLink: 'https://vault.market/r/VAULT-NEO-2077',
  recentReferrals: [
    {
      id: 'ref-1',
      name: 'Trinity M.',
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 dias atrás
      status: 'ACTIVE',
      earningsGenerated: 45.00
    },
    {
      id: 'ref-2',
      name: 'Morpheus L.',
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 dias atrás
      status: 'ACTIVE',
      earningsGenerated: 120.00
    },
    {
      id: 'ref-3',
      name: 'Cypher R.',
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 dias atrás
      status: 'INACTIVE',
      earningsGenerated: 0.00
    }
  ]
};

export class MockAffiliatesGateway implements IAffiliatesGateway {
  async fetchAffiliateData(): Promise<AffiliateData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DATA;
  }
}