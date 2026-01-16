import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { getStreakSettings, saveStreakSettings, StreakSettings } from '../../../utils/streakCalculator';
import { profileStyles } from '../../../styles/profileStyles';
import { dashboardStyles } from '../../../styles/dashboardStyles';
import { Colors, Spacing, Typography, BorderRadius } from '../../../styles/theme';

interface StreakSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const StreakSettingsModal: React.FC<StreakSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const [minTasksPerDay, setMinTasksPerDay] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const settings = await getStreakSettings();
      setMinTasksPerDay(settings.minTasksPerDay);
    } catch (error) {
      console.error('Error loading streak settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const settings: StreakSettings = { minTasksPerDay };
      await saveStreakSettings(settings);
      Alert.alert('Success', 'Streak settings saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving streak settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Text style={profileStyles.modalTitle}>Streak Settings</Text>
            <TouchableOpacity
              onPress={onClose}
              style={profileStyles.modalCloseButton}
            >
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.modalDescription}>
            Set the minimum number of completed tasks required per day to maintain your streak.
          </Text>

          <View style={{ marginVertical: Spacing.lg }}>
            <Text style={[profileStyles.modalLabel, { marginBottom: Spacing.md }]}>
              Minimum Tasks Per Day
            </Text>
            <Text style={[profileStyles.modalDescription, { marginBottom: Spacing.md, fontSize: Typography.xs }]}>
              Your streak will continue only if you complete at least this many tasks each day.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    {
                      width: '18%',
                      paddingVertical: Spacing.md,
                      paddingHorizontal: Spacing.xs,
                      borderRadius: BorderRadius.md,
                      backgroundColor: Colors.inputBackground,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 50,
                    },
                    minTasksPerDay === value && {
                      backgroundColor: Colors.black,
                    },
                  ]}
                  onPress={() => setMinTasksPerDay(value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      {
                        fontSize: Typography.base,
                        fontWeight: Typography.semibold,
                        color: Colors.gray600,
                      },
                      minTasksPerDay === value && {
                        color: Colors.white,
                      },
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ marginTop: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[profileStyles.modalDescription, { fontSize: Typography.xs, color: Colors.gray600 }]}>
                Current setting: {minTasksPerDay} task{minTasksPerDay !== 1 ? 's' : ''} per day
              </Text>
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
              {loading ? 'Saving...' : 'Save Settings'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

