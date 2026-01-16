import { AffiliateData } from './entities';

export interface IAffiliatesGateway {
  fetchAffiliateData(): Promise<AffiliateData>;
}