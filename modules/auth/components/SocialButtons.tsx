import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { authStyles } from '../../../styles/authStyles';

interface SocialButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  loading?: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGooglePress,
  onApplePress,
  loading = false,
}) => {
  return (
    <View style={authStyles.oauthContainer}>
      {/* Google Button */}
      <TouchableOpacity
        style={[authStyles.oauthButton, loading && { opacity: 0.6 }]}
        onPress={onGooglePress}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="large" />
        ) : (
          <>
            <Text style={authStyles.oauthButtonIcon}>G</Text>
            <Text style={authStyles.oauthButtonText}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity
        style={[authStyles.oauthButton, authStyles.oauthButtonApple, loading && { opacity: 0.6 }]}
        onPress={onApplePress}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="large" />
        ) : (
          <>
            <Text style={authStyles.oauthButtonIcon}>🍎</Text>
            <Text style={authStyles.oauthButtonText}>Sign in with Apple</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

