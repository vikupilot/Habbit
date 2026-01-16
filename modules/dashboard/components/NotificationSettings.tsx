import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ScrollView, StyleSheet } from 'react-native';
import { X, Bell, BellOff } from 'lucide-react-native';
import { profileStyles } from '../../../styles/profileStyles';
import { Colors, Spacing, Typography, BorderRadius } from '../../../styles/theme';
import { apiClient } from '../../../utils/api';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(20);
  const [minute, setMinute] = useState(0);
  const [loading, setLoading] = useState(false);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && enabled) {
      // Scroll to selected time after a short delay
      setTimeout(() => {
        scrollToHour(hour);
        scrollToMinute(minute);
      }, 100);
    }
  }, [visible, enabled, hour, minute]);

  const loadSettings = async () => {
    try {
      const settings = await apiClient.getNotificationSettings();
      setEnabled(settings.enabled);
      setHour(settings.hour);
      setMinute(settings.minute);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const scrollToHour = (h: number) => {
    if (hourScrollRef.current) {
      hourScrollRef.current.scrollTo({
        y: h * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const scrollToMinute = (m: number) => {
    if (minuteScrollRef.current) {
      minuteScrollRef.current.scrollTo({
        y: m * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const handleHourScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const selectedHour = Math.max(0, Math.min(23, Math.round(y / ITEM_HEIGHT)));
    if (selectedHour !== hour) {
      setHour(selectedHour);
    }
  };

  const handleMinuteScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const selectedMinute = Math.max(0, Math.min(59, Math.round(y / ITEM_HEIGHT)));
    if (selectedMinute !== minute) {
      setMinute(selectedMinute);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.updateNotificationSettings(enabled, hour, minute);
      Alert.alert('Success', 'Notification settings saved successfully');
      onClose();
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', error.message || 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const displayMinute = m.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const renderPickerColumn = (
    items: number[],
    selectedValue: number,
    onScroll: (event: any) => void,
    scrollRef: React.RefObject<ScrollView>,
    onValueChange: (value: number) => void
  ) => {
    return (
      <View style={styles.pickerColumn}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onScroll}
          onScrollEndDrag={onScroll}
          contentContainerStyle={styles.pickerContent}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.pickerItem,
                selectedValue === item && styles.pickerItemSelected,
              ]}
              onPress={() => {
                onValueChange(item);
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    y: item * ITEM_HEIGHT,
                    animated: true,
                  });
                }
              }}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  selectedValue === item && styles.pickerItemTextSelected,
                ]}
              >
                {item.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.pickerOverlay} pointerEvents="none" />
      </View>
    );
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
            <Text style={profileStyles.modalTitle}>Notification Settings</Text>
            <TouchableOpacity
              onPress={onClose}
              style={profileStyles.modalCloseButton}
            >
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.modalDescription}>
            Set a daily reminder to plan your next day in advance and keep your habits intact.
          </Text>

          {/* Enable/Disable Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, enabled && styles.toggleButtonActive]}
              onPress={() => setEnabled(!enabled)}
              activeOpacity={0.7}
            >
              <View style={styles.toggleContent}>
                {enabled ? (
                  <Bell size={20} color={Colors.white} />
                ) : (
                  <BellOff size={20} color={Colors.gray600} />
                )}
                <Text
                  style={[
                    styles.toggleText,
                    enabled && styles.toggleTextActive,
                  ]}
                >
                  {enabled ? 'Notifications Enabled' : 'Notifications Disabled'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Time Picker */}
          {enabled && (
            <View style={styles.timePickerContainer}>
              <Text style={[profileStyles.modalLabel, { marginBottom: Spacing.md }]}>
                Reminder Time
              </Text>
              <Text style={[profileStyles.modalDescription, { marginBottom: Spacing.lg, fontSize: Typography.xs }]}>
                You'll receive a notification at this time every day to plan your next day.
              </Text>

              <View style={styles.timePicker}>
                {renderPickerColumn(
                  Array.from({ length: 24 }, (_, i) => i),
                  hour,
                  handleHourScroll,
                  hourScrollRef,
                  setHour
                )}
                <Text style={styles.timeSeparator}>:</Text>
                {renderPickerColumn(
                  Array.from({ length: 60 }, (_, i) => i),
                  minute,
                  handleMinuteScroll,
                  minuteScrollRef,
                  setMinute
                )}
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeDisplayText}>
                    {formatTime(hour, minute)}
                  </Text>
                </View>
              </View>
            </View>
          )}

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

const styles = StyleSheet.create({
  toggleContainer: {
    marginVertical: Spacing.lg,
  },
  toggleButton: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  toggleButtonActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  toggleText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.gray600,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  timePickerContainer: {
    marginVertical: Spacing.lg,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    position: 'relative',
  },
  pickerColumn: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
  },
  pickerContent: {
    paddingVertical: ITEM_HEIGHT,
    paddingHorizontal: Spacing.xs,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
  },
  pickerItemText: {
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
    color: Colors.gray600,
  },
  pickerItemTextSelected: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  pickerOverlay: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray200,
    pointerEvents: 'none',
  },
  timeSeparator: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginHorizontal: Spacing.xs,
  },
  timeDisplay: {
    marginLeft: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  timeDisplayText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.black,
  },
});

