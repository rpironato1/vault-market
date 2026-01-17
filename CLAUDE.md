# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos de Desenvolvimento

```bash
npm run dev          # Servidor dev (http://localhost:8080)
npm run build        # Build produção
npm run lint         # ESLint
npx tsc --noEmit     # Type check
```

### Migrações (quando usar DB real)
```bash
npx drizzle-kit generate   # Gerar migration
npx drizzle-kit migrate    # Aplicar migration
```

## Arquitetura

**Padrão:** Hexagonal Architecture + Self-Contained Systems (SCS)

### Estrutura de Diretórios
```
src/                      # Frontend React
  ├── features/           # Módulos SCS (auth, dashboard, games, etc)
  │   └── <feature>/
  │       ├── domain/           # Entidades, ports, regras puras (sem React)
  │       ├── infrastructure/   # Adapters, stores, API clients
  │       └── presentation/     # Pages, layouts, componentes UI
  ├── components/         # Componentes globais
  ├── pages/              # Container pages
  └── App.tsx             # Router principal
_core/domain/             # Domain layer compartilhado
_infrastructure/          # Adapters e infraestrutura
  ├── api/                # MockBackend (dev)
  ├── http/               # API client Axios
  └── state/              # Zustand stores
packages/contracts/       # Zod schemas (contratos API)
```

### Path Aliases
```typescript
import { X } from '@/components/ui/x';        // ./src/*
import { Y } from '@core/domain/y';           // ./_core/*
import { Z } from '@infra/api/z';             // ./_infrastructure/*
import { W } from '@contracts/auth';          // ./packages/contracts/*
```

## Stack Tecnológico

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand
**Backend (target):** Cloudflare Workers + Hono + Drizzle ORM + Neon Postgres
**Validação:** Zod schemas compartilhados (Contract-First)

## Regras Técnicas Obrigatórias

### Proibições Absolutas
- `any` em TypeScript → tipar corretamente
- CSS hardcoded → usar apenas Design Tokens (tailwind.config.ts ou globals.css)
- Supabase/comandos Supabase → proibido sem autorização
- Scripts E2E Playwright → usar MCP Playwright para validação manual

### Limites de Código
- Arquivos `.ts`/`.tsx`: máximo 300 linhas (modularizar se exceder)
- Edge functions `index.ts`: < 200 linhas OK, 200-400 avaliar, > 400 modularizar

### Regras de .env
- Usar apenas '.env.development' e '.env.production' proibido usar outros tipos de .env

### Qualidade (Definition of Done)
- Zero erros/warnings em: lint, build, typecheck
- Zero erros/warnings no Console DevTools
- UI responsiva (mobile/tablet/desktop)

## Regras de Negócio Críticas

- **Usuário NÃO deposita USDT para jogar** (não é cassino)
- VaultCoins são utilitários internos (ledger imutável, append-only)
- Prêmios em USDT são separados (earned/locked/available/paid/rejected)
- Saque somente em USDT na Polygon
- **Evitar termos:** "depósito", "aposta", "cassino", "bet"

## Convenções de Código

### Features (SCS)
- Não importar internals de outra feature → usar API pública (index.ts) ou `_core`
- `domain/` sem React; `presentation/` sem regra econômica crítica

### UI
- Usar shadcn/ui (não modificar, criar wrappers se necessário)
- Icons: lucide-react (UI), phosphor (games/features)
- Tema: "Sophistication & Trust" (dark, accent emerald, prestige gold)
- Animações: framer-motion com transições precisas (sem bounce)

### Estado
- Zustand para estado complexo
- Evitar `useEffect` para estado derivado

## Documentação de Referência

- `docs/PRD.md` - Regras de negócio e visão do produto
- `docs/ARCHITECTURE_BASE.md` - Decisões de design e padrões
- `docs/RULES.md` - Regras técnicas e de negócio consolidadas
- `docs/UI/*.md` - Especificações de interface por tela
- `docs/ADRS/*` - Architecture Decision Records
