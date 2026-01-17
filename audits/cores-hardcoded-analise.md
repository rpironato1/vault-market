# Análise de Cores Hardcoded - Baseline Verde

**Data:** 2026-01-17
**Status:** Pendente Correção
**Total Detectado:** ~120 ocorrências
**Violações Reais:** ~95 (79%)
**Exceções Válidas:** ~25 (21%)

---

## Design Tokens Disponíveis

| Token Tailwind | Valor Hex | CSS Variable |
|----------------|-----------|--------------|
| `bg-surface-black` | #050505 | `--surface-black: 0 0% 2%` |
| `bg-surface-card` | #121212 | `--surface-card: 0 0% 7%` |
| `bg-surface-elevated` | #151515 | `--surface-elevated: 240 2% 8%` |
| `bg-surface-input` | #171717 | `--surface-input: 0 0% 9%` |
| `text-accent-emerald` / `bg-accent-emerald` | #00FF9C | `--accent-emerald: 156 100% 50%` |
| `hover:bg-accent-emerald-hover` | #00e68d | `--accent-emerald-hover: 156 100% 45%` |
| `text-prestige-gold` / `bg-prestige-gold` | #FFD700 | `--prestige-gold: 51 100% 50%` |
| `text-danger-neon` / `bg-danger-neon` | #FF007F | `--danger-neon: 330 100% 50%` |
| `shadow-glow-emerald` | - | `0 0 20px rgba(0, 255, 156, 0.3)` |
| `shadow-glow-gold` | - | `0 0 20px rgba(255, 215, 0, 0.3)` |
| `shadow-glow-danger` | - | `0 0 20px rgba(255, 0, 127, 0.3)` |

---

## CORES QUE DEVEM SER CORRIGIDAS (~95 ocorrências)

### Prioridade ALTA - Surface Colors (~40 ocorrências)

| Arquivo | Cor Atual | Token Correto |
|---------|-----------|---------------|
| `src/pages/Index.tsx` | `#09090b` | `bg-surface-black` |
| `src/pages/Home.tsx` | `#09090b` | `bg-surface-black` |
| `src/pages/Tokens.tsx` | `#121212`, `#1a1a1a` | `bg-surface-card`, `bg-surface-elevated` |
| `src/pages/Profile.tsx` | `#121212` | `bg-surface-card` |
| `src/components/layout/LandingLayout.tsx` | `#09090b` | `bg-surface-black` |
| `src/features/dashboard/presentation/pages/DashboardPage.tsx` | `#0A0A0A` | `bg-surface-black` |
| `src/features/dashboard/presentation/components/RecentActivity.tsx` | `#0A0A0A`, `#0F0F0F` | `bg-surface-black`, `bg-surface-elevated` |
| `src/features/dashboard/presentation/components/BalanceCards.tsx` | `#0F0F0F`, `#111111` | `bg-surface-elevated`, `bg-surface-card` |
| `src/features/dashboard/presentation/components/ActionShortcuts.tsx` | `#151515` | `bg-surface-elevated` |
| `src/features/admin/presentation/pages/AdminWithdrawalsPage.tsx` | `#0A0A0A`, `#0F0F0F` | `bg-surface-black`, `bg-surface-elevated` |
| `src/features/withdrawals/components/WithdrawalHistory.tsx` | `#121212` | `bg-surface-card` |
| `src/features/vault/components/VaultItemCard.tsx` | `#121212`, `#1a1a1a` | `bg-surface-card`, `bg-surface-elevated` |
| `src/features/landing-marketplace/components/HeroMarketplace.tsx` | `#09090b` | `bg-surface-black` |
| `src/features/landing-marketplace/components/GiftCardSection.tsx` | `#09090b` | `bg-surface-black` |
| `src/features/marketing/components/BannerRotator.tsx` | `#121212` | `bg-surface-card` |
| `src/features/rewards/components/RewardList.tsx` | `#121212` | `bg-surface-card` |
| `src/features/settings/components/SettingsForm.tsx` | `#121212` | `bg-surface-card` |

### Prioridade ALTA - Prestige Gold (~25 ocorrências)

| Arquivo | Cor Atual | Token Correto |
|---------|-----------|---------------|
| `src/features/withdrawals/components/WithdrawalForm.tsx` | `#FFD700`, `#ffdf33` | `text-prestige-gold`, `hover:text-prestige-gold` |
| `src/features/rewards/components/RewardStats.tsx` | `#FFD700`, `#ffe033` | `text-prestige-gold`, `bg-prestige-gold` |
| `src/features/vault/components/VaultItemCard.tsx` | `#FFD700` | `text-prestige-gold` |
| `src/features/landing-marketplace/components/BoxGrid.tsx` | `#FFD700` | `text-prestige-gold`, `border-prestige-gold` |
| `src/features/dashboard/presentation/components/BalanceCards.tsx` | `#FFD700` | `text-prestige-gold` |
| `src/features/admin/presentation/components/AdminStats.tsx` | `#FFD700` | `text-prestige-gold` |
| `src/features/rewards/components/RewardModal.tsx` | `#FFD700` | `text-prestige-gold` |
| `src/pages/Tokens.tsx` | `#FFD700` | `text-prestige-gold` |

### Prioridade ALTA - Accent Emerald (~15 ocorrências)

| Arquivo | Cor Atual | Token Correto |
|---------|-----------|---------------|
| `src/features/landing-marketplace/components/HeroMarketplace.tsx` | `#00FF9C`, `#00e68d` | `text-accent-emerald`, `hover:text-accent-emerald-hover` |
| `src/features/rewards/components/RewardModal.tsx` | `#00FF9C` | `text-accent-emerald` |
| `src/features/landing-marketplace/components/LiveTicker.tsx` | `#00FF9C` | `text-accent-emerald` |
| `src/features/dashboard/presentation/components/BalanceCards.tsx` | `#00FF9C` | `text-accent-emerald` |
| `src/features/games/wheel/components/WheelSectors.tsx` | `#00FF9C` | `fill-accent-emerald` |

### Prioridade MÉDIA - Danger Neon (~5 ocorrências)

| Arquivo | Cor Atual | Token Correto |
|---------|-----------|---------------|
| `src/features/landing-marketplace/components/BoxGrid.tsx` | `#FF007F` | `text-danger-neon`, `bg-danger-neon` |
| `src/features/admin/presentation/components/AdminStats.tsx` | `#FF007F` | `text-danger-neon` |

### Prioridade MÉDIA - Transparências (~10 ocorrências)

| Arquivo | Cor Atual | Token Correto |
|---------|-----------|---------------|
| Vários | `border-[#FFD700]/30` | `border-prestige-gold/30` |
| Vários | `bg-[#FFD700]/10` | `bg-prestige-gold/10` |
| Vários | `text-[#00FF9C]/80` | `text-accent-emerald/80` |

---

## EXCEÇÕES VÁLIDAS - MANTER (~25 ocorrências)

### SVG Gradients (4 ocorrências) - MANTER

**Justificativa:** Gradientes SVG requerem valores hex diretos em `<stop>` elements. Tailwind não suporta.

| Arquivo | Código |
|---------|--------|
| `src/features/games/wheel/components/DailyPulse.tsx` | `<stop offset="0%" stopColor="#1a1a1a" />` |
| `src/features/affiliates/components/PartnerDashboard.tsx` | `<stop offset="5%" stopColor="#10b981" />` |

### Canvas/Confetti (12 ocorrências) - MANTER

**Justificativa:** Canvas API e bibliotecas de terceiros (recharts, canvas-confetti) requerem valores RGB/hex inline.

| Arquivo | Código |
|---------|--------|
| `src/features/games/wheel/components/DailyPulse.tsx` | `colors: ['#FFD700', '#FF007F', '#FFFFFF']` (confetti) |
| `src/features/games/crash/components/CrashDisplay.tsx` | Canvas gradients + stroke inline |
| `src/components/ui/chart.tsx` | Configuração recharts inline |
| `src/features/affiliates/components/PartnerDashboard.tsx` | Recharts theme inline |

### Cores de Marca Oficiais (4 ocorrências) - MANTER

**Justificativa:** Cores oficiais de logos de marcas não devem ser alteradas.

| Arquivo | Marca | Cor |
|---------|-------|-----|
| `src/features/landing-marketplace/components/GiftCardSection.tsx` | Amazon | `#FF9900` |
| `src/features/landing-marketplace/components/GiftCardSection.tsx` | Spotify | `#1DB954` |
| `src/features/landing-marketplace/components/GiftCardSection.tsx` | Netflix | `#E60012` |
| `src/features/landing-marketplace/components/GiftCardSection.tsx` | Apple | (cinza) |

### App.css Legacy (3 ocorrências) - DELETAR ARQUIVO

**Justificativa:** Arquivo não utilizado na aplicação (demos Vite).

| Arquivo | Ação |
|---------|------|
| `src/App.css` | Deletar completamente |

### Falsos Positivos (6 ocorrências) - IGNORAR

**Justificativa:** Não são cores CSS, são IDs ou strings literais.

| Arquivo | Código |
|---------|--------|
| `src/features/admin/presentation/pages/AdminLivePage.tsx` | `'Game session #8821 started'` |

---

## RESUMO EXECUTIVO

| Categoria | Quantidade | Ação |
|-----------|------------|------|
| **CORRIGIR** | ~95 | Substituir por Design Tokens |
| **MANTER** (SVG/Canvas) | ~16 | Justificado tecnicamente |
| **DELETAR** (App.css) | 3 | Remover arquivo |
| **IGNORAR** (Falsos positivos) | 6 | Não são cores |
| **TOTAL** | ~120 | - |

---

## ARQUIVOS POR PRIORIDADE DE CORREÇÃO

### 🔴 ALTA PRIORIDADE (>5 ocorrências por arquivo)

1. `src/features/withdrawals/components/WithdrawalForm.tsx` - 7 ocorrências
2. `src/features/rewards/components/RewardStats.tsx` - 6 ocorrências
3. `src/features/dashboard/presentation/components/BalanceCards.tsx` - 5 ocorrências
4. `src/features/landing-marketplace/components/HeroMarketplace.tsx` - 5 ocorrências
5. `src/features/landing-marketplace/components/BoxGrid.tsx` - 4 ocorrências
6. `src/features/dashboard/presentation/components/RecentActivity.tsx` - 4 ocorrências

### 🟡 MÉDIA PRIORIDADE (2-4 ocorrências por arquivo)

7. `src/pages/Tokens.tsx` - 4 ocorrências
8. `src/features/vault/components/VaultItemCard.tsx` - 4 ocorrências
9. `src/features/admin/presentation/pages/AdminWithdrawalsPage.tsx` - 3 ocorrências
10. `src/features/rewards/components/RewardModal.tsx` - 3 ocorrências
11. `src/features/landing-marketplace/components/GiftCardSection.tsx` - 3 ocorrências (1 marca)
12. `src/features/dashboard/presentation/components/ActionShortcuts.tsx` - 2 ocorrências
13. `src/features/admin/presentation/components/AdminStats.tsx` - 2 ocorrências

### 🟢 BAIXA PRIORIDADE (1 ocorrência por arquivo)

14-35. Demais arquivos com 1 ocorrência cada

---

## PRÓXIMOS PASSOS

1. **Aprovar** esta análise
2. **Delegar** correção por grupos de prioridade
3. **Re-auditar** após correções
4. **Deletar** `src/App.css`

---

*Documento gerado em 2026-01-17 pelo orquestrador-tarefas*
