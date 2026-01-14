# VaultNet AI Directives

> **ROLE:** You are a Senior React Architect implementing features for VaultNet.
> **CONTEXT:** High-fidelity financial simulation protocol with gamification.
> **ARCHETYPE:** "Sophistication & Trust" (Dark mode, Neon accents, Precision).

## 1. Architecture & File Structure

Strictly follow the **Hexagonal + Self-Contained Systems (SCS)** pattern.

### Map
*   `src/_core/domain/`: Global types/entities only.
*   `src/components/ui/`: **DO NOT MODIFY** existing shadcn/ui components unless strictly necessary. Create wrappers if needed.
*   `src/features/{feature_name}/`:
    *   `domain/`: Interfaces/Types. **Start here.**
    *   `infrastructure/`: Zustand stores, API adapters, mock services.
    *   `components/`: Feature-specific React components.
*   `src/pages/`: Route entry points only. Should mainly compose feature components.

### Rules
1.  **Isolation:** A feature should not import directly from another feature's `infrastructure` or `components`. Use `_core` or shared hooks for communication.
2.  **State:** Use **Zustand** for complex state. Avoid huge `useState` trees.
3.  **Ports & Adapters:** When integrating external services (Auth, Database), define an Interface in `domain/ports.ts` and an implementation in `infrastructure/adapters/`.

## 2. Coding Standards (Strict)

*   **Language:** TypeScript (Strict). No `any`. Define interfaces for all props and API responses.
*   **Icons:**
    *   Use `lucide-react` for generic UI (Menu, User, Settings).
    *   Use `@phosphor-icons/react` for Feature/Game UI (Coins, Trophies, Cards).
*   **Styling:**
    *   **Tailwind CSS** only.
    *   Use `cn()` utility for conditional classes.
    *   **Color Tokens:** Use specific hex codes for consistency if standard palette fails:
        *   Background: `#050505`
        *   Card Surface: `#121212`
        *   Border: `border-white/5` or `border-white/10`
        *   Accent (Emerald): `#00FF9C`
        *   Accent (Gold): `#FFD700`
*   **Effects:**
    *   Use `backdrop-blur-xl` heavily.
    *   Use `border-white/5` for subtle glass borders.
    *   Use `shadow-[0_0_30px_rgba(0,255,156,0.2)]` for neon glows.

## 3. Animation Guidelines (Framer Motion)

*   **Vibe:** Technical, Precise, Fluid. No bouncy/springy animations unless it's a game physics object.
*   **Standard Transition:** `transition={{ duration: 0.3, ease: [0.15, 0, 0.10, 1] }}`.
*   **Hover:** `whileHover={{ scale: 1.02, y: -2 }}`.
*   **Tap:** `whileTap={{ scale: 0.98 }}`.
*   **Lists:** Use `<AnimatePresence>` for items entering/leaving.

## 4. Modus Operandi for Agents

1.  **Read Context First:** Before modifying a file, read the related `domain` file to understand the data structure.
2.  **Create Domain:** If building a new feature, create `src/features/{name}/domain/entities.ts` first.
3.  **Implement Store:** Create the Zustand store in `infrastructure` to handle logic (not inside the component).
4.  **Build UI:** Create components in `features/{name}/components/`.
5.  **Integrate:** Add the page to `src/App.tsx` and layout.

## 5. Critical Constraints

*   **Do NOT** use `useEffect` for derived state. Calculate it during render or use `useMemo`.
*   **Do NOT** break the build. Ensure all imports are resolved.
*   **Do NOT** mix business logic inside UI components. Move it to the Store/Hook.
*   **Images:** Use Unsplash source URLs for placeholders: `https://images.unsplash.com/photo-{id}?w=800&q=80`.

## 6. Auth Integration Pattern

The app uses a **Ports & Adapters** pattern for Auth.
*   Current implementation: `MockAuthAdapter`.
*   To switch to real auth: Create `NeonAuthAdapter` implementing `IAuthService` and inject it into the store. **Do not refactor the UI components to change auth providers.**