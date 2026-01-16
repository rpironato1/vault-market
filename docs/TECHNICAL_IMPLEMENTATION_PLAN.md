# Plano de Implementação Técnica — UI/UX & Frontend (v1.0)

**Contexto:** VaultNet Protocol  
**Objetivo:** Traduzir a "UI Spec v0.1" em diretrizes de código, garantindo segurança, consistência "Sophistication & Trust" e cumprimento estrito das regras de negócio (VaultCoins Only).

---

## 1. Princípios de UX & Restrições de Negócio (Hard Rules)

Para garantir que o sistema nunca pareça um cassino ou induza ao erro financeiro, as seguintes regras devem ser implementadas via código e revisão:

### 1.1 Regra "VaultCoins Only" (Code Enforcement)
*   **Proibição Semântica:** É vetado o uso de palavras como "Depósito", "Aportar" ou "Investir" em contextos de jogos/experiências.
    *   *Implementação:* Criar um componente `<SafeText>` ou validar via Code Review que jogos usam apenas termos como "Iniciar Sincronia", "Utilizar Coins", "Validar Bloco".
*   **Dual-Ledger UI:** A interface deve separar visualmente e espacialmente os saldos:
    *   **VaultCoins (Utility):** Sempre à esquerda ou topo, cor `Accent/Emerald`. Ícone: `Zap` ou `Coin`.
    *   **USDT (Reward):** Sempre em containers separados (Reward Pool), cor `Prestige/Gold` ou `White`. Ícone: `Trophy` ou `DollarSign`.

### 1.2 Padrão de Confirmação Financeira (Transactional Friction)
Qualquer ação que reduza o saldo de VaultCoins ou movimente USDT deve exigir confirmação explícita. Não deve haver "1-click bet" acidental.
*   **Componente:** `<TransactionGuard>`
*   **Props:** `amount`, `currency`, `onConfirm`.
*   **Comportamento:** Modal ou Slide-to-confirm que exibe: "Você está prestes a consumir X VaultCoins".

---

## 2. Design System: Definição Técnica

### 2.1 Paleta de Cores (Tailwind Config)
O tema "Dark Deep" é mandatório. Não haverá Light Mode no MVP.

```typescript
// tailwind.config.ts extension
export const colors = {
  background: {
    DEFAULT: '#050505', // Deep Black (Main Background)
    surface: '#121212', // Card Surface
    elevated: '#1A1A1A', // Hover states / Modals
  },
  accent: {
    DEFAULT: '#00FF9C', // Emerald Neon (Primary Action/Success)
    dim: 'rgba(0, 255, 156, 0.1)', // Glow effects
    text: '#00CC7D', // Readable text on dark
  },
  prestige: {
    DEFAULT: '#FFD700', // Gold (High Value Items)
    dim: 'rgba(255, 215, 0, 0.1)',
  },
  danger: {
    DEFAULT: '#FF0055', // Crimson (Error/Critical/Crash)
    dim: 'rgba(255, 0, 85, 0.1)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA', // Zinc-400
    tertiary: '#52525B', // Zinc-600
  }
}
```

### 2.2 Tipografia & Dados
*   **UI Geral:** `Inter` ou `Geist Sans`. Peso: Regular (400) e Medium (500). Bold (700) apenas para Títulos.
*   **Dados Financeiros (CRÍTICO):** `JetBrains Mono` ou `Geist Mono`.
    *   **Regra CSS:** `font-variant-numeric: tabular-nums;` (Evita jitter visual quando números mudam rapidamente).

### 2.3 Motion Guidelines (Framer Motion)
Nada de "bounces" elásticos. A animação deve ser precisa, técnica e fluida.

```typescript
// src/lib/motion.ts
export const ENTERPRISE_TRANSITION = {
  duration: 0.4,
  ease: [0.15, 0, 0.10, 1], // "The Exponential Smoothing" - Rápido início, fim suave.
};

export const MICRO_INTERACTION = {
  scale: 0.98,
  transition: { duration: 0.1 }
};
```

---

## 3. Arquitetura de Rotas e Layouts

### 3.1 Mapeamento de Layouts
Utilizar o padrão de `Outlet` do React Router com Layout Wrappers.

1.  **`PublicLayout`**:
    *   *Rotas:* `/`, `/market/*`, `/auth/*`, `/terms`.
    *   *Estrutura:* Navbar Transparente (Sticky), Footer completo.
2.  **`AppLayout`**:
    *   *Rotas:* `/app/*` (Dashboard, Vault, Games, Rewards).
    *   *Estrutura:* Sidebar Fixa (Desktop) / Bottom Nav (Mobile), Topbar com Saldos e User Menu.
    *   *Guard:* `RequireAuth`.
3.  **`AdminLayout`**:
    *   *Rotas:* `/admin/*`.
    *   *Estrutura:* Sidebar compacta, foco em Data Tables.
    *   *Guard:* `RequireRole('ADMIN')`.

### 3.2 Route Guards (Segurança)
Implementar HOCs ou Wrappers para proteção de rotas.

```tsx
// Exemplo conceitual
<Route element={<RequireAuth allowedRoles={['USER', 'AFFILIATE']} />}>
  <Route path="/app" element={<AppLayout />}>
    {/* ... rotas filhas ... */}
  </Route>
</Route>
```

---

## 4. Padronização de Componentes e Estados

### 4.1 Interface de Estado Assíncrono
Todo componente que busca dados deve implementar esta interface para consistência visual.

```typescript
interface DataViewProps<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}
```

### 4.2 Componentes Base (Implementação Shadcn/UI Customizada)

1.  **`ProductCard`**:
    *   *Props:* `image`, `title`, `priceUsdt`, `bonusCoins`, `rarity`.
    *   *Variantes:* `Catalog` (Vertical), `Cart` (Horizontal).
    *   *Behavior:* Hover deve elevar (`y: -4px`) e acender borda com a cor da Raridade.

2.  **`BalancePill`**:
    *   *Props:* `currency` ('VAULT' | 'USDT'), `value`, `showHidden`.
    *   *Visual:* Container com background `surface`, borda sutil `border-white/10`. Ícone à esquerda, valor mono à direita.

3.  **`FeedbackToast`**:
    *   Deve suportar promises (loading -> success/error).
    *   *Uso:* Transações on-chain. "Confirmando transação..." -> "Sucesso! NFT Adicionado."

---

## 5. Instrumentação & Telemetria

Para cada interação crítica, disparar evento para o provedor de analytics (ex: PostHog/Google Analytics).

### 5.1 Schema de Eventos
```typescript
type AnalyticsEvent = 
  | { name: 'ui_checkout_started'; properties: { itemId: string; price: number } }
  | { name: 'ui_game_session_start'; properties: { gameId: string; wager: number } }
  | { name: 'ui_withdrawal_request'; properties: { amount: number; method: 'POLYGON' } };

// Hook de uso
const { track } = useAnalytics();
track('ui_checkout_started', { itemId: 'box-01', price: 50 });
```

---

## 6. Checklist de Acessibilidade (WCAG 2.1 AA)

1.  **Contraste:** Texto `zinc-400` sobre `black` deve ser usado apenas para labels secundárias. Texto de leitura deve ser `zinc-100` ou `white`.
2.  **Foco:** Todos os elementos interativos (`button`, `a`, `input`) devem ter um estado de `:focus-visible` com `ring-2 ring-emerald-500`.
3.  **ARIA:**
    *   Saldos que atualizam dinamicamente devem ter `aria-live="polite"`.
    *   Ícones decorativos devem ter `aria-hidden="true"`.
    *   Botões de ícone (sem texto) devem ter `aria-label`.

---

## 7. Próximos Passos Imediatos para o Time

1.  Atualizar `tailwind.config.ts` com os novos tokens de cor.
2.  Criar o componente `AppLayout` separando a Sidebar e a Topbar.
3.  Implementar o `RequireAuth` guard conectado ao Store de Auth.
4.  Refatorar `ProductCard` para usar a nova tipografia e tokens de cor.