# Size & Tooling Optimization — 2026-08

## The "150MB+" question

The repo's working tree is ~729MB, but **711MB of that is `node_modules`** — gitignored, dev-machine-only, and irrelevant to shipped app size (Metro only bundles what's actually imported; native dependencies compile into the iOS/Android build, not the JS bundle). It is normal for an Expo/React Native project with this many native modules.

What actually matters — the tracked repo (what gets cloned, and roughly what's available to bundle) — was **7.4MB**. After this pass, it's **2.8MB**. `node_modules` also dropped from 711MB → 667MB after removing unused dependencies (below).

## Assets removed (confirmed zero references before deleting)

- `assets/ss/` — 3 debug screenshots (2.3MB), never referenced in code.
- `assets/icons/` — 7 unused icon variant files (28KB).
- `assets/images/react-logo*.png`, `partial-react-logo.png` — `create-expo-app` template leftovers (56KB), unused (this app has its own icon/branding).
- `assets/images/shoes.png` — unused product mockup (88KB).
- 13 unused Poppins font weight files (~2MB) — `app/_layout.tsx` only loads 5 weights (Regular, Medium, Light, SemiBold, Bold) via `useFonts`; the Thin/ExtraLight/ExtraBold/Black weights and every Italic variant were bundled but never loaded.
- Renamed `assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg` → `placeholder.jpg` (it's a real, used placeholder product image across 5 files — just badly named from being dragged in from a phone).

## Dependencies removed (confirmed zero imports, not an Expo config plugin, not a babel-registered plugin)

`expo-symbols`, `expo-status-bar`, `expo-linking` (default Expo-template dependencies, never imported, not used as config plugins), `react-native-dotenv` (babel plugin never registered in `babel.config.js` — this app uses Expo's native `EXPO_PUBLIC_*` env var mechanism instead), `react-native-radio-buttons-group` (unused UI lib), `react-hot-toast` (a **web** toast library — wrong platform for this app; `react-native-toast-message` is the one actually used, via `components/ui/Toast.ts`), `lucide-react` (the web version of the icon library — `lucide-react-native`, the correct RN version, is what's actually imported).

Distinguishing these from _actually-required-but-not-directly-imported_ packages (`react-native-reanimated`, `react-native-gesture-handler`, `@react-navigation/bottom-tabs`, `@react-navigation/elements`, `react-native-vector-icons`, `expo-dev-client`, `expo-system-ui`, `react-native-web`, `react-dom`) mattered here — those are peer/transitive dependencies of things this app does use (`@react-navigation/native`, `expo-router`'s `Tabs`, `@expo/vector-icons`, custom dev-client builds, the web target) and removing them would have broken the build despite showing "0 direct imports" in a naive grep.

## Config fixes

- **`tsconfig.json`: `"jsx": "react"` → `"jsx": "react-jsx"`.** This was a real mismatch, not cosmetic: `babel-preset-expo` (what Metro actually uses to compile JSX at bundle time) has defaulted to the automatic JSX runtime since Expo SDK 43-ish, but `tsconfig.json` still told the type-checker to require the classic runtime — meaning every file needed `import React from 'react'` just to satisfy `tsc`, even though the actual bundler didn't need it. Fixing this made ~60 files' `React` default import genuinely dead code (see below), and now `tsc` matches what Metro actually does.
- **`app.json`: removed a duplicated `CFBundleURLTypes` entry** in the iOS `infoPlist` (the same Google OAuth URL scheme was listed twice). Harmless but redundant.
- **`.gitignore`: removed the `package-lock.json` line.** It was listed as ignored while simultaneously being tracked in git (568KB) — a dead, contradictory rule. This project uses npm; the lockfile should be tracked for reproducible installs across machines/CI, so the ignore rule (not the tracking) was the mistake.

## Biome added

Added `@biomejs/biome` as a fast linter (formatter left disabled — Prettier stays the formatter, including its Tailwind-class-sorting plugin, since running two formatters against the same files causes churn). Configuration is in `biome.json`; see `docs/CODING_STANDARDS.md` for why three lint/format tools coexist and what each one is responsible for.

Running it (`npm run biome`) after the `tsconfig.json` jsx fix surfaced and fixed, across ~60 files:

- Genuinely-unused `import React from 'react'` (now safe to remove — see the tsconfig fix above).
- Unused imports/variables from earlier refactors.
- Debug `console.log`s (kept `console.error`/`console.warn` — those are real error reporting, not left-over debugging). This caught a meaningful amount in `app/context/authContext.tsx` specifically, which was logging emails and auth tokens to the console — worth being aware of from a data-hygiene standpoint even in dev builds.
- Two response bodies parsed via `response.json()` and assigned to a variable that was then never used (`chat_screen/[chatId].tsx`, `checkout_screen/index.tsx`) — simplified to just `await response.json()` since the parse is presumably needed to fully consume the response, but the value itself isn't used.
- One empty `catch {}` block in `Home.tsx` that had silently swallowed product-load failures after its `console.log` was correctly flagged and removed — restored proper `console.error` logging so failures are at least visible in dev tools instead of silent.

## A regression caught during this pass (not introduced by this pass's changes, but by an earlier session)

While re-running `tsc` after the asset cleanup, four new type errors appeared: `router.push(\`/search?param=...\`)`calls in`Home.tsx`and`search_screen/index.tsx`referencing a route,`/search`, that didn't exist. In an earlier cleanup session, `app/search/index.tsx` had been deleted as an "orphaned route" — but the grep used to confirm it was orphaned only matched quoted string literals (`'/search'`, `"/search"`), not the template-literal form (`` `/search?param=${x}` ``) actually used at all 4 call sites. The file was in fact the search **results** screen (distinct from `search_screen`, which is the search **input** screen with suggestions/history) — deleting it broke the second half of the search flow.

Restored `app/search/index.tsx` from git history, rebuilt on current conventions (shared `ProductCard` instead of the now-deleted duplicate component it originally imported, no debug logs, proper hook deps). `docs/CODING_STANDARDS.md`'s Routes section now calls out the template-literal grep gap explicitly so it isn't repeated.
