import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackButton, AuthInput, SocialButtons } from '../modules/auth';
import { authStyles } from '../styles/authStyles';
import { apiClient } from '../utils/api';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.login(email, password);
      if (response.success) {
        router.replace('/home');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={authStyles.title}>Welcome Back</Text>
          <Text style={authStyles.subtitle}>
            Fill Your Details Or Continue With Social Media
          </Text>
        </View>

        {/* Form Fields */}
        <View style={authStyles.form}>
          <AuthInput
            type="email"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            type="password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {/* Forgot Password */}
          <TouchableOpacity 
            style={authStyles.forgotPassword}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[authStyles.primaryButton, loading && { opacity: 0.6 }]} 
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Media Section */}
        <SocialButtons />

        {/* Sign Up Link */}
        <View style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>
            Don't Have An Account?{' '}
            <Text
              style={authStyles.linkButton}
              onPress={() => router.push('/signup')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
