import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, User, Settings, LogOut, Star } from 'lucide-react-native';
import { profileStyles } from '../styles/profileStyles';

interface UserData {
  id: string;
  fullName: string;
  email: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
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
          <Text style={profileStyles.headerTitle}>Profile</Text>
          <View style={profileStyles.headerSpacer} />
        </View>

        {/* User Profile Section */}
        <View style={profileStyles.profileSection}>
          <TouchableOpacity style={profileStyles.avatarContainer} activeOpacity={0.8}>
            <View style={profileStyles.avatar}>
              <User size={40} color="#000000" />
            </View>
            <View style={profileStyles.avatarBadge}>
              <Text style={profileStyles.avatarBadgeText}>+</Text>
            </View>
          </TouchableOpacity>
          <Text style={profileStyles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={profileStyles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* User Details Section */}
        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>User Details</Text>
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
              <Text style={profileStyles.detailLabel}>User ID</Text>
              <Text style={profileStyles.detailValue}>{user?.id || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={profileStyles.section}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

