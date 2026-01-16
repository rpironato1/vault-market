# Plano de Refatoração e Alinhamento Arquitetural (v0.1)

**Última atualização:** 2026-01-16  
**Objetivo:** alinhar a base do código atual com a arquitetura alvo antes de continuar o desenvolvimento de features (evita dívida e inconsistência).

---

## 1) Norte: “Arquitetura Base” (resumo executivo)

- Front: **SCS + Hexagonal**
- Back: **Workers/Hono + módulos por contexto**
- Contratos: `packages/contracts` (Zod/OpenAPI)
- Dados econômicos: **ledger imutável**
- Assíncrono: filas para confirmações/payouts

---

## 2) Ajuste estrutural: pastas `_` acima de `src/`

### 2.1 Situação atual
- `_core` e `_infrastructure` estão dentro de `src/` por limitação de ambiente.

### 2.2 Situação alvo
- `_core` e `_infrastructure` ficam **no mesmo nível de `src/`** (ex.: `apps/web/_core`).

### 2.3 Tarefas de refatoração (sem alterar comportamento)
1. Criar diretórios `apps/web/_core` e `apps/web/_infrastructure`.
2. Mover conteúdo de `src/_core` → `/_core`, `src/_infrastructure` → `/_infrastructure`.
3. Ajustar `tsconfig` paths:
   - `@core/*` → `./_core/*`
   - `@infra/*` → `./_infrastructure/*`
4. Ajustar `vite.config` aliases correspondentes.
5. Garantir que `pnpm lint && pnpm typecheck && pnpm build` passam.

> Observação: o bundler pode exigir configuração extra para permitir imports acima de `src`. Isso deve ser resolvido por alias e configuração de filesystem, mantendo segurança.

---

## 3) Remover lógica econômica crítica do client

### 3.1 Problema
- Lógicas como “gerar recompensa”, “debitar saldo” e “validar resultado” no client abrem portas para inconsistência e fraude.

### 3.2 Alinhamento
- Client:
  - exibe UI, estados e chama API
- Backend:
  - executa regras do domínio e registra ledger

### 3.3 Tarefas
1. Identificar qualquer `random`/simulação que impacte economia:
   - prêmios, saldo, outcomes
2. Substituir por chamadas API:
   - `POST /games/...`
   - `GET /me/balances`
3. Implementar mocks **via API** (em dev), nunca no client.

---

## 4) Alinhar semântica do produto (copy + UX)

### 4.1 Regra do PRD
- Usuário **não deposita USDT** para jogar.

### 4.2 Tarefas
- Revisar textos de erro e mensagens:
  - remover “deposite”
  - substituir por:
    - “Compre NFTs para ganhar VaultCoins”
    - ou “Você não possui VaultCoins suficientes”
- Ajustar CTAs e fluxos para levar o usuário ao mercado.

---

## 5) Fortalecer fronteiras por feature (SCS)

### 5.1 Problema típico
- Imports cruzados e lógica espalhada em `pages/` ou `components/` globais.

### 5.2 Regras
- Cada feature expõe somente o que for necessário via `features/<feature>/index.ts`.
- Shared UI fica em `components/` global.
- Shared domain types ficam em `_core`.

### 5.3 Tarefas
- Criar “public API” por feature e reduzir imports diretos de internals.
- Consolidar “stores globais” apenas quando absolutamente necessário.

---

## 6) Contratos e API client (preparação para backend real)

### 6.1 Criar `packages/contracts`
- Zod schemas:
  - auth
  - catalog
  - orders
  - balances
  - games
  - rewards/withdrawals

### 6.2 Criar client padrão no web
- `apps/web/_infrastructure/http/apiClient.ts`
- Suporte a:
  - baseURL por env
  - auth header/cookie
  - error normalization
  - request id

---

## 7) Qualidade mínima (sem “testes massivos”)

Conforme política do projeto:
- Sempre rodar:
  - lint
  - typecheck
  - build
- Validar fluxos com:
  - **MCP Playwright** (cenários reais)
- Backend CRUD:
  - coleções HTTP/cURL (smoke)

---

## 8) Critérios de aceite do alinhamento (Definition of Done)

- Estrutura `_core` e `_infrastructure` acima de `src` (ou com path alias) estabilizada.
- Nenhuma lógica econômica crítica permanece no client.
- Copy alinhado: sem referências a depósito.
- Contratos iniciais criados (mínimo para telas atuais).
- Pipelines básicos passam (lint/build/typecheck).
