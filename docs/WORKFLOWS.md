# WORKFLOWS.md

## Workflow de desenvolvimento (padrao)
1. Ler contexto completo relevante (docs + README + codigo afetado).
2. Planejar com Context7, Graph of Thoughts e fluxograma do fluxo tocado.
3. Implementar com mudancas pequenas e verificaveis.
4. Validar: lint/build/typecheck e Playwright MCP (quando ha UI/fluxos).
5. Atualizar documentacao quando comportamento mudar.
6. Entregar com resumo, arquivos afetados e como validar.

## Workflow de documentacao tecnica
1. Identificar fontes de verdade (docs/PRD, ARCHITECTURE_BASE, UI specs).
2. Consolidar regras/decisoes sem inventar requisitos.
3. Referenciar arquivos fonte para evitar alucinacao.
4. Registrar pendencias e perguntas quando houver lacunas.

## Workflow de UI/UX
1. Verificar UI specs em `docs/UI/*` e regras de copy.
2. Garantir estados: loading, empty, error, success.
3. Confirmar responsividade e acessibilidade.
4. Validar no navegador com Playwright MCP (manual).

## Workflow de dados e backend
1. Criar migrations antes de alteracoes de schema.
2. Implementar ledger imutavel para VaultCoins e premios.
3. Garantir idempotencia para eventos on-chain.
4. Registrar auditoria para fluxos economicos.

## Workflow de validacao (Definition of Done)
- `npm run lint`
- `npm run build`
- `npx tsc --noEmit` (quando aplicavel)
- MCP Playwright manual nos fluxos alterados
- Console sem erros/warnings

## Workflow Git/CI/CD (estado atual)
- Nao ha fluxo formal documentado nos arquivos existentes.
- Decisao: Trunk-based development + feature flags.
- Checks minimos recomendados em CI: lint + build + typecheck.
- Indicativo de deploy front: `vercel.json` existe (confirmar com time).
- API alvo: Cloudflare Workers (confirmar pipeline quando existir).

## Fluxos operacionais do produto (resumo)
1. Compra NFT -> order -> confirmacao on-chain.
2. Credito VaultCoins via ledger.
3. Experiencia inicia -> debito VaultCoins -> resultado server-side.
4. Premio USDT -> estados (earned/locked/available).
5. Saque -> risk checks -> payout USDT Polygon.
