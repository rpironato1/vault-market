import { IAuthService } from '../domain/ports';
import { User } from '../domain/types';

// Simulation of network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAuthAdapter implements IAuthService {
  async loginWithEmail(email: string): Promise<User> {
    await delay(1500);
    
    if (email.includes('error')) {
      throw new Error('Credenciais inválidas.');
    }

    return {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: 'USER'
    };
  }

  async loginWithGoogle(): Promise<User> {
    await delay(2000);
    return {
      id: 'goog_' + Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      name: 'Google User',
      role: 'USER'
    };
  }

  async register(email: string): Promise<void> {
    await delay(1500);
    console.log(`[MockAuth] OTP enviado para ${email}`);
  }

  async verifyOtp(email: string, code: string): Promise<User> {
    await delay(1000);
    if (code !== '123456') {
      throw new Error('Código de verificação inválido.');
    }
    return {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      name: 'Novo Usuário',
      role: 'USER'
    };
  }

  async logout(): Promise<void> {
    await delay(500);
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }
}