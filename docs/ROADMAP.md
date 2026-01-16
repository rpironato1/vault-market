# Roadmap — Vault Market (v0.1)

**Última atualização:** 2026-01-16  
**Princípio:** agilidade com disciplina arquitetural — primeiro alinhar base, depois crescer features.

---

## Fase 0 — Congelar visão e contratos (Documentação)
**Objetivo:** garantir que UI, PRD e arquitetura estejam alinhados antes de codar pesado.

### Entregáveis
- PRD finalizado e revisado
- UI Specs completas (todas telas do MVP)
- Arquitetura base + ADRs mínimas
- Contratos iniciais (Zod/OpenAPI) definidos no papel

### Gate
- Todos os fluxos do core loop documentados (compra → coins → jogo → prêmio → saque)

---

## Fase 1 — Alinhamento do Frontend (Refatoração)
**Objetivo:** base limpa, modular e pronta para consumir API real.

### Entregáveis
- `_core` e `_infrastructure` reposicionados acima de `src`
- Padronização SCS (public APIs por feature)
- Remoção de simulações econômicas no client
- API client padrão no web
- Copy e navegação alinhadas ao PRD

### Gate
- `pnpm lint && pnpm typecheck && pnpm build` passam
- UI continua funcionando (validação via MCP Playwright)

---

## Fase 2 — Backend foundation (Workers/Hono + Neon)
**Objetivo:** criar API real e persistência.

### Entregáveis
- `apps/api` (Hono) com rotas versionadas
- Neon Postgres + migrations iniciais
- Conexão via Hyperdrive
- Neon Auth integrado (sessões e roles)
- Observabilidade básica

### Gate
- CRUD validado via chamadas REST (coleção/cURL)
- Lint/build/typecheck no monorepo

---

## Fase 3 — Compra NFT → VaultCoins (core loop 1)
**Objetivo:** transformar compra em crédito de coins.

### Entregáveis
- Catálogo vindo do backend
- Orders: create + status
- Confirmação de pagamento on-chain (pipeline idempotente)
- Crédito de vaultcoins via ledger

### Gate
- Usuário compra e vê coins no dashboard
- Auditoria consistente

---

## Fase 4 — Experiências (core loop 2)
**Objetivo:** gastar coins e gerar prêmios.

### Entregáveis
- Games endpoints (server-authoritative)
- Débito coins via ledger
- Prize ledger (USDT) com estados

### Gate
- Usuário joga usando coins e enxerga prêmios (earned/locked/available)

---

## Fase 5 — Saque (core loop 3)
**Objetivo:** payout USDT Polygon com segurança.

### Entregáveis
- Withdrawal request + risk checks
- Execução do payout (treasury)
- Admin review (quando necessário)
- Reconciliação e logs

### Gate
- Saque bem-sucedido em ambiente de teste (testnet ou staging)
- Alarmes básicos e auditoria

---

## Fase 6 — Afiliados e P2P NFTs (expansão)
**Objetivo:** crescimento com controle de risco.

### Entregáveis
- Affiliate dashboard + tracking
- P2P listing e compra em USDT (Polygon)
- Controles antifraude específicos

---

## Fase 7 — Hardening & regressão (testes)
**Objetivo:** blindar contra regressão após funcionamento completo.

### Entregáveis
- Suite de testes automatizados mínima de regressão (estratégica, não massiva)
- Playwright (sem MCP) opcional como pipeline
- CI/CD best practices completas
