# UI Consistency & Release Fixes — 2026-08

Covers everything from this session that isn't a color/font-token finding (those are in `THEME_AUDIT.md`): safe-area backgrounds, status bar icon color, emoji standing in for icons, a real crash caught while producing release builds, and what actually building an APK/IPA locally in this environment required.

## Safe-area background mismatches (12 screens)

**The bug:** `SafeAreaView`'s own background color fills the status-bar inset. On 12 screens, that background didn't match the header sitting directly below it, producing a visible color seam at the very top of the screen — most had a gray/neutral `SafeAreaView` background with a white (or brand-colored) header immediately under it.

**Root cause of most instances:** introduced while migrating settings screens off a `mt-[10%]` fake-safe-area hack (see `RESPONSIVE_AUDIT.md`) onto real `SafeAreaView` — the migration matched the _old_ screen body color instead of the header color. A few (`Cart.tsx`, `app/search/index.tsx`, `voucher_screen`, `checkout_screen`, and the `LoginSignup` screen embedded in the logged-out `Account` tab) were pre-existing, unrelated to that migration.

**Fix, by pattern:**

- **White/solid header, full-bleed to the top:** `SafeAreaView` background changed to match the header; the body's own background (if it needs to differ, e.g. a gray page behind white content cards) moved onto the scrollable content below the header instead of living on the `SafeAreaView` itself. Applied to all 9 settings screens, `AddressBook`, `app/search/index.tsx`, and `LoginSignup.tsx` (its header has **square top corners** — only rounded at the bottom — which is what confirms it's meant to sit flush against the status bar, not float as a card; an earlier pass in this same session had wrongly judged this one "intentional design" before this fix corrected it).
- **Colored/gradient header (orange, yellow gradient):** rather than flatten the whole safe area to one color — which breaks the _other_ edge when a screen also handles `bottom` insets with a different body color (this bit `checkout_screen` specifically) — the header itself now bakes in `insets.top` (via `useSafeAreaInsets()`) as extra padding, so its own color/gradient extends naturally up behind the status bar. Applied to `Home`, `Cart`, `Messages`, `checkout_screen`, and `voucher_screen`.

## Status bar icon color (`dark` vs `light`)

**The bug:** no `expo-status-bar` usage existed anywhere in the app (it had been removed as an apparently-unused dependency in an earlier optimization pass — turned out to be needed after all, see `OPTIMIZATION.md`'s dependency list, now corrected). Status bar icon color was whatever the OS defaulted to, which is wrong on a white background half the time.

**First attempt, and why it was wrong:** declaring `<StatusBar style="light" />` directly inside `Home`, `Cart`, `Messages`, and `checkout_screen`. This works for a screen that cleanly mounts/unmounts, but **tab screens don't** — React Navigation's bottom-tabs keeps them mounted in the background when you switch tabs, so a declarative `<StatusBar>` only fires once, on first visit. Switching tabs afterward doesn't re-assert it, and any of the ~30 other screens with no `<StatusBar>` at all would silently inherit whatever the last-visited screen had set.

**Actual fix:** removed all per-screen declarations. One centralized controller in `app/_layout.tsx`, driven by `usePathname()` (re-evaluates on every navigation change, tab switch or stack push/pop alike):

```ts
const LIGHT_STATUS_BAR_ROUTES = new Set([
  '/Home',
  '/Cart',
  '/Messages',
  '/screens/checkout_screen',
]);
// dark everywhere else
```

One source of truth instead of per-screen bookkeeping that's easy to forget when a new screen is added — extend that `Set` if a future screen also needs light icons.

## Emoji standing in for icons

Found and replaced actual UI-icon usages that were plain emoji characters (`Text` containing `🏪`, `💬`, `💎`, `✓`/`+`) with `Ionicons`, matching how the rest of the app renders icons:

| File                             | Was                                    | Now                                    |
| -------------------------------- | -------------------------------------- | -------------------------------------- |
| `chat_screen/index.tsx`          | `🏪` avatar, `💬` message-preview icon | `storefront`, `chatbubble-outline`     |
| `chat_screen/settings.tsx`       | `🏪` avatar                            | `storefront`                           |
| `(tabs)/Cart.tsx`                | `🏪 {storeName}` inline in text        | `storefront-outline` icon + plain text |
| `my_reviews_screen/ToReview.tsx` | `💎` gems banner icon                  | `diamond`                              |
| `item_details/ShopDetails.tsx`   | `✓`/`+` follow-toggle badge            | `checkmark`/`add`                      |

Caught one real bug while doing this: the first attempt at the `ShopDetails.tsx` fix read the icon color via `styles.addBadgeText.color` — not reliable, since `StyleSheet.create()` can return opaque style IDs rather than plain objects, so indexing into a property at runtime isn't guaranteed to work. Fixed to use the literal color value directly. Also removed the now-dead `chatAvatarText`/`userAvatarText`/`addBadgeText` styles those Text-based icons had used.

**Deliberately left alone:** the emoji _picker_ in the chat conversation screen (a real feature — users pick an emoji to send as a message) and decorative emoji embedded in marketing/toast copy (`Gems.tsx`'s promo banner titles, `cartContext.tsx`'s "🛒🛍️" toast text) — those aren't icons standing in for UI, they're casual copy, same as `console.log`-adjacent "✅ Login successful!" alert text already common in this codebase.

## A real crash, caught while producing a release build

While building an Android preview APK via EAS to check its size, the installed build **crashed on launch on a real device**. Root cause, traced back through the build log:

1. EAS's `preview` environment had **zero environment variables configured** — none of the `EXPO_PUBLIC_FIREBASE_*` / `EXPO_PUBLIC_GOOGLE_*` values from the local `.env` had ever been pushed to EAS.
2. `firebaseConfig.ts` wraps `initializeApp()`/`getAuth()` in a `try/catch` that only `console.warn`s on failure, leaving `auth = null` — anticipating exactly this failure mode, but not handling its consequence.
3. `app/context/authContext.tsx` calls `onAuthStateChanged(auth, ...)` unconditionally on mount, inside `AuthProvider`, which wraps the **entire app**. With `auth === null`, that throws immediately — a guaranteed, 100%-reproducible crash at launch, on every device, regardless of which branch or commit was built.

**Fixed both ends:**

- Pushed the local `.env` values to all three EAS environments (`preview`, `production`, `development`) via `eas env:push <environment> --path .env --force`. These are all `EXPO_PUBLIC_*` — meant to be client-embedded per Expo's own convention, not secrets, so this is the standard/correct operational step, not a security concern.
- Hardened `authContext.tsx`: `useFocusEffect`-adjacent guard — if `auth` is null, log a clear `console.error` naming the likely cause and set `loading = false` (degrade to a logged-out state) instead of subscribing to `onAuthStateChanged` on a null object. Any _future_ misconfiguration now fails loud and gracefully instead of crashing the whole app with a confusing native stack trace.

## Building locally in this environment: what it actually took

For anyone reproducing local (non-EAS) builds here:

- **Android:** needs `ANDROID_HOME` exported (SDK exists at `~/Library/Android/sdk` but isn't on `PATH` by default in a fresh shell) and **Java 17**, not whatever `java -version` resolves to by default — this machine also has Java 24/25 installed, and Gradle 8.14.3 (what this project's wrapper pins) cannot load class files built for Java 25 ("Unsupported class file major version 69"). A clean `./gradlew assembleRelease` also needs unrestricted network access (`dangerouslyDisableSandbox` in this tool's terms) — sandboxed network access here was unreliable enough under the burst of parallel Maven-dependency downloads a fully-clean build triggers that it repeatedly timed out or partially failed, corrupting the Gradle module cache until a full `rm -rf ~/.gradle/caches` reset.
- **iOS:** a device-installable `.ipa` needs Xcode signed into an active Apple ID (Settings → Accounts) — a certificate already existing in the keychain isn't sufficient on its own; `xcodebuild -allowProvisioningUpdates` still needs a live, authenticated account to actually mint a provisioning profile.
- **Given both of the above, EAS cloud builds were the actually-reliable path** for this session — no local toolchain flakiness, and it's what surfaced the crash above. `eas build --platform <ios|android> --profile preview` needs an `EXPO_TOKEN` (or interactive `eas login`) and, the first time for each platform, a one-time interactive credential-setup step that can't be scripted (`--non-interactive` fails cleanly with "EAS CLI couldn't find any credentials suitable for internal distribution" until that's done once).
- **Raw APK size context:** an EAS `preview`-profile Android build is a **universal APK** (all 4 CPU architectures bundled together, ~90MB of that alone) with no ProGuard/R8 minification — expect it to be roughly 2–3× the size of what actually ships to a user's device via Play Store's per-architecture `.aab` delivery. See the build-size numbers from that run in the conversation this session; this doc is about the fixes, not a live size reading (it'll drift as dependencies change).

## Cosmetic: commented-out "Tools Grid" section

Per explicit request, the "Tools Grid" section on the `LoginSignup` screen (Storevia Land / Candy / Pay Utilities / Vouchers / Pickup Points / PayLater / Choice / Messages) is now commented out, same pattern as the pre-existing "My Orders" section right above it (`{/* ... */}`, not deleted — the JSX is preserved for later re-enabling). This makes the `GridItem` sub-component show up as an unused-variable lint warning, same as `OrderIcon` above it — expected, both are the same "hidden for now, not forgotten" case; see `QA_REPORT.md`'s note on the original `OrderIcon` instance for why this is left as a warning rather than "fixed" by deleting the component.
