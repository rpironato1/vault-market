export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export type AuthStatus = 'IDLE' | 'LOADING' | 'AUTHENTICATED' | 'UnAUTHENTICATED';