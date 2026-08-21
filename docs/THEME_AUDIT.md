# Theme & Structure Audit — 2026-08

Follow-up to `QA_REPORT.md`, focused specifically on whether the theme/design-token system (`theme/tokens.js`, `design.md`) is actually followed consistently across the app, not just documented. Two passes: colors (pass 2, below) and typography/font-family (pass 3, at the bottom — the largest fix in this file).

## Fixed in pass 2 (colors)

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

`tailwind.config.js` extends `colors`, `borderRadius`, and `fontFamily` from `theme/tokens.js`, but (still, as of pass 3) not `fontSize`. Every NativeWind screen using `className="text-sm"` / `text-base` / `text-lg` etc. is on Tailwind's _default_ size scale, not the design system's. (The separate, and much larger, problem of `fontFamily` not resolving to Poppins at all was fixed in pass 3, below — this finding is specifically about _size_, not family.)

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

## Recommendation (pass 2)

Tackle in this order: resolve #3 first (single config decision, then re-run the app once to eyeball text sizing before committing further), then treat #1/#2/#4 as the same incremental per-screen migration already planned in `QA_REPORT.md`, and #5 as a small standalone fix once someone can verify the chat screen's picker visually.

---

## Pass 3: `fontFamily` wasn't resolving to Poppins at all, almost anywhere

Prompted by "check the whole app with consistent font used." This turned out to be a much bigger, more fundamental gap than the font-**size** issue in #3 above — most of the app wasn't rendering in Poppins **at all**, silently falling back to the OS system font (San Francisco on iOS, Roboto on Android).

### Root cause

Two independent gaps, both in `tailwind.config.js` / component code, that combined to make Poppins the exception rather than the rule:

1. **NativeWind (`className`) side:** `tailwind.config.js`'s `fontFamily` extension only _added_ named utilities (`font-poppinsBold`, `font-poppinsSemiBold`, etc.) — it never overrode Tailwind's _default_ sans stack. Meanwhile, **zero** `className`s anywhere in the app actually used `font-poppinsX` — every single screen used Tailwind's generic weight utilities (`font-bold`, `font-semibold`, `font-medium`, `font-light`, `font-extrabold` — 56 instances across 13 files) or no font utility at all. Tailwind's `font-bold` only sets `font-weight`; it has no opinion on `font-family`, so text styled this way rendered as system-font-bolded rather than an actual `PoppinsBold` glyph.
2. **`StyleSheet` (`style`) side:** far larger — **206** `fontWeight:` declarations across the app, only **23** paired with a `fontFamily:` in the same style. The other **~183** set a numeric/string weight (`'600'`, `'700'`, `'bold'`, etc.) with no `fontFamily` at all, which on RN/iOS/Android means: system font, synthetically bolded to approximate the requested weight — never Poppins.

`components/ui/` (the shared component library) was unaffected — it already paired every `fontWeight` with `theme.font.family.X` correctly, per design.md's own rule. The gap was entirely in screen code that predates the design system.

### Fixed

- **`tailwind.config.js`:** added `fontFamily.sans` (Tailwind's default stack) pointing at `PoppinsRegular`, so any `className` with no explicit font utility — or the rarely-used `font-sans` — now gets Poppins instead of the system font.
- **56 NativeWind class instances**, across 13 files, mechanically remapped: `font-bold`/`font-extrabold` → `font-poppinsBold`, `font-semibold` → `font-poppinsSemiBold`, `font-medium` → `font-poppinsMedium`, `font-light` → `font-poppinsLight`. (`extrabold` maps to Bold, not a dedicated ExtraBold weight — see the next point.)
- **187 `fontFamily` declarations inserted** across 27 `StyleSheet`/inline-style files, next to their existing `fontWeight`, mapped by value: `'400'`/`'normal'`→`PoppinsRegular`, `'500'`→`PoppinsMedium`, `'600'`→`PoppinsSemiBold`, `'700'`/`'bold'`→`PoppinsBold`, `'800'`/`'900'`→`PoppinsBold` (this app only bundles 5 Poppins weights — Regular/Medium/SemiBold/Bold/Light, see `OPTIMIZATION.md` — so ExtraBold/Black requests fall back to the closest weight actually shipped, rather than to no Poppins at all). Applied with a small script, block-aware (so it doesn't misfire inserting a duplicate into a style that already had `fontFamily` from a different rule) and handling both `key: { fontWeight: 'X' }` (own line) and inline `style={{ ..., fontWeight: 'X' }}` shapes.
- Verified full convergence afterward: `fontWeight` count now equals `fontFamily` count in every file that has either, project-wide. `tsc --noEmit`, `expo lint`, and `biome check` all pass with zero new issues (same 2 known "hidden for now" warnings as before, see `QA_REPORT.md`).

### Still open (unaffected by this pass)

- **Finding #2 above (font-size continuous range)** is unrelated to family and still open — this pass fixed _which font_ renders, not _what size_.
- **Finding #3 above (Tailwind `text-*` size sync)** is still deliberately deferred, per the earlier decision recorded there.
- A handful of decorative/marketing-copy emoji (promo banner text, toast messages) were deliberately left alone as a separate, prior fix — see the "emoji vs. icons" fixes noted in this session; those aren't a font-family issue, they're literal pictographic characters standing in for either UI icons (fixed) or casual copy flourishes (left as-is).
