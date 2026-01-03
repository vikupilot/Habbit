# Habbit

A React Native application built with Expo, featuring modern UI libraries and tools.

## Tech Stack

- **UI**: Tamagui
- **Animation**: React Native Reanimated + Gesture Handler
- **Navigation**: Expo Router
- **Icons**: Lucide Icons
- **Fonts**: Inter / Manrope / Satoshi (see FONTS_SETUP.md)
- **Storage**: MMKV (fast) or AsyncStorage (simple)
- **Theming**: Tamagui Theme System

## Getting Started

### Prerequisites

- Node.js (>= 16)
- npm or yarn
- Expo Go app (optional, for testing on physical devices):
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

1. Install dependencies:
```bash
npm install
```

or

```bash
yarn install
```

2. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

or

```bash
npm install -g @expo/cli
```

### Running the App

#### Start the Expo development server
```bash
npm start
```

or

```bash
yarn start
```

This will open the Expo DevTools in your browser. You can then:

- **Scan QR code with Expo Go**: Use the Expo Go app on your phone to scan the QR code
- **Press `a`**: Open on Android emulator
- **Press `i`**: Open on iOS simulator (macOS only)
- **Press `w`**: Open in web browser

#### Run on specific platform
```bash
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Web browser
```

## Project Structure

- `app/` - Expo Router file-based routing
  - `_layout.tsx` - Root layout with Tamagui provider
  - `index.tsx` - Home screen
- `utils/` - Utility functions
  - `storage.ts` - MMKV and AsyncStorage helpers
- `tamagui.config.ts` - Tamagui configuration
- `babel.config.js` - Babel configuration (includes Reanimated plugin)
- `app.json` - Expo configuration file
- `package.json` - Project dependencies and scripts

## Features

- ✅ Expo managed workflow
- ✅ Expo Router for navigation
- ✅ Tamagui UI components
- ✅ React Native Reanimated for animations
- ✅ Gesture Handler for gestures
- ✅ Lucide icons
- ✅ MMKV & AsyncStorage for data persistence
- ✅ Custom fonts support (Inter, Manrope, Satoshi)
- ✅ Cross-platform (iOS, Android, Web)
- ✅ Hot reloading

## Setup Instructions

### Fonts
See [FONTS_SETUP.md](./FONTS_SETUP.md) for instructions on adding custom fonts.

### Storage
Storage utilities are available in `utils/storage.ts`:
- **MMKV**: Fast, synchronous key-value storage
- **AsyncStorage**: Simple, asynchronous key-value storage

Example:
```typescript
import { mmkv, asyncStorage } from './utils/storage';

// MMKV (synchronous, faster)
mmkv.set('key', 'value');
const value = mmkv.getString('key');

// AsyncStorage (asynchronous)
await asyncStorage.setItem('key', 'value');
const value = await asyncStorage.getItem('key');
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Tamagui](https://tamagui.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Lucide Icons](https://lucide.dev/)
- [MMKV](https://github.com/mrousavy/react-native-mmkv)
