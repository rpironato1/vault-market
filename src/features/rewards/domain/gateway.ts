import { RewardsData } from './entities';

export interface IRewardsGateway {
  fetchRewardsData(): Promise<RewardsData>;
}