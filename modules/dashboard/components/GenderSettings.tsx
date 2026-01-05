import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { profileStyles } from '../../../styles/profileStyles';
import { Colors, Spacing, Typography, BorderRadius } from '../../../styles/theme';
import { apiClient } from '../../../utils/api';

interface GenderSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentGender: 'male' | 'female' | null;
  onGenderUpdated: () => void;
}

export const GenderSettingsModal: React.FC<GenderSettingsModalProps> = ({
  visible,
  onClose,
  currentGender,
  onGenderUpdated,
}) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(currentGender);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedGender(currentGender);
    }
  }, [visible, currentGender]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.updateProfile(undefined, selectedGender);
      Alert.alert('Success', 'Gender updated successfully');
      onGenderUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating gender:', error);
      Alert.alert('Error', 'Failed to update gender. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGenderIcon = (gender: 'male' | 'female' | null) => {
    if (gender === 'male') return '👨';
    if (gender === 'female') return '👩';
    return '👤';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={profileStyles.modalOverlay}>
        <View style={profileStyles.modalContent}>
          <View style={profileStyles.modalHeader}>
            <Text style={profileStyles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              onPress={onClose}
              style={profileStyles.modalCloseButton}
            >
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.modalDescription}>
            Choose your gender to personalize your profile.
          </Text>

          <View style={{ marginVertical: Spacing.lg }}>
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              {(['male', 'female', null] as const).map((gender) => (
                <TouchableOpacity
                  key={gender || 'none'}
                  style={[
                    {
                      flex: 1,
                      paddingVertical: Spacing.lg,
                      paddingHorizontal: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: Colors.inputBackground,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: 'transparent',
                    },
                    selectedGender === gender && {
                      backgroundColor: Colors.black,
                      borderColor: Colors.black,
                    },
                  ]}
                  onPress={() => setSelectedGender(gender)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 32, marginBottom: Spacing.xs }}>
                    {getGenderIcon(gender)}
                  </Text>
                  <Text
                    style={[
                      {
                        fontSize: Typography.sm,
                        fontWeight: Typography.semibold,
                        color: Colors.gray600,
                      },
                      selectedGender === gender && {
                        color: Colors.white,
                      },
                    ]}
                  >
                    {gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Not Set'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              profileStyles.modalButton,
              loading && { opacity: 0.6 },
            ]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={profileStyles.modalButtonText}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

