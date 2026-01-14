import { create } from 'zustand';
import { User, AuthStatus } from '../domain/types';
import { IAuthService } from '../domain/ports';
import { MockAuthAdapter } from './mock.adapter';

const authService: IAuthService = new MockAuthAdapter();

interface AuthState {
  user: User | null;
  status: AuthStatus;
  isLoading: boolean;
  
  // Actions
  loginEmail: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'IDLE',
  isLoading: false,

  loginEmail: async (email, password) => {
    set({ isLoading: true, status: 'LOADING' });
    try {
      const user = await authService.loginWithEmail(email, password);
      set({ user, status: 'AUTHENTICATED', isLoading: false });
    } catch (error) {
      set({ status: 'UnAUTHENTICATED', isLoading: false });
      throw error;
    }
  },

  loginGoogle: async () => {
    set({ isLoading: true, status: 'LOADING' });
    try {
      const user = await authService.loginWithGoogle();
      set({ user, status: 'AUTHENTICATED', isLoading: false });
    } catch (error) {
      set({ status: 'UnAUTHENTICATED', isLoading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      await authService.register(email, password, name);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (email, code) => {
    set({ isLoading: true });
    try {
      const user = await authService.verifyOtp(email, code);
      set({ user, status: 'AUTHENTICATED', isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, status: 'IDLE' });
  }
}));