# Theme & Structure Audit — 2026-08 (pass 2)

Follow-up to `QA_REPORT.md`, focused specifically on whether the theme/design-token system (`theme/tokens.js`, `design.md`) is actually followed consistently across the app, not just documented.

## Fixed this pass

- **Retired brand oranges still in use.** `design.md` names `#f97316` as canonical and explicitly retires `#FF5722` and `#f36d21` — but `#FF5722` was still hardcoded in 8 files (32 occurrences: `my_orders_screen/{index,All}.tsx`, `my_reviews_screen/{index,ToReview,WriteReview}.tsx`, `chat_screen/[chatId].tsx`, `item_details/{Ratings,ShopDetails}.tsx`) and `#f36d21` in 11 spots in `LoginSignup.tsx`. Replaced all with `#f97316` — same prop (`color`/`backgroundColor`/`borderColor`) in every case, no layout change.
- **Dead Tailwind alias.** `tailwind.config.js` carried a `poppinsRegulary` (typo) font-family key with a comment saying to remove it once a grep confirmed zero usages. Grepped — zero usages, removed.

## Confirmed clean

`components/ui/` — the shared component library — has zero raw hex colors. It's a correct reference implementation of design.md's own rules; the gap is entirely in code that hasn't adopted it yet (see `QA_REPORT.md`'s "not yet migrated" section).

## Open findings (not fixed — reasons below)

### 1. Raw hex colors outside `components/ui/`: ~924 occurrences across 38 files

Quantifies the same gap `QA_REPORT.md` already flagged as scoped follow-up work (screen-by-screen migration onto the design system). Worst offenders: `checkout_screen/index.tsx` (116), `item_details/Ratings.tsx` (85), `LoginSignup.tsx` (76), `Cart.tsx` (63), `Messages.tsx` (61).

### 2. Font sizes outside `components/ui/` span a continuous 8–28px range

`design.md` states the token scale "replaces the old 8–28 continuous range" — true only inside `components/ui/`. Screen code still has values like 9, 10, 11, 17, 22 that don't map to any token (`xs`12/`sm`13/`base`14/`md`15/`lg`16/`xl`18/`2xl`20/`3xl`24/`4xl`28). Same root cause as #1: not yet migrated.

### 3. Tailwind's `text-*` classes don't resolve to the token font-size scale

`tailwind.config.js` extends `colors`, `borderRadius`, and `fontFamily` from `theme/tokens.js`, but not `fontSize`. Every NativeWind screen using `className="text-sm"` / `text-base` / `text-lg` etc. is on Tailwind's _default_ scale, not the design system's:

| Class       | Tailwind default | Token value   | Delta if synced |
| ----------- | ---------------- | ------------- | --------------- |
| `text-xs`   | 12px             | 12px (`xs`)   | none            |
| `text-sm`   | 14px             | 13px (`sm`)   | −1px            |
| `text-base` | 16px             | 14px (`base`) | −2px            |
| `text-lg`   | 18px             | 16px (`lg`)   | −2px            |
| `text-xl`   | 20px             | 18px (`xl`)   | −2px            |
| `text-2xl`  | 24px             | 20px (`2xl`)  | −4px            |
| `text-3xl`  | 30px             | 24px (`3xl`)  | −6px            |
| `text-4xl`  | 36px             | 28px (`4xl`)  | −8px            |

Spacing does **not** have this problem — Tailwind's default numeric spacing scale (`p-4` = 16px, etc.) already happens to equal `theme.space`'s 4px-based scale, so `className="p-4"` and `theme.space[4]` already agree.

Fixing the fontSize gap is a one-object change in `tailwind.config.js`, but it changes rendered text size on every screen using NativeWind `text-*` classes app-wide, simultaneously, with no way to visually verify the result from source alone.

**Resolution (2026-08):** deferred, on purpose. Syncing it in isolation would shrink text on screens that haven't been migrated onto the token system yet, without the rest of their styling being reviewed alongside it. Revisit this at the same time a screen is migrated onto `components/ui`/token-based styling, not before.

### 4. `react-native-size-matters` used outside its one documented exception

design.md: "Responsive scaling … is retained only for the horizontally-scrolling `flashsale` product-card variant … do not introduce size-matters scaling elsewhere." Still used in 5 files beyond that: `Home.tsx`, `Cart.tsx`, `checkout_screen/index.tsx`, `search_screen/index.tsx`, `item_details/Vouchers.tsx`. Converting these to fixed token values is mechanical but needs a per-screen visual check (removing device-width-relative scaling changes exact rendered sizes) — scoped follow-up, same category as #1.

### 5. The exact `elevation`/`zIndex` hack design.md calls out is still present

design.md: "`elevation`/`zIndex` values above `lg`'s `8` should never be used to force stacking order — use proper component layering instead." `app/screens/chat_screen/[chatId].tsx` still has `elevation`/`zIndex` values of `1000` and `10000` (lines ~602–681) forcing an emoji/attachment picker above the keyboard-avoiding view. Replacing this properly means restructuring the overlay with real layering (e.g. a `Modal`/portal), which risks visibly breaking that picker's stacking if changed without checking the running app.

## Recommendation

Tackle in this order: resolve #3 first (single config decision, then re-run the app once to eyeball text sizing before committing further), then treat #1/#2/#4 as the same incremental per-screen migration already planned in `QA_REPORT.md`, and #5 as a small standalone fix once someone can verify the chat screen's picker visually.
