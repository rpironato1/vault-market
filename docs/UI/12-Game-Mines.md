# UI Spec — Game: Mines (`/app/games/mines`)

## Objetivo
Experiência baseada em seleção e progressão.

## Componentes
- BalancePill (VaultCoins)
- Input de gasto (wager)
- Grid do jogo
- Resultado e prêmio
- Histórico rápido (últimas sessões)

## Regras
- O resultado deve ser validado server-side.
- UI nunca decide prêmio com random local.

## Dados necessários
- `POST /games/mines/start` (wager)
- `POST /games/mines/reveal` (ação)
- `GET /games/sessions/:id`

## Analytics
- `ui_mines_started`
- `ui_mines_finished`
