import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackButton, AuthInput } from '../modules/auth';
import { authStyles } from '../styles/authStyles';
import { apiClient } from '../utils/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    if (!token) {
      Alert.alert('Invalid Link', 'This password reset link is invalid or missing.', [
        { text: 'OK', onPress: () => router.replace('/forgot-password') },
      ]);
    }
  }, [token]);

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert('Error', 'Invalid reset token');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.resetPassword(token, password);
      if (response.success) {
        setPasswordReset(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (passwordReset) {
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
            <Text style={authStyles.title}>Password Reset!</Text>
            <Text style={authStyles.subtitle}>
              Your password has been successfully reset. You can now sign in with your new password.
            </Text>
          </View>

          <View style={authStyles.form}>
            <TouchableOpacity
              style={authStyles.primaryButton}
              onPress={() => router.replace('/login')}
              activeOpacity={0.8}
            >
              <Text style={authStyles.primaryButtonText}>Go to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!token) {
    return null; // Will redirect in useEffect
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
          <Text style={authStyles.title}>Reset Password</Text>
          <Text style={authStyles.subtitle}>
            Enter your new password below.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={authStyles.form}>
          <AuthInput
            type="password"
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <AuthInput
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[authStyles.primaryButton, loading && { opacity: 0.6 }]}
            onPress={handleResetPassword}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.primaryButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>
              Remember your password?{' '}
              <Text style={authStyles.linkButton} onPress={() => router.replace('/login')}>
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

