# UI Spec — Landing Page (`/`)

**Versão:** 1.0  
**Status:** Pronto para Implementação  
**Contexto:** Primeira impressão do usuário. Deve converter visitantes em exploradores do catálogo, estabelecendo confiança e clareza sobre o modelo econômico único do VaultNet.

---

## 1. Arquitetura da Informação & Layout

A página deve seguir uma narrativa linear vertical, guiando o usuário da curiosidade à compreensão e, finalmente, à ação.

### Estrutura de Seções (Ordem Obrigatória)

1.  **Navbar (PublicLayout)**: Logo, Links rápidos, Botão "Entrar" (Outline), Botão "Começar" (Solid/Accent).
2.  **Hero Section**:
    *   *Visual:* Fundo escuro profundo com "glow" sutil em Emerald/Accent. Tipografia grande e ousada.
    *   *Headline:* Focada em propriedade digital e utilidade.
    *   *Subheadline:* Explicação curta do modelo "Compra = Coins = Prêmios".
    *   *CTA Principal:* Botão grande "Explorar Catálogo".
3.  **Ciclo de Valor ("Como Funciona")**:
    *   *Layout:* 3 Cards ou Passos horizontais com ícones grandes (Phosphor Icons).
    *   *Foco:* Educar sobre o fluxo Compra -> Coins -> Experiência -> Saque.
4.  **Trust Signals ("Por que Confiar")**:
    *   *Layout:* Grid 2x2 ou Faixa horizontal com ícones de segurança (Escudo, Cadeado, Blockchain).
    *   *Dados:* Menção a auditoria, segurança on-chain e transparência.
5.  **FAQ & Footer**:
    *   Accordion para perguntas frequentes (foco em "Isso é seguro?", "Como saco?").
    *   Links legais (Termos, Privacidade).

---

## 2. Copywriting & Tom de Voz (Compliance)

**Regra de Ouro:** Proibido usar "Aposta", "Depósito", "Bet", "Cassino", "Sorte".
**Substituições Obrigatórias:**
*   *Depósito* → **Aquisição de Ativo**
*   *Aposta* → **Alocação em Experiência**
*   *Ganhar* → **Obter Recompensa**
*   *Saldo* → **VaultCoins / USDT Rewards**

### Textos Sugeridos (Wireframe)

**Hero Headline:**
"A Nova Era da Propriedade Digital com Utilidade Real."

**Hero Subhead:**
"Adquira NFTs exclusivos e receba 100% do valor em VaultCoins para desbloquear experiências e recompensas em USDT. Transparência total na Polygon."

**Passo a Passo (Cards):**
1.  **Adquira Ativos:** "Compre NFTs verificados e receba VaultCoins instantaneamente na sua carteira interna."
2.  **Acesse Experiências:** "Use suas VaultCoins para participar de minigames de habilidade e estratégia."
3.  **Resgate Recompensas:** "Converta seu desempenho em USDT e saque diretamente para sua carteira Polygon a qualquer momento."

---

## 3. Estados de Interface

### Estado: Normal (Carregamento Sucesso)
*   Animações de entrada (`framer-motion`) escalonadas para Hero e Cards.
*   Imagens de NFTs no Hero devem ter carregamento "blur-up" ou skeleton se dinâmicas.

### Estado: Offline / Erro de Rede
*   Caso a API de status ou catálogo falhe ao carregar dados dinâmicos (se houver tickers, por exemplo):
    *   **UI:** Exibir banner discreto no topo: "Conexão instável. Alguns dados podem estar desatualizados."
    *   **Ação:** Botão "Recarregar" pequeno ao lado do texto.
    *   **Fallback:** O CTA "Explorar" deve continuar funcionando (navegação client-side para `/market`).

---

## 4. Comportamento dos Componentes (Specs)

### Botões (CTAs)
*   **CTA Primário ("Explorar NFTs"):**
    *   *Cor:* `Accent` (#00FF9C) com texto preto (contraste alto).
    *   *Hover:* `Scale 1.05`, sombra suave colorida (`shadow-emerald`).
    *   *Ação:* `navigate('/market')`.
*   **CTA Secundário ("Entrar"):**
    *   *Cor:* Transparente com borda `White/10` ou `Accent/20`.
    *   *Ação:* `navigate('/auth/login')`.

### Cards de "Como Funciona"
*   Devem ter altura igual (flex-grow).
*   Ícones: `Phosphor Icons` (Weight: Duotone).
    *   Passo 1: `ShoppingCart` ou `Package`.
    *   Passo 2: `GameController` ou `Lightning`.
    *   Passo 3: `Trophy` ou `Wallet`.

---

## 5. Instrumentação (Analytics)

Deve ser implementado um `useEffect` na montagem da página para disparar o evento de visualização e `handlers` nos botões.

```typescript
// Exemplo de implementação lógica
useEffect(() => {
  trackEvent('ui_landing_viewed', { 
    source: document.referrer,
    timestamp: Date.now() 
  });
}, []);

const handleExploreClick = () => {
  trackEvent('ui_landing_cta_market_clicked', { 
    location: 'hero_section' // ou 'footer_section'
  });
  navigate('/market');
};
```

---

## 6. Checklist de Acessibilidade

*   [ ] Todos os botões possuem `aria-label` se usarem apenas ícones (não é o caso aqui, mas bom manter).
*   [ ] Contraste do texto cinza (`text-zinc-400`) sobre fundo preto (`bg-[#050505]`) deve passar em AA.
*   [ ] Ordem de tabulação lógica (Navbar -> Hero CTA -> Cards -> Footer).
*   [ ] Imagens decorativas (background glows) com `aria-hidden="true"`.

---

## 7. Próximos Passos (Dev)

1.  Criar componente `src/features/landing/presentation/pages/LandingPage.tsx`.
2.  Implementar seções como subcomponentes (`HeroSection`, `HowItWorksSection`, `TrustSection`) para manter o código limpo.
3.  Utilizar as constantes de texto em um arquivo separado ou objeto de configuração para facilitar revisão de copy (compliance).