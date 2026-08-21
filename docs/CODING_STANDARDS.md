# Coding Standards

Project-specific conventions, on top of what the toolchain already enforces automatically. Run all three before opening a PR — CI/hooks assume they pass:

```bash
npx tsc --noEmit
npx expo lint
npx biome check .
npx prettier --check .
```

**Why three linters:** each catches something the others don't. `eslint-config-expo` has the React Native/Expo/`react-hooks` rules (the ones that caught a real hooks-rules-violation bug in this codebase — Biome doesn't have an RN-aware hooks plugin, so `useExhaustiveDependencies`/`useHookAtTopLevel` are turned off in `biome.json` to avoid duplicate/conflicting reports). Biome is much faster and catches things ESLint's default config doesn't emphasize as strongly — unused imports/variables, stray `console.log`s, dynamic namespace access. Prettier remains the formatter (including Tailwind class sorting via `prettier-plugin-tailwindcss`); Biome's own formatter is disabled in `biome.json` for that reason — two formatters fighting over the same files is worse than one.

## Component reuse

- Check `components/ui/` (`Button`, `Input`, `Badge`, `StarRating`, `ProductCard`, `ScreenHeader`, `EmptyState`, `AppModal`, `Skeleton`/`Spinner`, `toast`) before writing a new `TouchableOpacity`/`TextInput`/card layout. If none fits, it's fine to write screen-local UI — but if you're about to copy an existing screen's header, empty-state, or card markup verbatim, add a prop to the shared component instead of copy-pasting. Copy-pasting the same 20-line header block across 9 screens is exactly how `components/ui/ScreenHeader` needed inventing in the first place.
- One-off components used by exactly one screen belong next to that screen (`app/components/item_details/*` for the product detail page), not in `components/ui/`. Promote to `components/ui/` only once a second screen needs the same thing.

## Styling

- No raw hex codes in new component/screen code — reference a token (`theme.color.*` for `StyleSheet`, `bg-primary-500`/`text-neutral-900` etc. for NativeWind `className`). See [design.md](./design.md) for the full token table and the rationale (this codebase previously had 190+ raw hex values and 4 duplicate card implementations before the design system existed).
- Don't introduce `react-native-size-matters` (`scale`/`verticalScale`/`moderateScale`) in new code outside the `ProductCard` `flashsale` variant — it's the one deliberate exception in design.md. Everywhere else, use fixed token values.
- **Always pair `fontWeight` with the matching Poppins `fontFamily` — in both `StyleSheet`/inline styles _and_ NativeWind `className`.** Poppins ships as separate `.ttf` files per weight, not a variable font, so `fontWeight` alone (`fontWeight: '700'`, or NativeWind's `font-bold`/`font-semibold`/`font-medium`/`font-light`) only asks the OS to synthetically bold/adjust the _system_ font — it does nothing to select a Poppins weight file. This was, at one point, true for nearly the entire app outside `components/ui/` (~183 `StyleSheet` instances, 56 `className` instances — see `THEME_AUDIT.md` pass 3) before being fixed project-wide. Concretely:
  - `StyleSheet`/inline style: every `fontWeight: 'X'` needs a sibling `fontFamily: 'PoppinsY'` in the _same_ style object (`'600'`→`PoppinsSemiBold`, `'700'`/`'bold'`→`PoppinsBold`, `'500'`→`PoppinsMedium`, `'400'`/`'normal'`→`PoppinsRegular`; this app only bundles Regular/Medium/SemiBold/Light/Bold, so an `'800'`/`'900'`/ExtraBold/Black request has no real weight to map to — use `PoppinsBold`, the closest one actually shipped).
  - NativeWind `className`: use `font-poppinsBold`/`font-poppinsSemiBold`/`font-poppinsMedium`/`font-poppinsLight` — **not** Tailwind's generic `font-bold`/`font-semibold`/`font-medium`/`font-light`, which only sets `font-weight` and does nothing to `font-family`. (Text with no font utility at all now falls back to `PoppinsRegular` via `tailwind.config.js`'s `fontFamily.sans` override, rather than the system font — but an explicit `font-poppinsX` class is still preferred over relying on that default when you know the weight you want.)

## React / hooks

- `useEffect`/`useCallback`/`useMemo` dependency arrays must be exhaustive (`react-hooks/exhaustive-deps` is not disabled in this repo's ESLint config). If a value genuinely shouldn't retrigger the effect, wrap it in `useCallback`/`useMemo` at its source rather than omitting it from the array — omitting silences the warning without fixing the staleness it's warning about.
- Hooks (`useState`, `useEffect`, etc.) may only be called from a component or another hook — never from a plain function called during render (e.g. inside `.map()`). If you need per-item local state in a list, extract a small named component and render it as JSX (`<Countdown endsAt={...} />`), not call it as a function (`{renderCountdown(...)}`).
- Prefer deleting genuinely dead code (unused state, unused handlers, orphaned routes nothing links to) over leaving it commented out or unused. If something is intentionally paused rather than dead (e.g. a feature hidden behind a flag with a note explaining why), say so in a comment — that's the difference between "hidden for now" and "forgotten."

## Data fetching

- Screens fetch directly (`fetch(`${EXPO_PUBLIC_APP_BASE_URL}/api/...}`)`) inside `useCallback`, with local `loading`/`error` state — see `ARCHITECTURE.md`. Keep new screens consistent with this until/unless the app adopts a shared data-fetching layer app-wide; don't introduce a second fetching convention alongside it for just one screen.
- Remove debug `console.log`s before merging. `console.error` in a `catch` block for real error reporting is fine and expected; a `console.log` left over from developing a feature is not.
- **New `EXPO_PUBLIC_*` env vars must be pushed to EAS, not just added to local `.env`.** This app crashed on launch on every real device the first time it was built via EAS, because the `preview` environment had no env vars configured at all — Firebase silently failed to initialize (caught, logged, but left `auth = null`), and `authContext.tsx` crashed calling `onAuthStateChanged(null, ...)` on app mount. Run `eas env:push <environment> --path .env --force` for `preview`, `production`, and `development` after adding or changing anything in `.env`. See `UI_AND_RELEASE_FIXES.md` for the full trace.
- Code that depends on Firebase (or any other service requiring env-var config) shouldn't just `console.warn` and move on when init fails — that leaves a null object other code will call methods on unconditionally. If init can fail, downstream code needs an explicit null check that degrades gracefully (see `authContext.tsx`'s `if (!auth) { ...; return; }` guard) rather than assuming the try/catch elsewhere already made it safe.

## Safe area

- A screen's `SafeAreaView` background color must match whatever sits at the very top of the screen (the header), not the page body — the `SafeAreaView`'s own background fills the status-bar inset, so a mismatch shows as a visible color seam right below the status bar. If the header is full-bleed and a different color than the rest of the page (a colored/branded header bar, e.g. orange), don't let `SafeAreaView` handle the `top` edge at all — instead read `useSafeAreaInsets()` and add `insets.top` as extra padding directly on the header element, so its own color/gradient extends up behind the status bar. If the header is white/neutral and matches the page's general palette, it's simpler to just set `SafeAreaView`'s background to match it and move any page-specific body color (e.g. a gray background behind white cards) onto the scrollable content below the header instead. See `UI_AND_RELEASE_FIXES.md` for the 12 screens this was fixed on and worked examples of both patterns.

## Status bar

- Status bar icon color (`dark`/`light`) is controlled centrally in `app/_layout.tsx` via a `usePathname()`-driven effect, not per-screen `<StatusBar>` components. Declaring `<StatusBar style="light" />` inside an individual screen looks correct but silently breaks on tab screens — React Navigation's bottom-tabs keeps inactive tabs mounted, so a declarative `<StatusBar>` only fires once, on first visit, and doesn't re-assert itself on later tab switches. If a new screen needs light (white) status bar icons — a full-bleed colored/dark header — add its route path to the `LIGHT_STATUS_BAR_ROUTES` set in `app/_layout.tsx`. Don't add a `<StatusBar>` component to the screen itself.

## Routes

- A screen under `app/` only exists if something links to it. Before deleting or renaming a screen, search for **every** way its path could be referenced, not just quoted string literals — `router.push('/path')`, `Link href="/path"`, **and** template-literal forms like ``router.push(`/path?param=${x}`)``, which a plain string grep misses. This is not hypothetical: `app/search/index.tsx` was deleted as "orphaned" during an earlier cleanup because a grep for quoted `'/search'` found nothing — but `Home.tsx` and `search_screen/index.tsx` both navigated to it via ``router.push(`/search?param=...`)``, a template literal the grep never matched. The route was broken until the next `tsc` run caught the resulting type error (`expo-router`'s typed routes flagged the now-nonexistent path) and it had to be restored. Prefer `grep -rn "/search"` (the bare path, no quote characters) over a quote-anchored pattern, and always re-run `tsc --noEmit` after removing a route — typed routes will catch what a grep misses.

## Tooling notes

- `tsconfig.json` uses `"jsx": "react-jsx"` (the automatic runtime), matching `babel-preset-expo`'s actual default at bundle time. `import React from 'react'` is only needed in a file if it calls `React.something` directly (e.g. `React.useState`, `React.Fragment`) — not just to make JSX compile.
