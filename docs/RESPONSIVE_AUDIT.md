# Responsive / Cross-Device Audit — 2026-08

Checked how the app behaves across phone sizes (small phones like iPhone SE/older Android at ~320–375pt wide, up to Pro Max-class phones at ~430pt) and the tablet target (`app.json` sets `ios.supportsTablet: true`, so iPad is a real target, not theoretical).

## Fixed this pass

**All 9 settings screens used a fake safe-area hack instead of real safe-area handling.** Every screen under `app/screens/settings_screen/` had `<View className="flex-1 bg-gray-100 mt-[10%]">` as its root — using 10% of screen _height_ as a stand-in for the status-bar/notch safe area. This is wrong on every device, in both directions:

- The real safe-area inset (status bar + notch/Dynamic Island) is a **fixed pixel value** (~44–59pt on iOS), not proportional to screen height.
- On a short device (iPhone SE, ~667pt tall), 10% ≈ 67pt — close to correct, coincidentally.
- On a tall device (iPhone 15 Pro Max, ~932pt tall), 10% ≈ 93pt — roughly 35–50pt more than the actual safe area, pushing every settings screen's header down and wasting vertical space, inconsistently with every other screen in the app (which already use real `SafeAreaView`/safe-area insets).

Replaced all 9 with `SafeAreaView` from `react-native-safe-area-context` (`edges={['top']}`) — the same library and pattern already used correctly in 16 other screens in the app. This is a real fix, not cosmetic: it makes header position correct and consistent across every physical device size, not just the one the original author happened to test on.

## Confirmed clean

- No hardcoded pixel widths ≥300 that would risk clipping content on the narrowest supported phones (~320–375pt wide). Layouts consistently use `flex`/percentage/`'100%'` widths for anything that could plausibly overflow.

## Open findings (documented, not fixed — see reasoning)

### 1. `Dimensions.get('window')` used instead of `useWindowDimensions()` in 8 files

`Dimensions.get('window')` is called at module or component scope (not through the reactive hook) in `Home.tsx`, `Account.tsx`, `LoginSignup.tsx`, `item_details/Ratings.tsx`, and 4 files under `activity_screen/`. This snapshots the window size **once** and never updates — React Native's own docs recommend `useWindowDimensions()` specifically because `Dimensions.get()` goes stale.

On phones this mostly doesn't matter in practice since `app.json` locks `"orientation": "portrait"`. It matters on iPad: `supportsTablet: true` means iPadOS multitasking (Split View / Slide Over) is available, which resizes the app's window at runtime **without rotating the device** — something portrait-lock does nothing to prevent. A `scale()` helper computed once from a stale window width will misjudge every size after a Split View resize.

Not fixed here: converting these files isn't a one-line change — in most of them `Dimensions.get('window')` backs a module-level `scale(size)` helper used throughout the file's `StyleSheet`, so switching to the hook means moving that helper inside the component body and re-threading it through every call site. That's a real per-file refactor each needing a visual check, not a safe blind sweep.

### 2. Product grids use a fixed `numColumns={2}` regardless of screen width

`Home.tsx` and `app/search/index.tsx` both render their product `FlatList` with `numColumns={2}` unconditionally. On a phone this is correct. On an iPad (`supportsTablet: true`), a 2-column grid across ~1024pt of width means each product card renders roughly 3x wider than its phone-designed proportions — usable, but visibly not designed for the screen. Making this responsive (e.g. deriving column count from `useWindowDimensions()` width breakpoints) is a real feature addition, not a bug fix, and depends on resolving finding #1 first (the same hook). Documented here as a known gap rather than attempted blind.

### 3. Related: inconsistent `react-native-size-matters` usage (see `THEME_AUDIT.md` #4)

Already documented there — `scale`/`verticalScale`/`moderateScale` are used outside the one variant `design.md` says they should be limited to. Relevant here too since it's the same category of "sizing that should be responsive but is applied inconsistently."

## Recommendation

Tackle #1 (the `useWindowDimensions` migration) one file at a time, verified visually per file since each has a different `scale()` call-site footprint. #2 depends on #1 and is lower priority unless tablet usage is actually significant for this app. Neither blocks phone users today given the portrait lock.
