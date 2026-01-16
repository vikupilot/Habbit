import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackButton } from '../modules/auth';
import { HabbitPyramid } from '../modules/common/components/HabbitPyramid';
import { authStyles } from '../styles/authStyles';
import { apiClient } from '../utils/api';
import { signInWithGoogle, GOOGLE_REDIRECT_URI, verifyRedirectUri } from '../utils/googleAuth';
import { signInWithApple } from '../utils/appleAuth';

export default function LoginScreen() {
  const router = useRouter();
  const [socialLoading, setSocialLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Verify redirect URI and client ID on component mount (for debugging)
  useEffect(() => {
    verifyRedirectUri();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoogleSignIn = async () => {
    setSocialLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result) {
        setSocialLoading(false);
        return; // User canceled
      }

      const response = await apiClient.signInWithGoogle(result.code, GOOGLE_REDIRECT_URI);
      if (response.success) {
        router.replace('/home');
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setSocialLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading(true);
    try {
      const result = await signInWithApple();
      if (!result) {
        setSocialLoading(false);
        return; // User canceled or not available
      }

      Alert.alert('Coming Soon', 'Apple Sign-In will be available soon.');
    } catch (error: any) {
      Alert.alert('Apple Sign-In Failed', error.message || 'Failed to sign in with Apple. Please try again.');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[authStyles.scrollContent, { justifyContent: 'center' }]}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Animated Header */}
        <Animated.View
          style={[
            authStyles.header,
            authStyles.animatedHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={authStyles.title}>Welcome to Habbit</Text>
          <Text style={authStyles.subtitle}>
            Build better habits, one day at a time
          </Text>
        </Animated.View>

        {/* Animated Habbit Pyramid */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
              marginTop: -40,
              marginBottom: 20,
            },
          ]}
        >
          <HabbitPyramid size={220} />
        </Animated.View>

        {/* Sign in prompt - Above buttons */}
        <Text style={authStyles.signInPrompt}>Sign in with your favorite social media</Text>

        {/* OAuth Buttons - Minimalistic */}
        <Animated.View
          style={[
            authStyles.oauthContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
            },
          ]}
        >
          {/* Google Button */}
          <TouchableOpacity
            style={[authStyles.oauthButton, socialLoading && { opacity: 0.6 }]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={socialLoading}
          >
            {socialLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={authStyles.oauthButtonIcon}>G</Text>
            )}
          </TouchableOpacity>

          {/* Apple Button */}
          <TouchableOpacity
            style={[authStyles.oauthButton, authStyles.oauthButtonApple, socialLoading && { opacity: 0.6 }]}
            onPress={handleAppleSignIn}
            activeOpacity={0.8}
            disabled={socialLoading}
          >
            {socialLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={authStyles.oauthButtonIcon}>🍎</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
