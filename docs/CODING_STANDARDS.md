# Coding Standards

Project-specific conventions, on top of what ESLint/Prettier already enforce automatically. Run `npx expo lint` and `npx prettier --check .` before opening a PR — CI/hooks assume both pass.

## Component reuse

- Check `components/ui/` (`Button`, `Input`, `Badge`, `StarRating`, `ProductCard`, `ScreenHeader`, `EmptyState`, `AppModal`, `Skeleton`/`Spinner`, `toast`) before writing a new `TouchableOpacity`/`TextInput`/card layout. If none fits, it's fine to write screen-local UI — but if you're about to copy an existing screen's header, empty-state, or card markup verbatim, add a prop to the shared component instead of copy-pasting. Copy-pasting the same 20-line header block across 9 screens is exactly how `components/ui/ScreenHeader` needed inventing in the first place.
- One-off components used by exactly one screen belong next to that screen (`app/components/item_details/*` for the product detail page), not in `components/ui/`. Promote to `components/ui/` only once a second screen needs the same thing.

## Styling

- No raw hex codes in new component/screen code — reference a token (`theme.color.*` for `StyleSheet`, `bg-primary-500`/`text-neutral-900` etc. for NativeWind `className`). See [design.md](./design.md) for the full token table and the rationale (this codebase previously had 190+ raw hex values and 4 duplicate card implementations before the design system existed).
- Don't introduce `react-native-size-matters` (`scale`/`verticalScale`/`moderateScale`) in new code outside the `ProductCard` `flashsale` variant — it's the one deliberate exception in design.md. Everywhere else, use fixed token values.
- Pair `fontWeight` with the matching Poppins `fontFamily` — see design.md's Typography section for why (Poppins ships as separate font files per weight, not a variable font).

## React / hooks

- `useEffect`/`useCallback`/`useMemo` dependency arrays must be exhaustive (`react-hooks/exhaustive-deps` is not disabled in this repo's ESLint config). If a value genuinely shouldn't retrigger the effect, wrap it in `useCallback`/`useMemo` at its source rather than omitting it from the array — omitting silences the warning without fixing the staleness it's warning about.
- Hooks (`useState`, `useEffect`, etc.) may only be called from a component or another hook — never from a plain function called during render (e.g. inside `.map()`). If you need per-item local state in a list, extract a small named component and render it as JSX (`<Countdown endsAt={...} />`), not call it as a function (`{renderCountdown(...)}`).
- Prefer deleting genuinely dead code (unused state, unused handlers, orphaned routes nothing links to) over leaving it commented out or unused. If something is intentionally paused rather than dead (e.g. a feature hidden behind a flag with a note explaining why), say so in a comment — that's the difference between "hidden for now" and "forgotten."

## Data fetching

- Screens fetch directly (`fetch(`${EXPO_PUBLIC_APP_BASE_URL}/api/...}`)`) inside `useCallback`, with local `loading`/`error` state — see `ARCHITECTURE.md`. Keep new screens consistent with this until/unless the app adopts a shared data-fetching layer app-wide; don't introduce a second fetching convention alongside it for just one screen.
- Remove debug `console.log`s before merging. `console.error` in a `catch` block for real error reporting is fine and expected; a `console.log` left over from developing a feature is not.

## Routes

- A screen under `app/screens/` only exists if something links to it. When you delete or rename a screen, `grep -rn "router.push\|Link href"` for its old path across `app/` and update/remove the callers — an orphaned route file is not caught by the compiler or linter, only by a user hitting a dead end at runtime (or a future audit).
