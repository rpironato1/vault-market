# Vault Market — Arquitetura Base (v0.1)

**Última atualização:** 2026-01-16  
**Objetivo deste documento:** definir a base técnica para desenvolvimento paralelo, isolamento por features e evolução segura (com foco em agilidade).

---

## 1) Diretrizes de Arquitetura

### 1.1 Objetivos
- **Desenvolvimento paralelo**: times/agentes trabalham em módulos diferentes sem conflito.
- **Isolamento máximo**: mudanças em um módulo não quebram outros.
- **Troca fácil de provedores** (blockchain, pagamentos, antifraude) via Ports/Adapters.
- **Auditoria total** em fluxos econômicos (coins e prêmios).
- **Migração gradual**: evoluir do estado atual para backend real sem reescrita.

### 1.2 Padrões adotados
- **Hexagonal Architecture (Ports & Adapters)** para domínio e integrações.
- **Self-Contained Systems (SCS)** para organizar features como “fat modules”.
- **Monólito modular** (agora) com caminho explícito para microserviços (depois).

> Microserviços só quando houver drivers reais: escala independente, requisitos de segurança/blast-radius, times diferentes, ou necessidade operacional clara.

---

## 2) C4 (Visão de alto nível)

### 2.1 Contexto (C4-L1)
- Usuário acessa o **Web App**
- Web App consome **API (Workers/Hono)**
- API autentica via **Neon Auth**
- API persiste dados em **Neon Postgres** (via Hyperdrive)
- API integra com **Polygon** (indexação e payouts)
- Admin acessa **Backoffice** (pode ser rotas internas no Web App no MVP)

### 2.2 Componentes (C4-L2)
**Web**
- UI + roteamento + design system + controllers
- chama API via client (fetch)

**API**
- módulos por bounded context (auth, marketplace, vaultcoins, games, rewards/withdrawals, affiliates, admin)

**DB**
- tabelas por contexto, com forte trilha (ledger)

**Async**
- fila para:
  - processar confirmação de compras
  - processar reconciliação
  - executar payouts
- cron para:
  - reconciliações periódicas
  - reprocessamento idempotente

---

## 3) Estrutura de repositório recomendada (monorepo)

> Mantém agilidade e permite paralelismo (web + api + contracts), sem microserviços “prematuros”.

```
/apps
  /web
    /src
    /_core              (mover para acima de src quando refatorar)
    /_infrastructure    (mover para acima de src quando refatorar)
  /api
    /src
/packages
  /contracts            (Zod schemas + OpenAPI contracts)
  /shared               (utils puros, sem infra)
  /ui                   (opcional: design system compartilhado)
 /docs                  (esta documentação)
```

### 3.1 Regra de ouro para paralelismo
- `packages/contracts` define o contrato.
- `apps/api` implementa.
- `apps/web` consome.
- Mudanças em contrato = versão + compat.

---

## 4) Arquitetura no Frontend (SCS + Hex)

### 4.1 Estrutura por feature (modelo)
Cada feature deve ter, no mínimo:

```
features/<feature>/
  domain/           # regras puras: entidades, value objects, invariantes, interfaces (ports)
  infrastructure/   # adapters: API client, stores Zustand, mappers, cache
  presentation/     # pages, layouts, components, hooks de UI (sem regra de negócio crítica)
  index.ts          # public API da feature (export controlado)
```

### 4.2 Regras de acoplamento (enforcement mental + futuro lint)
- `presentation` **não** contém regra econômica crítica.
- `domain` **não** importa React, Zustand, UI libs.
- Features **não** importam internals umas das outras (apenas via `index.ts` exportado ou via contratos compartilhados).

---

## 5) Arquitetura no Backend (Workers/Hono + módulos)

### 5.1 Organização por módulos
```
src/modules/
  auth/
  marketplace/
  vaultcoins/
  games/
  rewards/
  withdrawals/
  affiliates/
  admin/
src/shared/
  http/
  db/
  observability/
  security/
```

### 5.2 Ports & Adapters (exemplos)
**Ports (interfaces)**:
- `BlockchainIndexPort`
- `PayoutPort`
- `FraudSignalsPort`
- `PaymentsPort` (futuro: PIX/cartão)

**Adapters (implementações)**:
- `PolygonRpcAdapter`
- `TreasuryPayoutAdapter` (tx do treasury)
- `QueueAdapter` (Cloudflare Queues)
- `HyperdrivePostgresAdapter`

---

## 6) Contratos e validação (contract-first)

### 6.1 Padrão recomendado
- Requests/responses tipados via **Zod**.
- API gera OpenAPI (ou mantém OpenAPI derivado).
- Web gera client ou consome via tipos.

### 6.2 Por que isso destrava paralelismo
- UI consegue ser construída com mocks de contrato (stubs).
- Backend evolui sem quebrar UI (versionamento controlado).
- Menos drift e bugs de integração.

---

## 7) Modelos de dados (mínimo viável)

### 7.1 Ledger de VaultCoins (imutável)
- `vaultcoin_ledger` (append-only)
- `vaultcoin_balance` (view/materialização opcional)

**Invariantes:**
- saldo não pode ficar negativo (salvo ajustes administrativos controlados)
- todo débito/ crédito tem `source` e `ref_id`

### 7.2 Ledger de Prêmios (USDT)
- `prize_ledger`
- `withdrawal_request`

**Invariantes:**
- saque só pode ocorrer se `AVAILABLE`
- payout gera `tx_hash` e mudança para `PAID`

### 7.3 Idempotência de eventos on-chain
- `chain_event_processed` com (chain_id, tx_hash/log_index/event_type) único.

---

## 8) Integrações (Neon + Hyperdrive + Neon Auth)

### 8.1 Neon Auth
- Deve ser a fonte de identidade (user/session) no DB.
- Estratégia recomendada:
  - login/cadastro padrão
  - “invite-only” para afiliados via role/flag e validação server-side

### 8.2 Hyperdrive
- Usar Hyperdrive para pooling e performance de conexão Postgres no edge.
- Preferir drivers compatíveis com Hyperdrive (ex.: drivers Postgres comuns, conforme docs).

---

## 9) Segurança e Anti-fraude (base técnica)

- Ledger imutável (coins e prêmios)
- Idempotência em pipeline on-chain
- Rate limiting no edge
- Regras de saque:
  - limites e cooldown
  - risk scoring básico
  - revisão manual (backoffice) no MVP
- Auditoria:
  - tabela `audit_log` para ações sensíveis (admin/withdrawal/affiliate)

---

## 10) Observabilidade

- Logs estruturados (JSON)
- Correlation ID por request
- Eventos de domínio (internos) para funil
- Alarmes em falhas de payout/indexação

---

## 11) Caminho para microserviços (quando fizer sentido)

Extrair módulos para Workers separados quando:
- houver “hot path” com escala e latência específica (ex.: games)
- houver necessidade de isolar chaves e riscos (withdrawals)
- houver times independentes
- houver necessidade operacional clara
