import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackButton, AuthInput } from '../modules/auth';
import { authStyles } from '../styles/authStyles';
import { apiClient } from '../utils/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.forgotPassword(email);
      if (response.success) {
        setEmailSent(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={authStyles.container}>
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BackButton />

          {/* Success Message */}
          <View style={authStyles.header}>
            <Text style={authStyles.title}>Check Your Email</Text>
            <Text style={authStyles.subtitle}>
              We've sent a password reset link to{'\n'}
              <Text style={{ fontWeight: '600' }}>{email}</Text>
            </Text>
          </View>

          <View style={authStyles.form}>
            <Text style={[authStyles.subtitle, { marginBottom: 24, textAlign: 'center' }]}>
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </Text>

            <Text style={[authStyles.subtitle, { marginBottom: 24, textAlign: 'center', fontSize: 12 }]}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>

            <TouchableOpacity
              style={authStyles.primaryButton}
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
              activeOpacity={0.8}
            >
              <Text style={authStyles.primaryButtonText}>Send Another Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[authStyles.linkContainer, { marginTop: 20 }]}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Back to <Text style={authStyles.linkButton}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Header */}
        <View style={authStyles.header}>
          <Text style={authStyles.title}>Forgot Password?</Text>
          <Text style={authStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={authStyles.form}>
          <AuthInput
            type="email"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Send Reset Link Button */}
          <TouchableOpacity
            style={[authStyles.primaryButton, loading && { opacity: 0.6 }]}
            onPress={handleForgotPassword}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.primaryButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>
              Remember your password?{' '}
              <Text style={authStyles.linkButton} onPress={() => router.back()}>
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

