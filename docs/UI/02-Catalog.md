# UI Spec — Catálogo de NFTs (`/market`)

## Objetivo
Listar NFTs disponíveis para compra.

## Acesso
Público (sem login), mas compra pode exigir login.

## Componentes
- Search bar (nome/coleção)
- Filtros (preço, raridade, coleção)
- Grid de ProductCard
- Paginação ou infinite scroll
- Banner discreto explicando VaultCoins (1:1)

## Estados
- Loading skeleton
- Empty: “Nenhum NFT encontrado” + limpar filtros
- Error: “Falha ao carregar catálogo” + retry

## Ações
- Abrir detalhe do NFT
- (Opcional MVP) adicionar ao carrinho

## Dados necessários (API)
- `GET /catalog` (lista + paginação)
- Campos: id, name, image, price_usdt, bonus_vaultcoins, rarity, availability

## Analytics
- `ui_market_viewed`
- `ui_catalog_filter_applied`
- `ui_product_opened`
