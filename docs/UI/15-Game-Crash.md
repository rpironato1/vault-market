# UI Spec — Game: Crash (`/app/games/crash`)

## Objetivo
Experiência de timing controlada com risco operacional.

## Componentes
- Input wager
- Indicador de multiplicador
- Botões “Iniciar” e “Encerrar”
- Resultado server-side

## Regras
- Server authoritative para evitar manipulação.

## Dados necessários
- `POST /games/crash/start`
- `POST /games/crash/cashout`

## Analytics
- `ui_crash_started`
- `ui_crash_cashed_out`
