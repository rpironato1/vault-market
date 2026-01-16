# UI Spec — VaultCoins (Saldo e Extrato) (`/app/coins`)

## Objetivo
Transparência do saldo e rastreabilidade.

## Componentes
- Saldo atual (big number)
- Extrato (DataTable):
  - data
  - tipo (credit/debit)
  - origem (compra NFT, jogo, afiliado, ajuste)
  - valor
  - referência

## Dados necessários
- `GET /me/vaultcoins/balance`
- `GET /me/vaultcoins/ledger?cursor=...`

## Estados
- Empty ledger: mostrar “Você ainda não movimentou VaultCoins”.

## Analytics
- `ui_vaultcoins_viewed`
