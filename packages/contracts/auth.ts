import { z } from 'zod';

export const LoginCredentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const RegisterCredentialsSchema = LoginCredentialsSchema.extend({
  name: z.string().min(2, 'Nome é obrigatório'),
  referralCode: z.string().optional(),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.enum(['USER', 'ADMIN', 'AFFILIATE']),
  }),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;