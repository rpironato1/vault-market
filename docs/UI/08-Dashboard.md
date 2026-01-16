# UI Spec — Dashboard (`/app`)

## Objetivo
Exibir status do usuário e atalhos do core loop.

## Componentes
- Cards:
  - Saldo VaultCoins
  - Prêmios USDT (Available/Locked)
  - Últimas compras
  - Atalho “Jogar”
  - Atalho “Sacar”
- Banner: “Como funciona” (para novos usuários)
- Notificações (tx pendentes)

## Dados necessários
- `GET /me`
- `GET /me/balances` (vaultcoins + usdt)
- `GET /me/recent-activity`

## Estados
- Loading skeleton
- Empty: “Você ainda não tem NFTs” + CTA para mercado

## Analytics
- `ui_dashboard_viewed`
