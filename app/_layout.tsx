import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { TamaguiProvider } from '@tamagui/core';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import config from '../tamagui.config';

export default function RootLayout() {
  // Fonts will be loaded when you add them to assets/fonts/
  // For now, we'll use system fonts
  const [fontsLoaded, fontError] = useFonts({
    // Uncomment and add fonts when you have them:
    // Inter: require('../assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    // 'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    // 'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    // Manrope: require('../assets/fonts/Manrope-Regular.ttf'),
    // 'Manrope-Medium': require('../assets/fonts/Manrope-Medium.ttf'),
    // 'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    // 'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
    // Satoshi: require('../assets/fonts/Satoshi-Regular.ttf'),
    // 'Satoshi-Medium': require('../assets/fonts/Satoshi-Medium.ttf'),
    // 'Satoshi-SemiBold': require('../assets/fonts/Satoshi-SemiBold.ttf'),
    // 'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.ttf'),
  });

  useEffect(() => {
    if (fontError) {
      console.log('Font loading error:', fontError);
    }
  }, [fontError]);

  // Don't block rendering if fonts aren't loaded
  // return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

