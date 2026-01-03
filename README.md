# Habbit

A React Native Hello World application built with Expo.

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

- `App.js` - Main application component with Hello World
- `app.json` - Expo configuration file
- `package.json` - Project dependencies and scripts
- `babel.config.js` - Babel configuration for Expo

## Features

- ✅ Expo managed workflow
- ✅ Easy development with Expo Go
- ✅ Cross-platform (iOS, Android, Web)
- ✅ Hot reloading
- ✅ No native code setup required

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo GitHub](https://github.com/expo/expo)
