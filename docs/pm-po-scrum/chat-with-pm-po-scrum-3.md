1) PRD do projeto

vault-market-docs/PRD.md
Inclui: objetivos, princípios inegociáveis (sem depósito), escopo MVP vs futuro, personas, jornadas, requisitos funcionais (FR), não funcionais (NFR), segurança (SEC), observabilidade (OBS), stack/frameworks e estratégia de testes alinhada com sua política.

2) Documentação de todas as telas (UI)

vault-market-docs/UI/00-UI-OVERVIEW.md (visão geral: design system, navegação, padrões, estados)

vault-market-docs/UI/01-Landing.md

vault-market-docs/UI/02-Catalog.md

vault-market-docs/UI/03-NFT-Detail.md

vault-market-docs/UI/04-Checkout.md

vault-market-docs/UI/05-Auth-Login.md

vault-market-docs/UI/06-Auth-Register.md

vault-market-docs/UI/07-Auth-OTP.md

vault-market-docs/UI/08-Dashboard.md

vault-market-docs/UI/09-Vault-Inventory.md

vault-market-docs/UI/10-VaultCoins.md

vault-market-docs/UI/11-Games-Hub.md

vault-market-docs/UI/12-Game-Mines.md

vault-market-docs/UI/13-Game-Wheel.md

vault-market-docs/UI/14-Game-Plinko.md

vault-market-docs/UI/15-Game-Crash.md

vault-market-docs/UI/16-Gift-Cards.md

vault-market-docs/UI/17-Rewards.md

vault-market-docs/UI/18-Withdrawals.md

vault-market-docs/UI/19-Affiliates.md

vault-market-docs/UI/20-Settings.md

vault-market-docs/UI/90-Admin-Console.md

Cada tela tem: objetivo, acesso, componentes, estados, ações, dados necessários (API), e eventos (analytics).

3) Documentação de refatoração/alinhamento com arquitetura base

vault-market-docs/REFACTOR_ALIGN.md
Foca em:

mover _core e _infrastructure para acima de src (conforme sua observação),

eliminar lógica econômica crítica no client,

reforçar boundaries por feature (SCS),

criar packages/contracts,

padronizar client de API,

manter testes no seu modelo (lint/build/typecheck + MCP Playwright).

4) Roadmap e prompts por etapas (Fortune-500 style)

vault-market-docs/ROADMAP.md
Fases com gates claros (Definition of Done).

vault-market-docs/AGENT_PROMPTS.md
Prompts prontos por etapa, com:

não-negociáveis,

checklist,

critérios de aceite,

validação (lint/typecheck/build),

e uso de MCP Playwright para validação “no uso”.

Extras úteis

vault-market-docs/ADRS/ADR-0001-architecture-strategy.md

vault-market-docs/ADRS/ADR-0002-ledger-first.md

vault-market-docs/REFERENCES.md

vault-market-docs/README.md (guia de leitura e contexto)

Fontes primárias validadas (por que confio no stack proposto)

Neon Auth: overview e fluxo de autenticação (inclui que Neon Auth é um serviço REST gerenciado e menciona a base em Better Auth).

Cloudflare Hyperdrive: overview e getting started recentes, e tutorial de Postgres em Workers.

Neon + Hyperdrive: guia oficial.

Playwright MCP: repositório oficial Microsoft + blog Microsoft explicando o papel do MCP para automação E2E com agentes.