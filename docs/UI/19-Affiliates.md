# UI Spec — Afiliados (`/app/affiliates`)

## Objetivo
Painel para afiliados selecionados.

## Acesso
Somente usuários com role/flag `affiliate`.

## Componentes
- Link/código
- Métricas:
  - cliques
  - cadastros
  - compras
  - ganhos
- Lista de indicados (com privacidade)

## Dados necessários
- `GET /affiliates/me`
- `GET /affiliates/me/stats`

## Analytics
- `ui_affiliate_dashboard_viewed`
