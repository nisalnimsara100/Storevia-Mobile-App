# Architecture

How Storevia is put together: routing, state, data, and the UI layer. For visual/design rules (colors, spacing, component APIs) see [design.md](./design.md).

## Stack

- **Expo Router** (file-based routing) on **React Native 0.81 / React 19**
- **NativeWind** (Tailwind classes) + plain `StyleSheet` — both are in active use; new/migrated components should prefer `StyleSheet` driven by `theme/tokens.js` (see design.md), existing NativeWind screens are not being force-migrated
- **Zustand** for cross-screen client state (`app/stores/`)
- **React Context** for a couple of provider-shaped concerns (auth actions, cart actions)
- **Firebase Auth** for authentication, backed by a separate REST API (`EXPO_PUBLIC_APP_BASE_URL`) for product/order/store data

## Folder structure

```
app/                      Expo Router routes — file paths ARE the URL structure
  (auth)/                 Route group: login/signup, not part of the URL
  (tabs)/                 Route group: bottom-tab screens (Home, Cart, Messages, Account)
  screens/                Secondary (pushed, non-tab) screens, one folder per feature
    <feature>_screen/      e.g. checkout_screen, my_orders_screen, settings_screen
  components/             Screen-local components not yet promoted to the shared library
    item_details/          Components specific to the product detail page
  context/                React Context providers (auth actions, cart actions)
  stores/                 Zustand stores (auth/session state, reviews state)

components/ui/            Shared design-system components (Button, Input, ProductCard, …)
theme/                    Design tokens — single source of truth, see design.md
constants/                (removed — was unused Expo-template boilerplate)
data/                     Static/mock data used by a couple of screens (messages, product seed data)
docs/                     This documentation
```

### Routing

Expo Router maps files under `app/` directly to routes:

- `app/(tabs)/*` is the bottom tab bar (`app/(tabs)/_layout.tsx`), the default landing area after login.
- `app/(auth)/*` holds the login/signup flow.
- `app/screens/<name>_screen/index.tsx` is the convention for anything reached via `router.push('/screens/<name>_screen')` rather than a tab — order history, checkout, settings, vouchers, etc. Sub-pages of a feature live as sibling files in the same folder (e.g. `settings_screen/AddressBook.tsx`, `my_orders_screen/ToPay.tsx`).
- A route file with no corresponding link anywhere in the app is dead code — this happened once (`app/search/index.tsx`, removed during the 2026-08 cleanup) because `search_screen` superseded it without the old route being deleted. When removing/renaming a screen, grep for `router.push`/`Link href` referencing its path before deleting, and check again after — an unlinked route file won't error at build time, only at runtime when a user somehow lands on it.

### State management

Two different mechanisms are in use for related-but-distinct purposes — this is intentional, not duplication:

- **`app/stores/useAuthStore.ts`** (Zustand, persisted to AsyncStorage) is the source of truth for _session data_ read across the app: `user`, `cartCount`, `followedStoreIds`, session expiry. 14+ screens read from it directly.
- **`app/context/authContext.tsx`** (`useAuth()`) wraps the _auth actions_ — `signIn`, `signUp`, `signInWithGoogle`, `signInWithApple` — against Firebase. Only the login/signup screen and account screen call these directly; once an action succeeds it writes into `useAuthStore`.
- **`app/context/cartContext.tsx`** (`CartContext`) wraps cart mutation actions (`addToCart`) for components that add items without owning full cart state (e.g. a product card's "Add to Cart" button). The `Cart` tab screen itself manages its own local state and calls the backend directly rather than going through this context.
- Both context providers are mounted once, at the root, via `app/context/cartProviderWrapper.tsx` (itself wrapped in `app/_layout.tsx`). `react-native-toast-message`'s `<Toast />` root is mounted there too.
- **`app/stores/useReviewsStore.ts`** tracks which order/product review pairs have already been submitted this session, so "to review" lists can filter them out optimistically before the backend list refreshes.

### Data fetching

There is no shared API client / query library. Screens call `fetch` directly against `${process.env.EXPO_PUBLIC_APP_BASE_URL}/api/...` inside `useEffect`/`useCallback`, with local `loading`/`error` state per screen. This is consistent across the app; if a shared fetch hook or query library (e.g. TanStack Query) is introduced later, it should replace this pattern app-wide rather than adding a second convention alongside it.

### UI layer

`components/ui/` is the shared design-system library described in full in [design.md](./design.md) — `Button`, `Input`, `Badge`, `StarRating`, `ProductCard` (4 variants), `ScreenHeader`, `EmptyState`, `AppModal`, `Skeleton`/`Spinner`, and the `toast` helper. Screens should prefer these over ad-hoc `TouchableOpacity`/`Text` combos for anything they cover.

**Migration status (as of 2026-08):** the token layer and shared components are built and consumed by `Home`, the auth screen, and every screen's back-button header (`ScreenHeader`) — see the "Migration status" note at the end of design.md. Screens not yet listed there still use their original hand-rolled styling; this is expected, not a regression, and they should be migrated incrementally rather than all at once (each conversion needs a visual check against the running app, which isn't something that can be verified from source alone).
