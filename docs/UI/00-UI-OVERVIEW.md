# UI Spec — Visão Geral (v0.1)

**Última atualização:** 2026-01-16  
**Objetivo:** padronizar design, navegação, estados e componentes para implementação consistente.

---

## 1) Princípios de UX

- **Clareza financeira**: o usuário precisa entender “o que tenho” (NFTs, VaultCoins, USDT) e “como obtive”.
- **Redução de ambiguidade**: toda ação que envolve economia tem explicação e confirmação.
- **Feedback imediato**: loading states, toasts, progresso e status de transação (on-chain).
- **Sem referência a depósito para jogar**: copy e UI devem reforçar regra “VaultCoins only”.

---

## 2) Design System (base)

### 2.1 Estética
- Diretriz: **Sophistication & Trust** (enterprise fintech)

### 2.2 Tokens (referência)
- Background: preto profundo e superfícies escuras
- Accent primário: verde (ações/sucesso)
- Prestige: dourado (itens raros)
- Danger: vermelho (erros/estados críticos)

> Obs.: valores exatos podem ser refinados, mas manter consistência global é obrigatório.

### 2.3 Tipografia
- UI: sans (Inter/Geist equivalente)
- Valores/IDs/hashes: monospace + tabular numbers

### 2.4 Motion
- Micro-interações: press feedback, hover subtle
- Page transitions suaves, sem “bounce”
- Não “gamificar” animações ao ponto de parecer cassino

---

## 3) Informação e navegação

### 3.1 Rotas (proposta)
**Público**
- `/` Landing
- `/market` Catálogo de NFTs
- `/market/:id` Detalhe do NFT
- `/auth/login`
- `/auth/register`
- `/auth/otp` (se aplicável)
- `/terms`, `/privacy`, `/support`

**Autenticado**
- `/app` Dashboard
- `/app/vault` Inventário (NFTs e itens)
- `/app/coins` VaultCoins (saldo + extrato)
- `/app/games` Hub de experiências
- `/app/games/mines`
- `/app/games/wheel`
- `/app/games/plinko`
- `/app/games/crash`
- `/app/gift-cards`
- `/app/rewards` Prêmios (USDT)
- `/app/withdrawals` Saque
- `/app/affiliates` (somente affiliates)
- `/app/settings` Perfil, segurança, wallets

**Admin (MVP pode estar no mesmo app)**
- `/admin`
- `/admin/catalog`
- `/admin/orders`
- `/admin/withdrawals`
- `/admin/affiliates`
- `/admin/risk`

### 3.2 Layouts padrão
- **PublicLayout**: header simples + CTA (login/market)
- **AppLayout**: sidebar/topbar + saldo e atalhos
- **AdminLayout**: navegação administrativa + filtros

---

## 4) Padrões de estado (obrigatórios)

Para toda tela conectada a dados:
- Loading (skeleton / shimmer)
- Empty state (mensagem + CTA)
- Error state (mensagem clara + retry)
- Offline/timeout (fallback)
- Sucesso (toast + callout)

---

## 5) Componentes reutilizáveis (mínimo)

- Header / Navbar
- Footer
- AuthCard (login/register)
- ProductCard (NFT)
- ProductDetailHero
- Badge (raridade/status)
- BalancePill (VaultCoins / USDT)
- TransactionStatus (pending/confirmed/failed)
- ModalConfirm (ações econômicas)
- DataTable (admin)
- Toast system

---

## 6) Instrumentação (eventos de UI)

Todos os eventos devem incluir:
- `user_id` (se autenticado)
- `session_id`
- `route`
- `timestamp`
- `context` (id do item, valor, etc.)

Eventos mínimos:
- `ui_market_viewed`
- `ui_product_opened`
- `ui_checkout_started`
- `ui_order_created`
- `ui_game_started`
- `ui_game_finished`
- `ui_withdrawal_requested`

---

## 7) Checklist de acessibilidade

- Navegação por teclado (tab order)
- Contraste adequado
- Labels e aria onde necessário
- Feedback de erro associado ao campo
