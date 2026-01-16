import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, User, Settings, LogOut, Star, Target, HelpCircle, Share2, ChevronDown, ChevronUp, Bell } from 'lucide-react-native';
import { profileStyles } from '../styles/profileStyles';
import { StreakSettingsModal } from '../modules/dashboard/components/StreakSettings';
import { GenderSettingsModal } from '../modules/dashboard/components/GenderSettings';
import { NotificationSettingsModal } from '../modules/dashboard/components/NotificationSettings';
import { Spacing } from '../styles/theme';
import { apiClient } from '../utils/api';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  gender?: 'male' | 'female' | null;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [streakSettingsVisible, setStreakSettingsVisible] = useState(false);
  const [genderSettingsVisible, setGenderSettingsVisible] = useState(false);
  const [notificationSettingsVisible, setNotificationSettingsVisible] = useState(false);
  const [userDetailsExpanded, setUserDetailsExpanded] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Try to load from API first to get latest data including gender
      try {
        const userData = await apiClient.getMe();
        const userWithGender: UserData = {
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          gender: (userData.gender === 'male' || userData.gender === 'female') ? userData.gender : null,
        };
        setUser(userWithGender);
        await AsyncStorage.setItem('user', JSON.stringify(userWithGender));
      } catch (apiError) {
        // Fallback to local storage if API fails
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser({
            ...parsed,
            gender: (parsed.gender === 'male' || parsed.gender === 'female') ? parsed.gender : null,
          });
        } else {
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      router.replace('/login');
    }
  };

  const getGenderIcon = () => {
    if (user?.gender === 'male') return '👨';
    if (user?.gender === 'female') return '👩';
    return '👤';
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.replace('/');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleHelpAndFeedback = () => {
    Alert.alert(
      'Help & Feedback',
      'We\'d love to hear from you! How can we help?',
      [
        {
          text: 'Send Feedback',
          onPress: () => {
            const email = 'support@habbit.app';
            const subject = 'Habbit App Feedback';
            const body = `Hi Habbit Team,\n\nI would like to share the following feedback:\n\n`;
            const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            Linking.openURL(mailtoUrl).catch(() => {
              Alert.alert('Error', 'Could not open email client. Please email us at support@habbit.app');
            });
          },
        },
        {
          text: 'View Help',
          onPress: () => {
            Alert.alert(
              'Help',
              'Need assistance? Here are some common questions:\n\n• How to create tasks?\n• How to set up streaks?\n• How to manage favorites?\n\nFor more help, email us at support@habbit.app',
              [{ text: 'OK' }]
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Habbit',
      'Enjoying Habbit? We\'d love your feedback!',
      [
        {
          text: 'Rate 5 Stars',
          onPress: () => {
            const appStoreUrl = Platform.select({
              ios: 'https://apps.apple.com/app/id123456789', // Replace with actual App Store ID
              android: 'https://play.google.com/store/apps/details?id=com.habbit.app',
            });
            if (appStoreUrl) {
              Linking.openURL(appStoreUrl).catch(() => {
                Alert.alert('Error', 'Could not open app store');
              });
            } else {
              Alert.alert('Thank you!', 'We appreciate your support! ⭐⭐⭐⭐⭐');
            }
          },
        },
        {
          text: 'Maybe Later',
          style: 'cancel',
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out Habbit - Your personal habit and task tracker! Download it now and start building better habits.',
        title: 'Share Habbit App',
        url: Platform.select({
          ios: 'https://apps.apple.com/app/id123456789', // Replace with actual App Store URL
          android: 'https://play.google.com/store/apps/details?id=com.habbit.app',
        }),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not share app');
    }
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={profileStyles.header}>
          <TouchableOpacity
            style={profileStyles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#000000" />
          </TouchableOpacity>
          <View style={profileStyles.headerSpacer} />
        </View>

        {/* User Profile Section */}
        <View style={profileStyles.profileSection}>
          <TouchableOpacity 
            style={profileStyles.avatarContainer} 
            activeOpacity={0.8}
            onPress={() => setGenderSettingsVisible(true)}
          >
            <View style={profileStyles.avatar}>
              <Text style={{ fontSize: 40 }}>{getGenderIcon()}</Text>
            </View>
            <View style={profileStyles.avatarBadge}>
              <Text style={profileStyles.avatarBadgeText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={profileStyles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={profileStyles.userEmail}>{user?.email || ''}</Text>
          
          {/* Expandable Arrow */}
          <TouchableOpacity
            style={profileStyles.expandButton}
            onPress={() => setUserDetailsExpanded(!userDetailsExpanded)}
            activeOpacity={0.7}
          >
            {userDetailsExpanded ? (
              <ChevronUp size={24} color="#000000" />
            ) : (
              <ChevronDown size={24} color="#000000" />
            )}
          </TouchableOpacity>
        </View>

        {/* User Details Section */}
        {userDetailsExpanded && (
          <View style={profileStyles.section}>
            <View style={profileStyles.detailCard}>
              <View style={profileStyles.detailRow}>
                <Text style={profileStyles.detailLabel}>Full Name</Text>
                <Text style={profileStyles.detailValue}>{user?.fullName || 'N/A'}</Text>
              </View>
              <View style={profileStyles.detailDivider} />
              <View style={profileStyles.detailRow}>
                <Text style={profileStyles.detailLabel}>Email</Text>
                <Text style={profileStyles.detailValue}>{user?.email || 'N/A'}</Text>
              </View>
              <View style={profileStyles.detailDivider} />
              <View style={profileStyles.detailRow}>
                <Text style={profileStyles.detailLabel}>Gender</Text>
                <TouchableOpacity
                  onPress={() => setGenderSettingsVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[profileStyles.detailValue, { color: '#000000', textDecorationLine: 'underline' }]}>
                    {user?.gender === 'male' ? 'Male' : user?.gender === 'female' ? 'Female' : 'Not Set'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={profileStyles.detailDivider} />
              <View style={profileStyles.detailRow}>
                <Text style={profileStyles.detailLabel}>User ID</Text>
                <Text style={profileStyles.detailValue}>{user?.id || 'N/A'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Settings Section */}
        <View style={[profileStyles.section, { marginTop: 0, marginBottom: Spacing.sm }]}>
          <Text style={profileStyles.sectionTitle}>Settings</Text>
          <TouchableOpacity
            style={profileStyles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              router.push('/favorites');
            }}
          >
            <View style={profileStyles.menuItemLeft}>
              <View style={profileStyles.menuIcon}>
                <Star size={20} color="#000000" />
              </View>
              <Text style={profileStyles.menuItemText}>Manage Favorites</Text>
            </View>
            <Text style={profileStyles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[profileStyles.menuItem, { marginTop: Spacing.sm }]}
            activeOpacity={0.7}
            onPress={() => setStreakSettingsVisible(true)}
          >
            <View style={profileStyles.menuItemLeft}>
              <View style={profileStyles.menuIcon}>
                <Target size={20} color="#000000" />
              </View>
              <Text style={profileStyles.menuItemText}>Streak Settings</Text>
            </View>
            <Text style={profileStyles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[profileStyles.menuItem, { marginTop: Spacing.sm }]}
            activeOpacity={0.7}
            onPress={() => setNotificationSettingsVisible(true)}
          >
            <View style={profileStyles.menuItemLeft}>
              <View style={profileStyles.menuIcon}>
                <Bell size={20} color="#000000" />
              </View>
              <Text style={profileStyles.menuItemText}>Notification Settings</Text>
            </View>
            <Text style={profileStyles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={[profileStyles.section, { marginBottom: Spacing.lg }]}>
          <Text style={profileStyles.sectionTitle}>Support</Text>
          <TouchableOpacity
            style={profileStyles.menuItem}
            activeOpacity={0.7}
            onPress={handleHelpAndFeedback}
          >
            <View style={profileStyles.menuItemLeft}>
              <View style={profileStyles.menuIcon}>
                <HelpCircle size={20} color="#000000" />
              </View>
              <Text style={profileStyles.menuItemText}>Help & Feedback</Text>
            </View>
            <Text style={profileStyles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[profileStyles.menuItem, { marginTop: Spacing.sm }]}
            activeOpacity={0.7}
            onPress={handleRateApp}
          >
            <View style={profileStyles.menuItemLeft}>
              <View style={profileStyles.menuIcon}>
                <Star size={20} color="#FFD700" />
              </View>
              <Text style={profileStyles.menuItemText}>Rate App</Text>
            </View>
            <Text style={profileStyles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[profileStyles.menuItem, { marginTop: Spacing.sm }]}
            activeOpacity={0.7}
            onPress={handleShareApp}
          >
            <View style={profileStyles.menuItemLeft}>
              <View style={profileStyles.menuIcon}>
                <Share2 size={20} color="#000000" />
              </View>
              <Text style={profileStyles.menuItemText}>Share App</Text>
            </View>
            <Text style={profileStyles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={profileStyles.section}>
          <TouchableOpacity
            style={profileStyles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text style={profileStyles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Settings Modal */}
        <StreakSettingsModal
          visible={streakSettingsVisible}
          onClose={() => setStreakSettingsVisible(false)}
        />

        {/* Gender Settings Modal */}
        <GenderSettingsModal
          visible={genderSettingsVisible}
          onClose={() => setGenderSettingsVisible(false)}
          currentGender={user?.gender || null}
          onGenderUpdated={loadUser}
        />

        {/* Notification Settings Modal */}
        <NotificationSettingsModal
          visible={notificationSettingsVisible}
          onClose={() => setNotificationSettingsVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

