import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles } from '../../../styles/authStyles';

interface BackButtonProps {
  onPress?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={authStyles.backButton}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={authStyles.backButtonInner}>
        <ArrowLeft size={20} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

