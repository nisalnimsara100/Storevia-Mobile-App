import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';
import { CartProviderWrapper } from './context/cartProviderWrapper';

if (typeof setImmediate === 'undefined') {
  global.setImmediate = ((fn: any, ...args: any[]) =>
    setTimeout(fn, 0, ...args)) as any;
}

// Routes whose header sits full-bleed against the status bar in a dark/
// colored background (orange), needing light (white) status bar icons.
// Every other route defaults to dark (black) icons, for the light
// backgrounds the rest of the app uses.
//
// Centralized here (driven by the current pathname) rather than declared
// per-screen: tab screens stay mounted when you switch tabs, so a
// declarative <StatusBar> in each one only fires once, on first visit — it
// doesn't re-assert itself on later tab switches, and a screen with no
// <StatusBar> at all silently inherits whatever the last-visited screen set.
// Watching the pathname in one place avoids both failure modes.
const LIGHT_STATUS_BAR_ROUTES = new Set([
  '/Home',
  '/Cart',
  '/Messages',
  '/screens/checkout_screen',
]);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
  });

  const pathname = usePathname();

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setStatusBarStyle(LIGHT_STATUS_BAR_ROUTES.has(pathname) ? 'light' : 'dark');
  }, [pathname]);

  if (!fontsLoaded) return null;

  return (
    <CartProviderWrapper>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CartProviderWrapper>
  );
}
