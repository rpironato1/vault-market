# UI Spec — Prêmios (USDT) (`/app/rewards`)

## Objetivo
Transparência do que foi ganho, status e disponibilidade para saque.

## Componentes
- Cards de saldo:
  - Earned total
  - Locked
  - Available
- Lista de prêmios (ledger)
- Explicação de por que pode estar “Locked”

## Dados necessários
- `GET /me/rewards/balance`
- `GET /me/rewards/ledger`

## Analytics
- `ui_rewards_viewed`
