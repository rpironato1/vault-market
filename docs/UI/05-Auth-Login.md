# UI Spec — Login (`/auth/login`)

## Objetivo
Autenticar usuário.

## Componentes
- Email + senha (ou magic link, conforme Neon Auth configurado)
- Botão social (futuro, opcional)
- Link para cadastro

## Estados
- Loading ao submeter
- Erro (credenciais inválidas)
- Sucesso (redirect para retorno ou `/app`)

## Dados necessários
- `POST /auth/login` (via Neon Auth SDK ou via API)

## Analytics
- `ui_login_viewed`
- `ui_login_success`
- `ui_login_failed`
