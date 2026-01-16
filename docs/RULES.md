# RULES.md

## Regras de negocio (produto)
- Usuario nao deposita USDT para jogar (nao e cassino).
- VaultCoins sao utilitarios internos; premios em USDT sao separados.
- VaultCoins: ledger imutavel (append-only); saldo via soma de ledger.
- Premios USDT: ledger dedicado com estados (earned/locked/available/paid/rejected).
- Saque somente em USDT na Polygon.
- Afiliados sao selecionados (invite/allowlist), nao aberto ao publico.
- Copy deve evitar termos "deposito", "aposta", "cassino", "bet".

## Arquitetura e organizacao
- Frontend: Hexagonal + Self-Contained Systems (SCS).
- Backend: Workers + Hono com modulos por bounded context.
- Monolito modular agora; microservicos apenas com drivers reais.
- Contratos first: Zod + OpenAPI em `packages/contracts` (quando existir).
- Separacao on-chain vs off-chain; eventos on-chain precisam de idempotencia.

## Frontend (padroes obrigatorios)
- React + TypeScript + Vite.
- Rotas em `src/App.tsx`. Paginas em `src/pages`.
- Componentes globais em `src/components`.
- Features em `src/features/<feature>/{domain,infrastructure,components}`.
- Nao importar internals de outra feature; use API publica (index.ts) ou _core.
- `domain` sem React; `presentation` sem regra economica critica.
- Zustand para estado complexo; evitar `useEffect` para estado derivado.
- shadcn/ui nao deve ser modificado; criar wrappers se necessario.
- Icons: lucide-react (UI generico), phosphor (games/feature UI).
- Imagens placeholder: usar Unsplash conforme README.agents.

## UI/UX e design system
- Somente Tailwind CSS.
- Proibido CSS hardcoded; use tokens em `src/globals.css` ou `tailwind.config.ts`.
- Tema: "Sophistication & Trust" (dark, accent emerald, prestige gold).
- Tipografia: sans para UI; mono para valores/IDs (tabular-nums).
- Animacoes: framer-motion com transicoes precisas (sem bounce).
- UI responsiva (mobile/tablet/desktop) e estados completos (loading/empty/error).

## Backend, dados e integracoes
- Stack alvo: Cloudflare Workers + Hono + Neon + Hyperdrive + Neon Auth.
- Supabase e comandos Supabase sao proibidos sem autorizacao.
- Edge function por funcionalidade; nao reutilizar entre features.
- index.ts < 200 linhas; 200-400 avaliar modularizacao; > 400 modularizacao obrigatoria.
- Arquivos `.ts`/`.tsx`/`.py` nao devem passar de 300 linhas (modularizar).

## SQL e migrations
- Qualquer mudanca de DB exige migration.
- Migrations devem ter rollback.
- Nunca alterar banco sem migrations versionadas.

## Qualidade e testes
- Objetivo: zero erros/warnings em lint/build/typecheck/test.
- Playwright MCP manual para fluxos afetados (sem scripts E2E).
- Console do navegador sem erros/warnings.

## Observabilidade e seguranca
- Logs estruturados e correlation ID no backend.
- Auditoria para fluxos economicos (coins/premios/saques).
- Rate limiting e sinais anti-fraude no edge.

## Nomenclatura
- Padrao atual: "Vault Market".
- "VaultNet Protocol" permanece como alias historico ate decisao formal.

## Fontes de referencia
- `docs/PRD.md`
- `docs/ARCHITECTURE_BASE.md`
- `docs/REFACTOR_ALIGN.md`
- `docs/UI/*`
- `docs/AGENT_PROMPTS.md`
- `docs/TECHNICAL_IMPLEMENTATION_PLAN.md`
- `docs/ADRS/*`
- `README.md`, `README.agents.md`, `AI_RULES.md`
