import { DashboardData } from './entities';

export interface IDashboardGateway {
  fetchDashboardData(): Promise<DashboardData>;
}