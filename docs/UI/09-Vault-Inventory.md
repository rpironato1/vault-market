# UI Spec — Vault (Inventário) (`/app/vault`)

## Objetivo
Listar NFTs e itens do usuário.

## Componentes
- Tabs: NFTs | Itens | Gift Cards (se aplicável)
- Grid/lista com filtros
- Detalhe de item (modal/page)

## Ações
- Ver detalhes
- Transferir (P2P, quando habilitado)
- Listar para venda (quando habilitado)

## Dados necessários
- `GET /me/vault`

## Estados
- Empty: “Seu vault está vazio” + CTA mercado

## Analytics
- `ui_vault_viewed`
