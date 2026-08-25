/* eslint-disable @typescript-eslint/no-require-imports */
// RNTL v13 registers its matchers on import; no extend-expect entry point.
// AsyncStorage has no native module under Jest; both zustand stores persist
// through it, so without this every store import throws.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// The app reads this at module scope in several places; tests assert against
// request URLs, so pin it rather than depending on a local .env.
process.env.EXPO_PUBLIC_APP_BASE_URL = 'https://test.storevia.local';

// @expo/vector-icons pulls in expo-font -> expo-asset, which has no native
// module under Jest. Tests assert on accessibility labels and layout, not
// glyphs, so a stand-in is enough.
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, iconSet) => {
        if (iconSet === '__esModule') return true;
        const Icon = ({ name }) => <Text>{`${String(iconSet)}:${name}`}</Text>;
        Icon.displayName = String(iconSet);
        return Icon;
      },
    },
  );
});
