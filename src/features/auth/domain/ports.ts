import { User } from './types';

export interface IAuthService {
  loginWithEmail(email: string, password: string): Promise<User>;
  loginWithGoogle(): Promise<User>;
  register(email: string, password: string, name: string): Promise<void>;
  verifyOtp(email: string, code: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}