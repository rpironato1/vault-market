import { AdminDashboardData, AdminWithdrawalRequest, AdminUserSummary } from './entities';

export interface IAdminGateway {
  fetchDashboardData(): Promise<AdminDashboardData>;
  fetchWithdrawals(status?: string): Promise<AdminWithdrawalRequest[]>;
  fetchUsers(search?: string): Promise<AdminUserSummary[]>;
  
  approveAction(actionId: string): Promise<void>;
  rejectAction(actionId: string, reason: string): Promise<void>;
  
  processWithdrawal(id: string, action: 'APPROVE' | 'REJECT'): Promise<void>;
  updateUserStatus(userId: string, status: AdminUserSummary['status']): Promise<void>;
}