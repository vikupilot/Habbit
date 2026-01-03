import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { authStyles } from '../../../styles/authStyles';

interface SocialButtonsProps {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
  onApplePress?: () => void;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
}) => {
  const handlePress = (provider: string, customHandler?: () => void) => {
    if (customHandler) {
      customHandler();
    } else {
      Alert.alert(
        'Coming Soon',
        `${provider} sign-in will be available in version 2.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={authStyles.socialSection}>
      <View style={authStyles.divider}>
        <View style={authStyles.dividerLine} />
        <Text style={authStyles.dividerText}>• Or Continue with •</Text>
        <View style={authStyles.dividerLine} />
      </View>

      <View style={authStyles.socialButtons}>
        <TouchableOpacity
          style={authStyles.socialButton}
          onPress={() => handlePress('Google', onGooglePress)}
          activeOpacity={0.7}
        >
          <Text style={authStyles.socialButtonText}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[authStyles.socialButton, authStyles.socialButtonDark]}
          onPress={() => handlePress('Facebook', onFacebookPress)}
          activeOpacity={0.7}
        >
          <Text style={authStyles.socialButtonTextDark}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={authStyles.socialButton}
          onPress={() => handlePress('Apple', onApplePress)}
          activeOpacity={0.7}
        >
          <Text style={authStyles.socialButtonText}>🍎</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

