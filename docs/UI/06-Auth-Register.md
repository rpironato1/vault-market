# UI Spec — Cadastro (`/auth/register`)

## Objetivo
Criar conta com validações de segurança mínimas.

## Componentes
- Email
- Senha + confirmação (se aplicável)
- Aceite de termos
- Botão “Criar conta”
- Opção de OTP/email verification (se habilitado)

## Estados
- Loading ao submeter
- Erro (email já existe, senha fraca, etc.)
- Sucesso (ir para OTP ou login)

## Dados necessários
- `POST /auth/register`

## Analytics
- `ui_register_viewed`
- `ui_register_success`
- `ui_register_failed`
