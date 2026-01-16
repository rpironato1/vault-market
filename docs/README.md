# Vault Market — Documentação (v0.1)

**Última atualização:** 2026-01-16  
**Escopo:** PRD + Arquitetura Base + Especificação de UI + Plano de Refatoração/Alinhamento + Roadmap + Prompts para Agentes.

## Como usar esta pasta

Recomendação de leitura (ordem):

1. `PRD.md` — visão do produto, requisitos e regras de negócio.
2. `ARCHITECTURE_BASE.md` — arquitetura base (modular/hexagonal/SCS) e decisões técnicas.
3. `UI/00-UI-OVERVIEW.md` — design system, navegação, padrões de UX.
4. `UI/*` — specs por tela (rotas, estados, componentes, dados, eventos).
5. `REFACTOR_ALIGN.md` — plano para alinhar o código atual com a arquitetura base (antes de evoluir features).
6. `ROADMAP.md` — roadmap por fases + critérios de aceite.
7. `AGENT_PROMPTS.md` — prompts prontos por etapa para execução por agente.

## Notas importantes (alinhadas com o seu contexto)

- As pastas prefixadas com `_` (ex.: `_core`, `_infrastructure`) **foram planejadas para ficar acima de `src/`** e serão movidas na refatoração (ver `REFACTOR_ALIGN.md`).
- Política de testes: foco em **agilidade**.
  - Sempre: **lint/build/typecheck**.
  - E2E/“no uso”: **MCP Playwright** (massivo).
  - Testes automatizados extensivos só entram **depois** do fluxo estar funcionando (hardening/regressão).
  - Backend: validação via chamadas REST (CRUD adequado), preferencialmente com coleções HTTP/cURL e smoke checks.

## Convenções

- IDs de requisitos:
  - FR-xxx (Functional Requirement)
  - NFR-xxx (Non-Functional Requirement)
  - SEC-xxx (Security / Anti-fraude)
  - OBS-xxx (Observabilidade)
- Sempre que possível: contratos e schemas (Zod/OpenAPI) antes da implementação.
