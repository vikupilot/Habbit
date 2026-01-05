import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackButton, AuthInput, SocialButtons } from '../modules/auth';
import { authStyles } from '../styles';
import { apiClient } from '../utils/api';

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.signup(fullName, email, password);
      if (response.success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Could not create account. Please try again.');
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
          <Text style={authStyles.title}>Create Account</Text>
          <Text style={authStyles.subtitle}>
            Fill Your Details Or Continue With Social Media
          </Text>
        </View>

        {/* Form Fields */}
        <View style={authStyles.form}>
          <AuthInput
            type="name"
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

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

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[authStyles.primaryButton, loading && { opacity: 0.6 }]} 
            onPress={handleSignup}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.primaryButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Media Section */}
        <SocialButtons />

        {/* Terms */}
        <Text style={authStyles.termsText}>
          By Continuing Your Confirm That You Agree With Our{' '}
          <Text style={authStyles.termsLink}>Terms And Condition</Text>
        </Text>

        {/* Login Link */}
        <View style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>
            Already Have An Account?{' '}
            <Text
              style={authStyles.linkButton}
              onPress={() => router.push('/login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
