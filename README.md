# VaultNet Protocol

> **Simulação Econômica Descentralizada & Gamificação de Ativos**

O VaultNet é uma aplicação React de alta fidelidade que simula um protocolo de validação de ativos digitais. O projeto combina estética de finanças corporativas (Enterprise Fintech) com mecânicas de jogos (Loot Boxes, Apostas, Mineração), utilizando uma arquitetura robusta e escalável.

## 🛠 Tech Stack

- **Core:** React 18, TypeScript, Vite.
- **Estilização:** Tailwind CSS, Tailwind Merge, CLSX.
- **Animações:** Framer Motion (Orquestração complexa e micro-interações).
- **Gerenciamento de Estado:** Zustand (Stores globais e persistência).
- **Roteamento:** React Router DOM v6.
- **Componentes:** Shadcn/UI (Radix Primitives), Lucide React & Phosphor Icons.
- **Efeitos:** Canvas Confetti.

## 📐 Arquitetura do Sistema

O projeto segue uma abordagem híbrida de **Arquitetura Hexagonal** aplicada ao frontend, organizada via **Self-Contained Systems (SCS)**.

### Estrutura de Diretórios

```bash
src/
├── _core/                  # Entidades e interfaces compartilhadas globalmente
├── _infrastructure/        # Implementações globais (Stores, API Clients)
├── components/             # Componentes de UI genéricos (Design System)
├── features/               # Módulos Funcionais Autocontidos
│   ├── auth/               # Autenticação (Login, Register, OTP)
│   ├── games/              # Motores de jogo (Mines, Crash, Plinko, Wheel)
│   ├── gift-cards/         # Módulo de Gift Cards com lógica de lucro garantido
│   ├── marketplace/        # Venda de Loot Boxes
│   └── vault/              # Inventário do usuário
├── pages/                  # Composições de páginas (Roteamento)
└── lib/                    # Utilitários puros
```

### Padrão de Feature (SCS)
Cada pasta em `src/features/` deve conter:
1.  **domain/**: Tipos, Entidades e Interfaces (Regras de Negócio Puras).
2.  **infrastructure/**: Stores (Zustand), Adaptadores e Serviços.
3.  **components/**: Componentes React específicos da feature.

## 🎨 Design System & UI/UX

O design segue a diretriz **"Sophistication & Trust"**.

### Paleta de Cores
- **Background:** `#050505` (Deep Black) a `#121212` (Surface).
- **Primary/Accent:** `#00FF9C` (Emerald Neon) - Usado para sucesso, dinheiro e ações primárias.
- **Prestige:** `#FFD700` (Gold) - Usado para itens lendários e VIP.
- **Danger:** `#FF0055` ou `#EF4444` - Usado para erros e estados críticos (Crash).

### Tipografia
- **Interface:** Sans-serif (Inter/Geist) - Legibilidade.
- **Dados/Valores:** Monospace - Para saldos, hashes, IDs e multiplicadores. Use `tabular-nums` para evitar saltos visuais.

### Diretrizes de Animação
Utilize **Framer Motion** para todas as interações.
- **Transições de Página:** Suaves, sem saltos bruscos.
- **Micro-interações:** `scale: 0.98` no clique (active).
- **Easing:** Prefira `[0.15, 0, 0.10, 1]` (Curva "exponencial" técnica) em vez de `spring` ou `bounce`. O sistema deve parecer uma ferramenta financeira precisa, não um brinquedo.

## 🚀 Features Implementadas

1.  **Auth System:**
    *   Login (Email/Google Mock).
    *   Registro com validação OTP simulada.
    *   Arquitetura de Portas/Adaptadores preparada para Neon Auth.
2.  **Marketplace:**
    *   Compra de Loot Boxes com tiers (Common a Legendary).
    *   Animações de abertura imersivas (Near Miss, 3D Spin).
3.  **Games Center:**
    *   **Mines:** Lógica de campo minado com multiplicador progressivo.
    *   **Wheel (Daily Pulse):** Roleta diária com física simulada via SVG.
    *   **Plinko:** Física de partículas e colisão em Canvas 2D.
    *   **Crash:** Gráfico SVG em tempo real com curva exponencial.
4.  **Gift Cards:**
    *   Sistema de "Lucro Garantido" (Valor do card + Moedas > Preço).
    *   Integração com inventário.

## 📦 Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🤝 Contribuição

Ao criar novos componentes, verifique sempre se eles pertencem ao **Design System Global** (`src/components/ui`) ou se são específicos de uma **Feature** (`src/features/*/components`). Não acople lógica de negócio diretamente nos componentes de UI.