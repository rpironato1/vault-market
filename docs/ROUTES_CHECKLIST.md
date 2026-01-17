# Checklist de Rotas Canônicas (SSOT)

**Status:** Congelado (Fase Pré-DB)
**Fonte de Verdade:** `docs/UI/00-UI-OVERVIEW.md`

Este documento serve como contrato estrito para a implementação do roteador. Nenhuma rota fora desta lista deve ser criada sem atualização prévia do PRD.

## 1. Mapa "De-Para" (Migração)

| Rota Legada (Atual) | Rota Canônica (Alvo) | Ação Necessária | Motivo |
| :--- | :--- | :--- | :--- |
| `/marketplace` | `/market` | **Renomear** | Padrão "Catálogo Puro" vs "Feira". |
| `/marketplace/:id` | `/market/:id` | **Criar** | Detalhe do produto não existia isolado. |
| `/tokens` | `/app/coins` | **Mover/Renomear** | Centralizar em `/app` e usar termo "Coins". |
| `/partners` | `/app/affiliates` | **Mover/Renomear** | Termo "Affiliates" é o padrão do domínio. |
| `/vault` | `/app/vault` | **Mover** | Mover para dentro do shell `/app`. |
| `/games` | `/app/games` | **Mover** | Mover para dentro do shell `/app`. |
| `/login` | `/auth/login` | **Mover** | Agrupar autenticação. |
| `/register` | `/auth/register` | **Mover** | Agrupar autenticação. |

## 2. Rotas Canônicas (Definição Final)

### Zona Pública (Sem Auth)
- [ ] `/` (Landing Page)
- [ ] `/market` (Catálogo de NFTs - Listagem)
- [ ] `/market/:id` (Detalhe do NFT + CTA Compra)
- [ ] `/auth/login` (Entrada)
- [ ] `/auth/register` (Cadastro)
- [ ] `/terms` (Termos de Uso)
- [ ] `/privacy` (Privacidade)

### Zona da Aplicação (Requer Auth `USER`)
- [ ] `/app` (Dashboard Principal)
- [ ] `/app/vault` (Inventário de NFTs/Itens)
- [ ] `/app/coins` (Extrato e Saldo de VaultCoins)
- [ ] `/app/games` (Hub de Experiências)
- [ ] `/app/games/mines` (Data Sync)
- [ ] `/app/games/wheel` (Orbital Pulse)
- [ ] `/app/games/plinko` (Gravity)
- [ ] `/app/games/crash` (Quantum)
- [ ] `/app/rewards` (Extrato e Status de USDT)
- [ ] `/app/withdrawals` (Solicitação de Saque)
- [ ] `/app/settings` (Perfil e Wallets)
- [ ] `/app/affiliates` (Área de Parceiros - *Role Gated*)

### Zona Administrativa (Requer Auth `ADMIN`)
- [ ] `/admin` (Visão Geral / KPIs)
- [ ] `/admin/withdrawals` (Gestão de Treasury)
- [ ] `/admin/users` (Gestão de Operadores)
- [ ] `/admin/live` (Live Feed)
- [ ] `/admin/risk` (Configurações de Risco)

## 3. Regras de Integridade
1. **Zero Depósito:** Não existe rota `/deposit` ou `/buy-coins`. VaultCoins nascem apenas de `/market` ou `/app/affiliates`.
2. **Redirects:** Acessar `/login` logado deve redirecionar para `/app`.
3. **404:** Qualquer rota não listada acima deve renderizar `src/pages/NotFound.tsx`.