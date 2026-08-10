import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { CartProviderWrapper } from './context/cartProviderWrapper';

if (typeof setImmediate === 'undefined') {
  global.setImmediate = ((fn: any, ...args: any[]) =>
    setTimeout(fn, 0, ...args)) as any;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <CartProviderWrapper>
      {/* App-wide default: dark (black) status bar icons, for the light-background
          screens most of the app uses. Screens with a dark/colored header
          (e.g. Home, checkout) render their own <StatusBar style="light" />
          to override this while they're focused. */}
      <StatusBar style="dark" />
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
