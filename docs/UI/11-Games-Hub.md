# UI Spec — Hub de Experiências (`/app/games`)

## Objetivo
Descoberta de experiências e entrada no loop de gasto.

## Componentes
- Cards por jogo (Mines, Wheel, Plinko, Crash)
- Cada card mostra:
  - descrição curta
  - custo mínimo em VaultCoins
  - potencial de prêmio (copy defensiva)

## Regras de copy
- Explicar: “VaultCoins only”
- Sem linguagem de aposta/cassino (foco em “experiência”)

## Dados necessários
- `GET /games` (catalog)
- `GET /me/vaultcoins/balance`

## Analytics
- `ui_games_hub_viewed`
- `ui_game_opened`
