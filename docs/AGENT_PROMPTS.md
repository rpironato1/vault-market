# Prompts para Agentes — Vault Market (v0.1)

**Última atualização:** 2026-01-16  
**Objetivo:** fornecer prompts “prontos para colar” que orientem agentes a executar tarefas com máxima aderência, sem esquecer itens críticos.

> Estes prompts assumem um agente com acesso ao repositório e capacidade de modificar código.  
> Política de testes do projeto: **lint/build/typecheck sempre** + validação “no uso” com **MCP Playwright**. Evitar suites massivas agora.

---

## Prompt 0 — Regras Globais (cole isto no início de qualquer execução)

**Papel:** Você é um(a) Engenheiro(a) de Software Sênior com foco em arquitetura e qualidade pragmática.

**Contexto do produto:** Marketplace de NFTs + VaultCoins + experiências + prêmios em USDT (Polygon) + saque.  
**Regra inegociável:** usuário **não deposita USDT para jogar**.

**Não-negociáveis técnicos:**
1. Seguir **Hexagonal + SCS** no frontend (módulos autocontidos).
2. Não colocar lógica econômica crítica no client (prêmios, ledger, validações).
3. Respeitar boundaries: `domain` puro, `presentation` sem regra de negócio crítica.
4. Sempre finalizar com:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`
5. Não criar suites extensas de testes agora (sem unit-test massivo).  
   - Validação E2E: use **MCP Playwright** para fluxo “no uso”.
   - Backend: validar CRUD via chamadas REST (coleção HTTP/cURL).

**Formato de saída obrigatório:**
- Resumo (o que mudou e por quê)
- Lista de arquivos alterados
- Como validar (comandos)
- Observações de risco (se houver)

**Se faltar informação:** faça suposições mínimas e documente-as; não bloqueie a entrega.

---

## Etapa 1 — Documentação e alinhamento inicial de UI (sem alterar lógica)

### Prompt 1.1 — Gerar/atualizar mapa de rotas e telas
**Objetivo:** produzir um inventário verificável de telas e rotas existentes no app.

**Tarefas:**
1. Identificar o arquivo de roteamento (React Router).
2. Listar rotas públicas e autenticadas.
3. Mapear cada rota para feature responsável.
4. Atualizar `docs/UI/00-UI-OVERVIEW.md` e criar/atualizar arquivos por tela.
5. Garantir consistência com PRD (sem copy de “depositar”).

**Critérios de aceite:**
- 100% das rotas existentes documentadas.
- Cada tela com: propósito, estado, dados necessários, eventos.

**Validação:**
- `pnpm lint && pnpm typecheck && pnpm build`
- MCP Playwright: navegar rotas principais e capturar checklist manual.

---

## Etapa 2 — Refatoração estrutural (alinhamento arquitetural)

### Prompt 2.1 — Mover `_core` e `_infrastructure` acima de `src`
**Objetivo:** aplicar a refatoração estrutural planejada para corrigir a base do monorepo/app web.

**Regras:**
- Sem alterar comportamento funcional.
- Ajustar imports via `tsconfig paths` e `vite alias`.
- Documentar quaisquer ajustes de bundler.

**Tarefas:**
1. Criar pastas `/_core` e `/_infrastructure` no nível correto.
2. Mover arquivos.
3. Ajustar `tsconfig*.json` e `vite.config.ts`.
4. Ajustar imports quebrados.
5. Rodar lint/build/typecheck.

**Critérios de aceite:**
- Build passa.
- App sobe e navega.

**Validação E2E (leve):**
- MCP Playwright: abrir landing, navegar para market, login page.

---

### Prompt 2.2 — Remover simulações econômicas do client
**Objetivo:** eliminar qualquer lógica de prêmio/resultado/ledger feita no client.

**Tarefas:**
1. Localizar uso de aleatoriedade ou cálculo de prêmio no client.
2. Substituir por chamadas ao API client (mesmo que backend ainda mocke).
3. Manter UX idêntica: loading, estados e mensagens.
4. Criar `packages/contracts` com schemas mínimos para:
   - catalog
   - orders
   - balances
   - games result
5. Ajustar UI para usar “mock API” quando backend não existir.

**Critérios de aceite:**
- Nenhum “random” define economia.
- UI consome API client.

**Validação:**
- lint/typecheck/build
- MCP Playwright: executar um fluxo de “abrir produto → iniciar checkout mock → ver saldo”.

---

## Etapa 3 — Backend Foundation (Workers/Hono + Neon)

### Prompt 3.1 — Criar `apps/api` (Hono) com rotas versionadas
**Objetivo:** criar API edge com Cloudflare Workers e Hono, com versionamento e validação.

**Tarefas:**
1. Criar `apps/api` com estrutura por módulos (`src/modules/...`).
2. Implementar:
   - `GET /health`
   - `GET /v1/catalog`
   - `POST /v1/orders`
   - `GET /v1/me/balances` (mock inicial)
3. Implementar validação de request/response com Zod.
4. Gerar (ou manter) OpenAPI.
5. Adicionar logging estruturado.

**Critérios de aceite:**
- API roda local (wrangler dev ou equivalente).
- Respostas tipadas batem com `packages/contracts`.

**Validação:**
- lint/typecheck/build
- Chamar endpoints via curl/HTTP file.

---

### Prompt 3.2 — Integrar Neon DB via Hyperdrive
**Objetivo:** conectar API ao Neon Postgres usando Hyperdrive (pooling).

**Tarefas:**
1. Criar esquema inicial (migrations) para:
   - users (se necessário além do Neon Auth)
   - catalog
   - orders
   - vaultcoin_ledger
   - prize_ledger
2. Configurar Hyperdrive binding.
3. Implementar repository layer (db adapter).
4. Validar queries simples e transações.

**Critérios de aceite:**
- API consegue listar catálogo a partir do DB.
- Migrations reproduzíveis.

---

### Prompt 3.3 — Integrar Neon Auth
**Objetivo:** autenticação real com sessions no DB via Neon Auth.

**Tarefas:**
1. Configurar Neon Auth no projeto Neon.
2. Integrar SDK no web e/ou API.
3. Proteger rotas `/v1/me/*`.
4. Implementar roles (admin/affiliate).

**Critérios de aceite:**
- Login funciona e `/v1/me/balances` retorna dados do usuário logado.

---

## Etapa 4 — Fluxos core (compra → coins → jogo → prêmio → saque)

### Prompt 4.1 — Implementar ledger de VaultCoins
**Objetivo:** ledger imutável + saldo consistente.

**Tarefas:**
- Implementar tabela ledger + constraints.
- Implementar endpoints:
  - `GET /v1/me/vaultcoins/balance`
  - `GET /v1/me/vaultcoins/ledger`
- Garantir idempotência para créditos.

**Aceite:**
- Saldo consistente e auditável.

---

### Prompt 4.2 — Implementar rewards e withdrawals (payout pipeline)
**Objetivo:** registrar prêmios e permitir saque com risk checks.

**Tarefas:**
- Implementar prize ledger e withdrawal requests.
- Estado de prize: earned/locked/available/paid.
- Endpoints:
  - `GET /v1/me/rewards/balance`
  - `POST /v1/withdrawals`
  - `GET /v1/me/withdrawals`
- Backoffice mínimo:
  - `GET /v1/admin/withdrawals`
  - `POST /v1/admin/withdrawals/:id/approve|reject`

**Aceite:**
- Fluxo completo em ambiente de staging (pode ser sem payout real inicialmente).

---

## Etapa 5 — Testes “no uso” com MCP Playwright (hardening incremental)

### Prompt 5.1 — Criar checklist de regressão com MCP Playwright
**Objetivo:** validar os fluxos críticos sem criar suite massiva de testes tradicionais.

**Tarefas:**
1. Definir cenários smoke:
   - navegar landing → market → detalhe
   - login/cadastro
   - visualizar dashboard
   - jogar (mock)
   - solicitar saque (mock)
2. Usar Playwright MCP para automatizar navegação e validar:
   - presença de elementos-chave
   - ausência de erros
   - mensagens corretas (sem “depositar”)

**Aceite:**
- Checklist executável e documentado.
- Não introduzir suite massiva agora.
