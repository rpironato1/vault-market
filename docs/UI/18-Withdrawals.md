# UI Spec — Saque (`/app/withdrawals`)

## Objetivo
Solicitar saque de USDT (Polygon) com UX segura.

## Componentes
- Saldo Available
- Campo de carteira (Polygon) + validação
- Botão “Solicitar saque”
- Status do saque (tabela)

## Regras
- Somente USDT Polygon
- Pode exigir:
  - verificação de wallet
  - cooldown
  - revisão manual (mensagem clara)

## Dados necessários
- `POST /withdrawals`
- `GET /me/withdrawals`

## Analytics
- `ui_withdrawal_requested`
- `ui_withdrawal_status_changed`
