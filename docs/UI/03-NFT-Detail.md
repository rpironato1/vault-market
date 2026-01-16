# UI Spec — Detalhe do NFT (`/market/:id`)

## Objetivo
Converter interesse em compra, com clareza econômica e de termos.

## Componentes
- Hero: imagem + nome + preço + bônus VaultCoins
- Metadados (coleção, supply, contrato, utilidade)
- Seção “O que você ganha” (NFT + VaultCoins)
- Seção “Como usar VaultCoins” (link para experiências)
- CTA primário: “Comprar agora”
- CTA secundário: “Voltar ao catálogo”

## Estados
- Loading
- Error (NFT não encontrado)
- Disponibilidade: “sold out” / “limited”

## Ações e validações
- Comprar requer login: se não autenticado → redirecionar para login com retorno
- Mostrar confirmação: valor + rede + wallet conectada

## Dados necessários
- `GET /catalog/:id`
- `POST /orders` (criar order)
- `GET /orders/:id` (status)

## Analytics
- `ui_product_viewed`
- `ui_checkout_started`
