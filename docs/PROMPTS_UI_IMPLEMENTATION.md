# Prompts — Implementação de Telas (UI-first) (v0.1)

**Última atualização:** 2026-01-16  
**Objetivo:** prompts por tela para implementar **todas as telas faltantes** com a **estrutura correta (SCS + Hex no front)**, mantendo agilidade.

---

## Prompt Base (cole antes de qualquer prompt por tela)

Você é um(a) Engenheiro(a) de Software Sênior focado(a) em UI-first delivery com arquitetura modular.

### Contexto do produto (não-negociável)
- Marketplace de NFTs + VaultCoins + experiências + prêmios em USDT (Polygon) + saque.
- Usuário **não deposita USDT para jogar**. Qualquer copy/fluxo que sugira depósito está proibido.

### Arquitetura obrigatória (frontend)
- Implementar telas como **Self-Contained Features**:
  - `src/features/<feature>/domain`
  - `src/features/<feature>/infrastructure`
  - `src/features/<feature>/presentation`
- `domain` puro (sem React).
- `presentation` não contém regra econômica crítica.
- Preferir componentes do design system global (`src/components/ui`) quando aplicável.

### Dados enquanto backend não existe
- Usar **gateways/adapters mockáveis** na `infrastructure` da feature.
- Nunca definir economia com `Math.random()` para prêmios/saldos.
- Sempre obter dados via gateway/use-case que poderá ser trocado por API real depois.

### Entregáveis por tela
1. Rota adicionada no router
2. Page/Screen implementada com:
   - loading / empty / error
   - UX alinhada (sem depósito)
3. Componentes reutilizáveis extraídos se fizer sentido
4. Eventos (analytics) disparados (stub)
5. Atualizar `docs/UI/*` se houver divergência

### Validação obrigatória
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- MCP Playwright: navegar até a tela e executar o fluxo principal “no uso”.

Formato de saída do agente:
- Resumo
- Arquivos alterados
- Como validar
- Notas de risco

---

## UI-1 — Dashboard (`/app`)

Implemente a tela **Dashboard** conforme `docs/UI/08-Dashboard.md`.

**Requisitos:**
- Cards:
  - Saldo VaultCoins
  - Prêmios USDT (Available/Locked)
  - Atalhos: “Explorar NFTs”, “Jogar”, “Sacar”
  - Atividade recente
- Estados: loading / empty / error
- Dados via gateway mock:
  - `getBalances()`
  - `getRecentActivity()`

**Arquitetura:**
- Criar `features/dashboard/` (domain/infrastructure/presentation).

---

## UI-2 — VaultCoins (`/app/coins`)

Implemente a tela **VaultCoins** conforme `docs/UI/10-VaultCoins.md`.

**Requisitos:**
- Saldo atual + extrato (tabela)
- Filtros básicos
- Estados: loading / empty / error
- Copy: VaultCoins vêm de compra de NFTs e só servem para experiências

**Arquitetura:**
- Criar `features/vaultcoins/`.

---

## UI-3 — Rewards (`/app/rewards`)

Implemente a tela **Prêmios (USDT)** conforme `docs/UI/17-Rewards.md`.

**Requisitos:**
- Cards: Earned total / Locked / Available
- Lista de prêmios com status
- CTA para “Solicitar saque” se Available > 0
- Estados: loading / empty / error

**Arquitetura:**
- Criar `features/rewards/`.

---

## UI-4 — Withdrawals (`/app/withdrawals`)

Implemente a tela **Saque** conforme `docs/UI/18-Withdrawals.md`.

**Requisitos:**
- Saldo Available
- Campo de wallet Polygon + validação básica
- Solicitação de saque + tabela de solicitações
- Mensagens claras sobre revisão manual/cooldown/limites

**Arquitetura:**
- Criar `features/withdrawals/`.

---

## UI-5 — Settings (`/app/settings`)

Implemente **Configurações** conforme `docs/UI/20-Settings.md`.

**Requisitos:**
- Perfil básico
- Gestão de wallets:
  - adicionar
  - definir padrão de saque
  - verificação de posse (UI placeholder: assinar mensagem)
- Estados e validações

**Arquitetura:**
- Criar `features/settings/`.

---

## UI-6 — Legal e suporte (`/terms`, `/privacy`, `/support`)

Implemente páginas públicas estruturadas.

**Requisitos:**
- Conteúdo placeholder com seções (h2, listas)
- Links no footer

---

## UI-7 — Affiliates (`/app/affiliates`)

Implemente **Afiliados** conforme `docs/UI/19-Affiliates.md`.

**Requisitos:**
- role-gated (somente affiliate)
- link/código + métricas + copiar link

---

## UI-8 — Admin Console (`/admin/*`)

Implemente **Admin Console** conforme `docs/UI/90-Admin-Console.md`.

**Requisitos:**
- role-gated (somente admin)
- páginas mínimas:
  - overview
  - catalog
  - orders
  - withdrawals (review)
  - affiliates (allowlist)

---

## UI-9 — Ajustes obrigatórios em telas existentes

Revisar telas existentes (marketplace/games/gift-cards/vault) para:
1. Remover copy que sugira depósito.
2. Padronizar CTAs e navegação.
3. Garantir estados e consistência visual.

**Aceite:**
- Não existe texto “depositar” (ou equivalente) em nenhum lugar do app.
