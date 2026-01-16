# UI Spec — Verificação (OTP) (`/auth/otp`)

## Objetivo
Verificar email/usuário (quando habilitado).

## Componentes
- Campo OTP (6 dígitos)
- Reenviar código
- Voltar

## Estados
- Loading
- Erro (OTP inválido/expirado)
- Sucesso (redirect)

## Dados necessários
- `POST /auth/verify`
