import { WithdrawalData } from './entities';

export interface IWithdrawalsGateway {
  fetchWithdrawalData(): Promise<WithdrawalData>;
  requestWithdrawal(amount: number, address: string): Promise<void>;
}