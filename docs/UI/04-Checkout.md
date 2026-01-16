# UI Spec — Checkout Crypto (`/checkout/:orderId`)

## Objetivo
Finalizar compra via wallet (Polygon).

## Componentes
- Resumo do pedido (NFT, preço, bônus coins)
- Wallet connect + status da rede
- CTA: “Confirmar pagamento”
- TransactionStatus (pending/confirmed/failed)
- Link para explorer (opcional)

## Regras
- Somente Polygon (no MVP)
- Mostrar erros de rede (wallet em chain errada)
- Não falar em depósito para jogar

## Estados
- Pedido criado (aguardando assinatura)
- Tx enviada (pending)
- Confirmada (success) → redirecionar `/app`
- Falha (retry)

## Dados necessários
- `POST /orders/:id/pay` (inicia fluxo)
- `GET /orders/:id` (poll status)

## Analytics
- `ui_checkout_confirm_clicked`
- `ui_order_paid`
- `ui_order_failed`
