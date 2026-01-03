import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(scale.value === 1 ? 1.2 : 1);
    setPressed(!pressed);
  };

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const cardBg = isDark ? '#1C1C1E' : '#F5F5F5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Hello World!
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Welcome to React Native with Expo
          </Text>
          <Text style={[styles.description, { color: textColor }]}>
            Powered by Tamagui, Reanimated & Expo Router
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Libraries Installed
          </Text>
          <View style={styles.list}>
            <View style={styles.listItem}>
              <View style={{ width: 16, height: 16, backgroundColor: '#FF6B6B', borderRadius: 8 }} />
              <Text style={[styles.listText, { color: textColor }]}>
                Tamagui UI
              </Text>
            </View>
            <View style={styles.listItem}>
              <View style={{ width: 16, height: 16, backgroundColor: '#4ECDC4', borderRadius: 8 }} />
              <Text style={[styles.listText, { color: textColor }]}>
                React Native Reanimated
              </Text>
            </View>
            <View style={styles.listItem}>
              <View style={{ width: 16, height: 16, backgroundColor: '#95E1D3', borderRadius: 8 }} />
              <Text style={[styles.listText, { color: textColor }]}>
                Gesture Handler
              </Text>
            </View>
            <View style={styles.listItem}>
              <View style={{ width: 16, height: 16, backgroundColor: '#F38181', borderRadius: 8 }} />
              <Text style={[styles.listText, { color: textColor }]}>
                Expo Router
              </Text>
            </View>
          </View>
        </View>

        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={handlePress}
            style={[styles.button, { backgroundColor: '#007AFF' }]}
          >
            <Text style={styles.buttonText}>
              {pressed ? 'Pressed!' : 'Tap Me (Reanimated)'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.infoText, { color: textColor }]}>
            Fonts: Inter, Manrope, Satoshi (add to assets/fonts/)
          </Text>
          <Text style={[styles.infoText, { color: textColor }]}>
            Storage: MMKV & AsyncStorage ready
          </Text>
          <Text style={[styles.infoText, { color: textColor }]}>
            Icons: Lucide React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listText: {
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
