import { z } from 'zod';
import { AuthResponseSchema, LoginCredentialsSchema, RegisterCredentialsSchema } from '@contracts/auth';

// Derivação direta dos contratos (Single Source of Truth)
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type User = AuthResponse['user'];
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;

export interface AuthError {
  code: string;
  message: string;
}

export type AuthStatus = 'IDLE' | 'LOADING' | 'AUTHENTICATED' | 'UnAUTHENTICATED';