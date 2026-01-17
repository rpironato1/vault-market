# Prompts — Fase Pré Banco/Auth Real (Etapas 1–10) — Vault Market

**Última atualização:** 2026-01-17  
**Objetivo desta fase:** alinhar o produto implementado ao `docs/` (rotas, copy e fluxo), migrar para monorepo com pnpm workspaces, remover economia/RNG do client e deixar Web + API “wireados” com contratos tipados — **sem** integrar Neon DB/Auth ainda.

## Decisões (PO) — Fixas nesta fase
1. Substituir o “Marketplace” legado por **Catálogo NFT puro** (seguir PRD + UI specs).
2. Padronizar rotas conforme `docs/UI/00-UI-OVERVIEW.md` (rotas canônicas).
3. Migrar para monorepo **pnpm workspaces** com `apps/web`, `apps/api`, `packages/contracts`.

## Fora de escopo (NÃO fazer nesta fase)
- Integração Neon DB/Hyperdrive/migrations aplicadas em ambiente real.
- Integração Neon Auth/JWT real, sessões reais, roles reais.
- Indexer on-chain (Polygon), filas, cron, payout USDT.
- Automação E2E via CLI (`npx playwright ...`) — **usar MCP Playwright manual**.

## Regras inegociáveis (técnicas)
- TypeScript **sem `any`** (nem `as any`) — tipar via `packages/contracts/*`.
- UI: **proibido CSS hardcoded**; usar somente tokens em `src/globals.css`/`tailwind.config.ts` *(antes do monorepo)* ou `apps/web/src/globals.css`/`apps/web/tailwind.config.ts` *(após monorepo)*.
- Responsivo (mobile/tablet/desktop), estados completos (loading/empty/error).
- Sem regressão: toda remoção deve ter análise de impacto e validação.
- Finalizar cada etapa com **zero erros e warnings** em lint/typecheck/build e **console sem erros/warnings**.
- Playwright MCP manual para fluxos tocados (sem scripts).
- Supabase e comandos Supabase continuam proibidos (salvo autorização explícita do usuário).

## Referências (fonte de verdade)
- Produto/regras: `docs/PRD.md`, `docs/RULES.md`, `docs/WORKFLOWS.md`
- UI/rotas: `docs/UI/00-UI-OVERVIEW.md` + `docs/UI/*`
- Arquitetura: `docs/ARCHITECTURE_BASE.md`, `docs/ADRS/*`
- Refatoração: `docs/REFACTOR_ALIGN.md`
- Roadmap: `docs/ROADMAP.md`, `docs/STATUS.md`

---

## Graph of Thoughts (fase 1–10)
```mermaid
graph TD
  DOCS[docs/* (PRD + UI + Rules)] --> ROUTES[Router canônico (/market, /auth, /app, /admin)]
  ROUTES --> WEB[apps/web (React + Vite)]
  DOCS --> CONTRACTS[packages/contracts (Zod types)]
  CONTRACTS --> WEB
  CONTRACTS --> API[apps/api (Hono OpenAPI)]
  WEB --> APICLIENT[API client tipado]
  APICLIENT --> API
  LEGACY[src/pages + RNG client] --> CLEANUP[Remover legacy + RNG + copy inválida]
  CLEANUP --> WEB
  API --> USECASES[application/use-cases (wiring pré DB/Auth)]
  USECASES --> REPOS[Repos em memória (DB_TYPE=memory)]
```

## Fluxograma (execução sequencial)
```mermaid
flowchart TD
  A[Etapa 01: Congelar docs/rotas] --> B[Etapa 02: Baseline verde (lint/typecheck/build)]
  B --> C[Etapa 03: pnpm-workspace.yaml + scripts root]
  C --> D[Etapa 04: Criar apps/web e mover frontend]
  D --> E[Etapa 05: Unificar toolchain por workspace]
  E --> F[Etapa 06: Router canônico + redirects]
  F --> G[Etapa 07: Remover legacy (UI/copy) e garantir compliance]
  G --> H[Etapa 08: Implementar /market, /market/:id, /checkout/:orderId]
  H --> I[Etapa 09: Remover RNG/economia do client (mock-backend)]
  I --> J[Etapa 10: API use-cases + wiring (in-memory, sem auth real)]
```

---

# Prompt 00 — Regras Globais (cole no início de qualquer execução)

**Papel:** você é um(a) Engenheiro(a) Sênior responsável por alinhar produto + arquitetura, sem regressão.  
**Contexto:** Vault Market (NFT marketplace + VaultCoins + experiências + prêmios USDT).  
**Regra inegociável:** usuário **não deposita USDT para jogar**; copy não pode sugerir depósito/aposta/cassino.

**Obrigatório em TODO prompt desta fase**
1. Ler fontes de verdade antes de mudar: `docs/PRD.md`, `docs/UI/00-UI-OVERVIEW.md`, `docs/RULES.md`.
2. Planejar com **Context7** quando envolver bibliotecas (pnpm/drizzle/hono/react-router).
3. Produzir Graph of Thoughts + fluxograma do fluxo tocado (Mermaid).
4. Finalizar com:
   - `pnpm lint`
   - `pnpm exec tsc -p tsconfig.app.json --noEmit` *(antes do monorepo)* / `pnpm -r typecheck` *(após monorepo)*
   - `pnpm build` *(antes do monorepo)* / `pnpm -r build` *(após monorepo)*
5. Validar manualmente via **MCP Playwright** os fluxos tocados e checar console (0 erros/warnings).

**Formato de saída obrigatório**
- Resumo objetivo
- Lista de arquivos alterados
- Como validar (comandos + rota/fluxo Playwright MCP)
- Riscos/observações + rollback simples (se aplicável)

---

# Prompt 01 — Congelar fonte de verdade (docs) + mapa canônico de rotas

**Objetivo:** confirmar `docs/` como fonte de verdade e consolidar o mapa de rotas canônicas que o código deverá seguir, sem “inventar” novas rotas.

**Tarefas**
1. Confirmar rotas canônicas em `docs/UI/00-UI-OVERVIEW.md`.
2. Produzir um checklist verificável de rotas alvo (público, autenticado, admin) e o “de-para” das rotas legadas atuais.
3. Registrar decisões A/A/A (catálogo puro, rotas canônicas, monorepo pnpm) como premissas de execução desta fase.

**Critérios de aceite**
- Um documento/checklist claro (rota → tela → fonte `docs/UI/*`) pronto para execução.

**Validação**
- Não aplica (documentação/checklist).

---

# Prompt 02 — Baseline verde (lint/typecheck/build) sem regressão funcional

**Objetivo:** fazer o estado atual ficar “verde” (zero erros) em lint/typecheck/build para destravar a migração do monorepo e evitar cascata.

**Escopo**
- Corrigir `any`, `as any`, `prefer-const`, erros TS em componentes (incluindo shadcn/ui **somente se necessário**).
- Ajustar `tailwind.config.ts` e configurações que bloqueiem lint.

**Tarefas**
1. Rodar `pnpm lint`, `pnpm exec tsc -p tsconfig.app.json --noEmit`, `pnpm build` e listar erros por arquivo.
2. Corrigir de forma cirúrgica, mantendo comportamento. Proibido “silenciar” sem justificativa.
3. Se tocar `src/components/ui/*`, fazer o mínimo e justificar por que foi estritamente necessário.

**Critérios de aceite**
- `pnpm lint` sem erros/warnings.
- `pnpm exec tsc -p tsconfig.app.json --noEmit` sem erros.
- `pnpm build` sem erros/warnings.

**Validação manual**
- MCP Playwright: abrir `/` e navegar 2–3 rotas principais atuais, console limpo.

---

# Prompt 03 — Criar pnpm workspaces (estrutura raiz) + scripts agregadores

**Objetivo:** iniciar monorepo com `pnpm-workspace.yaml` e scripts root para executar comandos recursivos.

**Referência Context7 (obrigatória)**
- pnpm workspaces + `pnpm -r` + `pnpm --filter` (docs oficiais).

**Tarefas**
1. Criar `pnpm-workspace.yaml` com `packages: ['apps/**', 'packages/*']`.
2. Ajustar `package.json` raiz para scripts agregadores (ex.: `pnpm -r lint`, `pnpm -r build`, `pnpm -r typecheck`).
3. Garantir que `packages/contracts` continua consumível por web e api (paths/exports).

**Critérios de aceite**
- `pnpm -r lint` e `pnpm -r build` funcionam (mesmo que por enquanto só rodem no root), preparando o passo 04.

---

# Prompt 04 — Criar `apps/web` e mover o frontend do root para o workspace

**Objetivo:** mover o frontend para `apps/web` e deixar o root como orquestrador do monorepo.

**Tarefas**
1. Criar `apps/web/package.json` com scripts `dev/lint/typecheck/build`.
2. Mover `src`, `public`, `index.html`, `vite.config.*`, `tsconfig*.json` e configs web para `apps/web` (ajustar paths).
3. Mover `_core` e `_infrastructure` para `apps/web/_core` e `apps/web/_infrastructure` (ou alternativa equivalente) e ajustar aliases/paths.
4. Manter `apps/api` e `packages/contracts` como workspaces independentes.

**Critérios de aceite**
- `pnpm --filter <web> dev` sobe o web.
- Rotas principais renderizam.

---

# Prompt 05 — Unificar toolchain por workspace (lint/typecheck/build) + gates no root

**Objetivo:** garantir que cada workspace tenha scripts padronizados e o root execute tudo de forma determinística.

**Tarefas**
1. Definir scripts mínimos por pacote:
   - `apps/web`: `lint`, `typecheck`, `build`
   - `apps/api`: `lint`, `typecheck`, `build` (ou equivalente worker)
   - `packages/contracts`: `lint`, `typecheck` (se aplicável)
2. Ajustar TS configs/paths para `@contracts` funcionar em web/api.
3. Padronizar comandos root:
   - `pnpm -r lint`
   - `pnpm -r typecheck`
   - `pnpm -r build`

**Critérios de aceite**
- Os 3 comandos acima passam sem erros.

---

# Prompt 06 — Implementar Router canônico + redirects temporários (sem quebrar links)

**Objetivo:** alinhar rotas do app ao canônico do `docs/UI/00-UI-OVERVIEW.md`, com redirects das rotas legadas.

**Tarefas**
1. Atualizar router para:
   - Público: `/`, `/market`, `/market/:id`, `/auth/login`, `/auth/register`, `/auth/otp` (se aplicável)
   - App: `/app`, `/app/vault`, `/app/coins`, `/app/games`, `/app/games/mines|wheel|plinko|crash`, `/app/rewards`, `/app/withdrawals`, `/app/settings`, `/app/affiliates`
   - Admin: `/admin`, `/admin/catalog`, `/admin/orders`, `/admin/withdrawals`, `/admin/affiliates`, `/admin/risk`
2. Implementar redirects:
   - `/login` → `/auth/login`
   - `/register` → `/auth/register`
   - `/marketplace` → `/market`
   - `/games` → `/app/games` (ou manter shell e redirecionar)
   - `/vault` → `/app/vault`, etc.
3. Garantir guards (mesmo que mock) e não expor admin sem role (ainda mock, mas com boundary claro).

**Critérios de aceite**
- Navegação funciona para rotas canônicas.
- Rotas legadas redirecionam corretamente.

**Validação manual**
- MCP Playwright: navegar 100% das rotas públicas canônicas + 2 rotas `/app/*`, console sem erros.

---

# Prompt 07 — Remover legacy UI/copy que conflita com PRD (com análise de impacto)

**Objetivo:** remover/substituir páginas/trechos “loot-box/cassino/copy inválida” e alinhar linguagem ao PRD (sem “depósito/aposta”).

**Tarefas**
1. Identificar telas/componentes legados que não existem no UI spec (ex.: marketplace “caixa do milhão”).
2. Substituir por fluxo canônico do catálogo NFT (sem regressão de navegação).
3. Rodar “compliance grep” por termos proibidos e ajustar copy.

**Critérios de aceite**
- UI não sugere “depósito/aposta/cassino”.
- Fluxos de navegação principais continuam funcionais.

---

# Prompt 08 — Implementar UI pública: `/market`, `/market/:id`, `/checkout/:orderId`

**Objetivo:** entregar o core loop público do marketplace conforme UI specs.

**Referências**
- `docs/UI/02-Catalog.md`
- `docs/UI/03-NFT-Detail.md`
- `docs/UI/04-Checkout.md`

**Tarefas**
1. Implementar catálogo (grid, filtros mínimos, loading/empty/error).
2. Implementar detalhe do NFT com CTA “Comprar agora” e criação de order.
3. Implementar checkout (status de tx, pending/confirmed/failed) — inicialmente mockado via API (não via RNG local).

**Critérios de aceite**
- Rotas públicas completas e navegáveis.
- Dados vêm de gateway/cliente tipado (contracts), mesmo que backend ainda seja in-memory/mocked.

**Validação manual**
- MCP Playwright: `/ -> /market -> /market/:id -> iniciar checkout`, console sem erros.

---

# Prompt 09 — Eliminar RNG/economia do client (remover MockBackend do core)

**Objetivo:** garantir que nenhum cálculo econômico/resultado crítico depende de RNG no frontend.

**Tarefas**
1. Remover uso de `Math.random()` para saldo/prêmios/outcomes em fluxos econômicos.
2. Trocar por chamadas ao API client tipado (`packages/contracts`), com mocks apenas no backend (in-memory) quando necessário.
3. Garantir que jogos não decidam resultado no client (apenas UI/inputs).

**Critérios de aceite**
- Não existe RNG local definindo economia/resultado.
- UI continua com estados/feedback corretos.

**Validação manual**
- MCP Playwright: executar 1 fluxo de jogo e verificar que resultado vem de resposta do backend (mesmo em memória).

---

# Prompt 10 — Backend: criar camada `application/use-cases` + wiring (sem DB/Auth real)

**Objetivo:** remover “mocks estáticos” nos controllers e ligar rotas a casos de uso reais, usando repositórios em memória e identidade stub.

**Referência Context7 (obrigatória)**
- Hono OpenAPIHono + `createRoute` + `c.req.valid()` (padrão oficial).

**Tarefas**
1. Criar `apps/api/src/application/` com use-cases por bounded context (ex.: catalog, orders, balances).
2. Atualizar `apps/api/src/routes/*` para usar use-cases (não acessar repositório diretamente).
3. Manter `DB_TYPE=memory` como default e garantir que tudo funciona sem Neon.
4. Alinhar endpoints com o que o web chama (contratos + paths).

**Critérios de aceite**
- Endpoints funcionam com in-memory e retornam responses compatíveis com `packages/contracts`.
- Zero `any`/`as any` em rotas/use-cases.

**Validação**
- `pnpm -r lint && pnpm -r typecheck && pnpm -r build`
- Smoke via chamadas HTTP (curl/http file) + MCP Playwright no web.
