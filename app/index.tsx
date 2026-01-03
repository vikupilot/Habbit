import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AnimatedLogo } from '../modules/common/components/AnimatedLogo';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          {/* Animated Logo */}
          <AnimatedLogo />
        </View>
      </View>

      {/* Content Block */}
      <View style={styles.contentBlock}>
        <Text style={styles.title}>Build Better Habits</Text>
        <Text style={styles.description}>
          Track Your Daily Habits And Achieve Your Goals One Step At A Time.
        </Text>
        
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.push('/signup')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  contentBlock: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 50,
    minHeight: 280,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
