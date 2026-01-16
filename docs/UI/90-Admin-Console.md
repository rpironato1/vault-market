# UI Spec — Admin Console (MVP)

## Objetivo
Operação e mitigação de risco.

## Páginas
- `/admin` (overview)
- `/admin/catalog` (NFT catalog CRUD)
- `/admin/orders` (orders + reconciliação)
- `/admin/withdrawals` (review + approve/reject + status)
- `/admin/affiliates` (seleção + regras)
- `/admin/risk` (flags, cooldowns, limites)

## Componentes padrão
- DataTable com filtros e export (CSV opcional)
- Audit log viewer
- Ações sensíveis sempre exigem confirmação dupla

## Dados necessários
- Endpoints admin (autorização estrita)
