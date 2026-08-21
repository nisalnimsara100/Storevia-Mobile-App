# Storevia Docs

- **[design.md](./design.md)** — the design system: color/type/spacing tokens, component specs (`Button`, `Input`, `ProductCard`, etc.), and the rules for using them. Start here for anything visual.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — folder structure, routing (Expo Router), state management (Zustand + Context split), and the data-fetching pattern. Start here for anything structural.
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** — project-specific conventions on top of ESLint/Prettier: component reuse, styling rules, hooks rules, route hygiene.
- **[QA_REPORT.md](./QA_REPORT.md)** — the 2026-08 full-codebase audit: what was found, what was fixed, and what's deliberately left as scoped follow-up work.
- **[THEME_AUDIT.md](./THEME_AUDIT.md)** — theme-token consistency: colors (pass 2) and, in the largest section, `fontFamily` not resolving to Poppins almost anywhere in the app (pass 3) — root cause, the fix, and what's still open (font _size_).
- **[OPTIMIZATION.md](./OPTIMIZATION.md)** — repo/dependency size audit, Biome setup, config fixes, and a routing regression caught and fixed during the pass.
- **[RESPONSIVE_AUDIT.md](./RESPONSIVE_AUDIT.md)** — cross-device audit: safe-area handling, `Dimensions` vs `useWindowDimensions`, tablet layout gaps.
- **[UI_AND_RELEASE_FIXES.md](./UI_AND_RELEASE_FIXES.md)** — safe-area background mismatches, status bar icon color, emoji-as-icons cleanup, a real launch crash caught while producing release builds, and notes on building locally (Android/iOS) vs. via EAS in this environment.

## Before opening a PR

```bash
npx tsc --noEmit
npx expo lint
npx biome check .
npx prettier --check .
```
