import { AdminDashboardData } from './entities';

export interface IAdminGateway {
  fetchDashboardData(): Promise<AdminDashboardData>;
  approveAction(actionId: string): Promise<void>;
  rejectAction(actionId: string, reason: string): Promise<void>;
}