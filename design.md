# Storevia Design System

Single source of truth for Storevia's visual language. Every screen and component should conform to this spec. Tokens are implemented in code at `theme/tokens.js` (imported by both `tailwind.config.js` and TypeScript components — see "Implementation" at the end of each section). Reusable components live in `components/ui/`.

This document reflects decisions made after auditing the existing (AI-generated) codebase, which had 190+ raw hex colors, 3 competing "brand orange" values, a continuous 8–28px font-size range with no scale, 15 discrete border-radius values, and 4 duplicate ProductCard implementations. Everything below is the resolved, canonical version.

---

## 1. Color

### Brand & semantic scales

| Token | Value | Usage |
|---|---|---|
| `primary.50` | `#fff7ed` | Tinted backgrounds behind primary-colored text/icons (e.g. "FREE DELIVERY" pill) |
| `primary.100` | `#ffedd5` | Subtle primary-tinted surfaces |
| `primary.500` (`DEFAULT`) | `#f97316` | **Canonical brand color.** All primary buttons, active tab icon, prices, links, focus rings |
| `primary.600` | `#ea580c` | Pressed/active state of primary elements |
| `primary.700` | `#c2410c` | Text-on-light-primary-background if extra contrast needed |
| `secondary.DEFAULT` | `#2563eb` | Secondary actions that must be visually distinct from primary (rare — most CTAs should use primary or outline, not a second brand color) |
| `success.DEFAULT` | `#16a34a` | In-stock, free delivery, completed order, success toast |
| `success.bg` | `#dcfce7` | Success badge/pill background |
| `danger.DEFAULT` | `#dc2626` | Errors, discounts, out-of-stock, destructive actions, "Danger" button |
| `danger.bg` | `#fee2e2` | Danger badge/pill background |
| `warning.DEFAULT` | `#f59e0b` | Low-stock warnings, pending states |
| `warning.bg` | `#fef3c7` | Warning badge/pill background |
| `star` | `#f59e0b` | Rating stars (filled) — same value as `warning`, named separately for semantic clarity |

> **Decision — canonical brand orange:** `#f97316` replaces `#f36d21` (previously auth-screens-only) and `#FF5722` (previously a review-screen accent). `#f97316` was chosen because it's already hardcoded as the bottom-tab active color (`app/(tabs)/_layout.tsx`), making it the color users already see on every screen. The other two oranges are retired outright — they were drift, not intentional secondary brand colors.

### Neutrals (grayscale)

| Token | Value |
|---|---|
| `neutral.0` | `#ffffff` |
| `neutral.50` | `#f9fafb` |
| `neutral.100` | `#f3f4f6` |
| `neutral.200` | `#e5e7eb` |
| `neutral.300` | `#d1d5db` |
| `neutral.400` | `#9ca3af` |
| `neutral.500` | `#6b7280` |
| `neutral.600` | `#4b5563` |
| `neutral.700` | `#374151` |
| `neutral.800` | `#1f2937` |
| `neutral.900` | `#111827` |
| `neutral.1000` | `#000000` |

### Semantic aliases (use these in component code, not raw neutrals)

| Token | Value | Usage |
|---|---|---|
| `text.primary` | `#111827` (`neutral.900`) | Headings, product names, body text |
| `text.secondary` | `#6b7280` (`neutral.500`) | Metadata, timestamps, helper text, review counts |
| `text.disabled` | `#9ca3af` (`neutral.400`) | Placeholder text, disabled labels |
| `text.inverse` | `#ffffff` | Text on dark/colored backgrounds (buttons, badges) |
| `background.DEFAULT` | `#ffffff` | Screen background |
| `background.subtle` | `#f9fafb` (`neutral.50`) | Section backgrounds, input fields |
| `surface.DEFAULT` | `#ffffff` | Card/sheet surfaces |
| `border.DEFAULT` | `#e5e7eb` (`neutral.200`) | Dividers, input borders, card borders |
| `border.focus` | `#f97316` (`primary.500`) | Focused input border |
| `overlay` | `rgba(0,0,0,0.5)` | Modal/bottom-sheet scrim (replaces 8+ independently-typed rgba values) |

**Rule:** no raw hex codes in component/screen code. Always reference a token (`theme.color.*` in StyleSheet, or `bg-primary-500`/`text-neutral-900` etc. in className).

---

## 2. Typography

### Font family

Poppins (already bundled as 5 weights via `expo-font` in `app/_layout.tsx`). System font is the fallback only until a component is migrated.

| Token | Font file |
|---|---|
| `font.light` | PoppinsLight |
| `font.regular` | PoppinsRegular |
| `font.medium` | PoppinsMedium |
| `font.semibold` | PoppinsSemiBold |
| `font.bold` | PoppinsBold |

### Size scale (discrete — replaces the old 8–28 continuous range)

| Token | px | Typical usage |
|---|---|---|
| `xs` | 12 | Badges, timestamps, fine print |
| `sm` | 13 | Secondary text, review counts, captions |
| `base` | 14 | Body text, default UI text |
| `md` | 15 | Emphasized body text |
| `lg` | 16 | Product name, input text |
| `xl` | 18 | Section headings |
| `2xl` | 20 | Screen titles, product detail price |
| `3xl` | 24 | Large headings |
| `4xl` | 28 | Hero/onboarding headings |

### Line height

| Token | px |
|---|---|
| `xs` | 16 |
| `sm` | 18 |
| `base` | 20 |
| `md` | 22 |
| `lg` | 24 |
| `xl` | 26 |
| `2xl` | 28 |
| `3xl` | 32 |
| `4xl` | 36 |

### Weight scale (replaces the `'700'` / `"700"` / `'bold'` / `font-bold` mix)

| Token | Value | Maps to font family |
|---|---|---|
| `regular` | `400` | PoppinsRegular |
| `medium` | `500` | PoppinsMedium |
| `semibold` | `600` | PoppinsSemiBold |
| `bold` | `700` | PoppinsBold |

**Rule:** always pair a numeric `fontWeight` with the matching Poppins `fontFamily` (e.g. weight `700` → `fontFamily: 'PoppinsBold'`, not `fontFamily: 'PoppinsRegular', fontWeight: '700'`), since Poppins ships as separate font files per weight rather than a single variable font.

### Applied type roles

| Role | Size | Weight | Color |
|---|---|---|---|
| Screen title | `xl` (18) | `semibold` | `text.primary` |
| Section heading | `lg` (16) | `semibold` | `text.primary` |
| Product name (card) | `sm`/`base` (13–14) | `medium` | `text.primary` |
| Product name (detail page) | `lg` (16) | `bold` | `text.primary` |
| Price (card) | `lg` (16) | `bold` | `primary.500` |
| Price (detail page) | `2xl` (20) | `bold` | `primary.500` |
| Old/strikethrough price | `sm` (13) | `regular` | `text.disabled` |
| Discount tag | `xs` (12) | `semibold` | `danger.DEFAULT` |
| Body/description | `base` (14) | `regular` | `text.secondary` |
| Metadata (rating/sold/reviews) | `xs` (12) | `regular` | `text.secondary` |

---

## 3. Spacing & Grid

4px base unit, 8px as the common step for most layout gaps.

| Token | px |
|---|---|
| `0` | 0 |
| `1` | 4 |
| `2` | 8 |
| `3` | 12 |
| `4` | 16 |
| `5` | 20 |
| `6` | 24 |
| `8` | 32 |
| `10` | 40 |
| `12` | 48 |

**Rules:**
- Card padding: `4` (16px). Compact card padding (grid product cards): `2` (8px).
- Screen horizontal padding: `4` (16px).
- Gap between stacked elements (label→input, title→subtitle): `1`–`2` (4–8px).
- Gap between unrelated sections: `6` (24px).
- Minimum tap target: **44×44px** (accessibility) — applies to all icon buttons, back buttons, and small touchables, even if the visible icon is smaller (pad with `hitSlop` or container padding).
- Responsive scaling (`react-native-size-matters`'s `scale`/`verticalScale`/`moderateScale`) is retained only for the horizontally-scrolling `flashsale` product-card variant, where device-width-relative sizing genuinely matters. Every other component uses fixed token values — do not introduce size-matters scaling elsewhere.

---

## 4. Border Radius & Shadows

### Radius scale (replaces 15 ad-hoc values: 2,3,4,6,8,9,10,12,16,18,20,25,30,40)

| Token | px | Usage |
|---|---|---|
| `none` | 0 | — |
| `sm` | 4 | Badges, small tags |
| `md` | 8 | Buttons, inputs, small cards |
| `lg` | 12 | Product cards, modals |
| `xl` | 16 | Bottom sheets, large cards |
| `2xl` | 20 | Hero banners |
| `full` | 999 | Circular avatars, pill badges, FAB |

### Shadow / elevation (replaces the `elevation: 1000/10000` hacks used only to force Android stacking order)

| Token | iOS shadow | Android elevation | Usage |
|---|---|---|---|
| `sm` | offset (0,1), opacity 0.06, radius 2 | 2 | Subtle card lift (product cards on list/grid) |
| `md` | offset (0,2), opacity 0.10, radius 6 | 4 | Floating buttons, dropdowns, toasts |
| `lg` | offset (0,4), opacity 0.14, radius 12 | 8 | Modals, bottom sheets |

**Rule:** `elevation`/`zIndex` values above `lg`'s `8` should never be used to force stacking order — use proper component layering (Modal, Portal-style overlay) instead.

---

## 5. Components

All live in `components/ui/`, built on top of the token layer, usable from both NativeWind-className screens and StyleSheet screens (internal implementation is StyleSheet-based so behavior is identical regardless of how the parent screen is styled).

### 5.1 Button

Variants: `primary` (filled `primary.500`, white text — main CTAs: Add to Cart, Place Order, Sign In), `secondary` (filled `secondary.DEFAULT` — only for actions that must be visually distinguished from the primary action, e.g. "Save as draft" next to "Submit"), `outline` (transparent bg, `border.DEFAULT` border, `text.primary` — secondary/cancel actions), `text` (no bg/border, `primary.500` text — tertiary actions like "View all", "Edit"), `danger` (filled `danger.DEFAULT` — delete, remove, logout).

Sizes: `sm` (36px height), `md` (44px height — default, meets tap-target minimum), `lg` (52px height — hero CTAs like checkout's Place Order).

States: `default`, `pressed` (`activeOpacity: 0.8` + variant's "600"-equivalent darker shade), `disabled` (50% opacity, non-interactive), `loading` (shows `ActivityIndicator` in place of label, still occupies same footprint, non-interactive).

Radius: `md` (8px). Supports optional left/right icon slot and `fullWidth`.

### 5.2 Form Controls

- **Input**: label (optional, `sm`/`semibold`/`text.secondary`), text field (`border.DEFAULT` border, `radius.md`, `base` size, `4`/16px horizontal padding, 44px min height), error state (border → `danger.DEFAULT`, error message below in `xs`/`danger.DEFAULT`), left/right icon slot, placeholder in `text.disabled`.
- **Select dropdown**: same visual shell as Input, with a `chevron-down` icon (right-aligned, `text.secondary`).
- **Checkbox**: 20×20px box, `radius.sm`, unchecked = `border.DEFAULT` outline, checked = filled `primary.500` with white check icon. Always wrapped in a ≥44px tap target.
- **Switch**: use RN's native `Switch` with `trackColor={{ true: primary.500, false: neutral.300 }}` — don't reimplement.
- **Search bar**: pill-shaped (`radius.full`), `background.subtle` fill, no visible border, magnifying-glass icon left (`text.secondary`), 44px height.

### 5.3 Product Components

**ProductCard** — one component, four variants (replaces `ProductCard.tsx`, `LargeProductTile.tsx`, `FlashSaleCard.tsx`, `item_details/ProductCard.tsx`):
- `grid`: square-ish image, compact info block, used in Home/listing grids. Radius `lg`, padding `2`.
- `list`: wider image, more metadata visible (badges row), used in "large tile" contexts. Radius `lg`.
- `flashsale`: fixed-width horizontal-scroll card, discount badge top-right, "stock remaining" text, uses `scale`/`moderateScale` per the spacing exception above.
- `detail`: full-width product-detail-page layout — image gallery, expandable title, rating/actions row, price block, description, Add to Cart button. Composes `Badge`, `StarRating`, and `Button` internally instead of duplicating their styles.

All variants share: **Price** sub-component (`primary.500`, `bold`, size per variant per the type-role table), strikethrough old price (`text.disabled`), discount tag via **Badge** (`tone="discount"`).

**Badge** — tones: `discount` (danger), `stock`/`lowStock` (warning), `freeDelivery`/`inStock` (success), `new`/`gems` (primary or a distinct `accent` if introduced later — do not reuse retired ad hoc purple/pink hex values), `neutral` (gray). Shape: pill (`radius.full`) for status tags, rounded-rect (`radius.sm`) for inline text tags like "FREE DELIVERY". Text `xs`, `semibold`.

**StarRating** — filled star = `color.star` (`#f59e0b`), empty = `neutral.300`. `display` mode (read-only, used in cards + `Ratings.tsx`) and `interactive` mode (tappable stars for review input, used in `WriteReview.tsx` — both consume the same component instead of two separate implementations).

### 5.4 Feedback & States

- **Loading**: `Spinner` = `ActivityIndicator` wrapped with `color: primary.500`. Full content skeletons (`Skeleton`) are a lower-priority nice-to-have — use `Spinner` as the default loading treatment for now.
- **Empty states**: icon (neutral, large, `text.disabled`) + title (`lg`/`semibold`/`text.primary`) + optional subtitle (`base`/`text.secondary`) + optional action `Button`. One component (`EmptyState`) replaces the 5 independently-named/styled versions found in the old code (empty orders, empty reviews, empty cart, empty search, empty chat).
- **Toast vs. Alert** (explicit rule, not a duplication to remove — these are different UX patterns):
  - **Toast** (`react-native-toast-message`, via `components/ui/Toast.ts`'s `toast.success/error/info` helpers): fire-and-forget, non-blocking confirmations — "Added to cart", "Address saved", "Copied to clipboard".
  - **Alert** (`Alert.alert`): blocking decisions that require explicit user confirmation before proceeding — "Delete this address?", "Discard changes?", "Log out?".
  - If a current `Alert.alert` call is just informing the user of something with a single "OK" dismiss and no real decision being made, it should become a toast during migration.
- **Modal / Bottom Sheet**: one `Modal` wrapper (wraps RN's native `<Modal>`, no new dependency) with `presentation` = `center` (dialogs/confirmations), `bottomSheet` (filters, address selection, voucher list — slides up from bottom, `radius.xl` top corners), or `fullscreen`. Overlay always uses `color.overlay`.

### 5.5 Navigation

- **ScreenHeader**: canonical back icon is **`chevron-back`** (Ionicons, 24px, `text.primary`) — replaces the old 50/50 split between `arrow-back` and `chevron-back` across the app, chosen since it reads as a more standard "back" affordance and was already the (narrow) minority-but-more-consistent choice. Title centered or left-aligned per screen need, `xl`/`semibold`. Optional `rightAction` slot (cart icon, search icon, menu).
- **Bottom tab bar**: already uses the canonical brand color correctly (`app/(tabs)/_layout.tsx`: active = `primary.500` `#f97316`, inactive = `neutral.400` `#9ca3af`) — no change needed structurally, just point these literals at the token file instead of inline hex once migrated.
- **Tabs** (in-page, e.g. order status tabs "All/To Pay/To Ship"): active = `primary.500` text + 2px `primary.500` underline; inactive = `text.secondary`, no underline.

---

## Implementation

- **Tokens**: `theme/tokens.js` (plain CommonJS, single source of truth) + `theme/tokens.d.ts` (types) + `theme/index.ts` (TS re-export). `tailwind.config.js` does `require('./theme/tokens')` to extend `colors`/`borderRadius`/`fontFamily`, so `bg-primary-500` and `theme.color.primary.DEFAULT` always resolve to the same value.
- **Components**: `components/ui/{Button,Input,Badge,StarRating,ProductCard,ScreenHeader,EmptyState,Modal,Skeleton,Toast}.tsx`, barrel-exported via `components/ui/index.ts`. Import via the existing `@/*` path alias, e.g. `import { Button, ProductCard } from '@/components/ui'`.
- **Migration status**: token layer and components are built and available; existing screens are migrated to consume them incrementally, in this order: Auth → Home & Listing → Product Detail → Cart & Checkout → Profile & Order History. See project plan for per-screen checkpoints. Until a screen is migrated, it continues to use its pre-existing styling — this file describes the target state, not necessarily every screen's current state.
