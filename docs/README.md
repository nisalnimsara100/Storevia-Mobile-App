# Storevia Docs

- **[design.md](./design.md)** — the design system: color/type/spacing tokens, component specs (`Button`, `Input`, `ProductCard`, etc.), and the rules for using them. Start here for anything visual.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — folder structure, routing (Expo Router), state management (Zustand + Context split), and the data-fetching pattern. Start here for anything structural.
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** — project-specific conventions on top of ESLint/Prettier: component reuse, styling rules, hooks rules, route hygiene.
- **[QA_REPORT.md](./QA_REPORT.md)** — the 2026-08 full-codebase audit: what was found, what was fixed, and what's deliberately left as scoped follow-up work.
- **[THEME_AUDIT.md](./THEME_AUDIT.md)** — follow-up audit focused specifically on theme-token consistency (colors, font sizes, Tailwind config gaps).

## Before opening a PR

```bash
npx tsc --noEmit
npx expo lint
npx prettier --check .
```
