# QA Audit — 2026-08

Full-codebase pass: structure review, lint/type-check cleanup, dead-code removal, and a first round of shared-component adoption. Scope and reasoning below so later work can build on it instead of re-discovering it.

## Summary

| Check                     | Before | After         |
| ------------------------- | ------ | ------------- |
| `tsc --noEmit` errors     | 1      | 0             |
| `expo lint` errors        | 10     | 0             |
| `expo lint` warnings      | 49     | 1 (see below) |
| Files deleted (dead code) | —      | 8             |

The one remaining warning (`'OrderIcon' is assigned a value but never used`, `app/(auth)/LoginSignup.tsx`) is a false-negative-adjacent case: `OrderIcon` is only referenced inside a JSX block that's wrapped in a `{/* ... */}` comment (the "My Orders" section, explicitly marked "hidden for now"). Deleting `OrderIcon` would break re-enabling that section later, and un-commenting the section wasn't this audit's call to make — left as-is, flagged here instead of silently suppressed.

## Structural findings

1. **The shared design-system layer (`components/ui/`) existed but was imported nowhere.** `design.md` documented `Button`, `Input`, `Badge`, `StarRating`, `ProductCard`, `ScreenHeader`, `EmptyState`, `AppModal`, `Skeleton`, `toast` as built and ready, but zero screens consumed any of them before this pass.
2. **Four separate `ProductCard`-shaped components** existed for what `design.md` already identified as one component with variants: `app/components/ProductCard.tsx` (grid), `LargeProductTile.tsx` (list), `FlashSaleCard.tsx` (flashsale), and `app/components/item_details/ProductCard.tsx` (detail).
3. **An orphaned route**: `app/search/index.tsx` had no caller anywhere in the app — `Home` routes to `/screens/search_screen` instead, which fully superseded it. Classic case of a route surviving its own replacement.
4. **Inconsistent back-icon usage**: `arrow-back` (Ionicons) was used in 12 places, `chevron-back` in the rest, with no functional difference — just drift.
5. **Unused Expo-template boilerplate**: `constants/theme.ts` and all three `hooks/use-*-color*.ts` files were leftovers from `create-expo-app` scaffolding, never wired into the actual app (which has its own `theme/` design-token system). Confirmed zero references before deleting.
6. **A real bug**: `app/screens/activity_screen/Live.tsx` called `useState`/`useEffect` inside `renderCountdown`, a plain function invoked per-item inside `.map()` rather than a component rendered as JSX — a `react-hooks/rules-of-hooks` violation that risks hook-count mismatches/crashes depending on list length. Fixed by extracting a proper `Countdown` component. The same file also had a fully dead reaction-animation feature (state + handler never wired to any UI) and a pulsing `Animated.Value` that animated nothing visible — both removed.
7. **Dual auth-state mechanism** (Zustand `useAuthStore` for session data, React Context `useAuth()` for auth actions) — not a bug, but non-obvious; documented in `ARCHITECTURE.md` so it isn't "rediscovered" as a bug later.

## What was fixed

- All `tsc` and `expo lint` errors (unescaped JSX entities, a JSX-comment-as-text-node bug rendering literal `//?--don't remove--` on three settings screens, the hooks-rules violation above, a `setTimeout`/`NodeJS.Timeout` type mismatch).
- All fixable lint warnings: unused imports/vars/state, missing `useEffect`/`useCallback` dependencies (each fixed by memoizing the actual dependency, not by suppressing the rule — see `CODING_STANDARDS.md`).
- Removed leftover debug `console.log`s (kept `console.error` in catch blocks — that's real error reporting, not debug noise).
- Deleted: `app/search/index.tsx`, `app/components/{ProductCard,LargeProductTile,FlashSaleCard}.tsx`, `constants/theme.ts`, `hooks/use-color-scheme.ts`, `hooks/use-color-scheme.web.ts`, `hooks/use-theme-color.ts`.
- Migrated `Home.tsx` and the auth screen's product rail onto the shared `ProductCard` (`grid`/`list`/`flashsale` variants), and every settings screen's header onto `ScreenHeader`. Standardized every remaining back icon in the app to `chevron-back`.
- Whole-repo Prettier pass for consistent formatting.

## Deliberately not done (and why)

- **`app/components/item_details/ProductCard.tsx` (the `detail` variant) was not migrated onto the shared component.** It has real functionality — expandable title, wishlist/share buttons, a returns/warranty info banner — that the shared `ProductCard`'s `detail` variant doesn't support. Forcing it over would have silently dropped visible features with no way to verify the regression from source alone (no simulator was run this session). Documented in `design.md` as a scoped follow-up: extend the shared `detail` variant first, then migrate.
- **`Button`, `Input`, standalone `Badge`, `EmptyState`, `AppModal` are not yet adopted** outside of `ProductCard`'s internal use. Cart, checkout, auth forms, and most orders/reviews screens still use hand-rolled equivalents. This is a large, screen-by-screen effort that needs a visual check per screen against the running app — bundling it into one sweep here would have traded a verifiable, bounded change for an unverifiable, sprawling one. Recommend tackling one screen (or one feature area) at a time, in the order `design.md` already specifies (Auth → Home & Listing → Product Detail → Cart & Checkout → Profile & Order History), verifying each in a simulator before moving to the next.
- **A commented-out "My Orders" section in `LoginSignup.tsx`** (marked "hidden for now") was left alone rather than deleted or re-enabled — that's a product decision, not a cleanup call.

## How to keep this clean

Run before every PR:

```bash
npx tsc --noEmit
npx expo lint
npx prettier --check .
```

None of these currently report anything beyond the one documented warning above — treat any new error/warning as something to fix in the same PR that introduced it, not deferred.
