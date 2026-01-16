# UI Spec — Configurações (`/app/settings`)

## Objetivo
Gerenciar perfil, segurança e wallets.

## Componentes
- Perfil básico
- Sessões/dispositivos (futuro)
- Wallet management:
  - adicionar wallet
  - verificar posse (assinatura)
  - definir wallet padrão de saque

## Dados necessários
- `GET /me`
- `POST /me/wallets`
- `POST /me/wallets/:id/verify`

## Analytics
- `ui_settings_viewed`
