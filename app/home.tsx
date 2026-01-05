import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutDashboard, Calendar } from 'lucide-react-native';
import DashboardScreen from './dashboard';
import PlannerScreen from './planner';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner'>('planner');
  const [showFloatingNav, setShowFloatingNav] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // If no user data, redirect to login
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {activeTab === 'dashboard' ? (
          <DashboardScreen />
        ) : (
          <PlannerScreen onScrollChange={(isScrollingUp) => setShowFloatingNav(!isScrollingUp)} />
        )}
      </View>

      {/* Floating Navigation Buttons */}
      {showFloatingNav && (
        <SafeAreaView style={styles.floatingButtonsContainer} edges={['bottom']}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.floatingButton,
                activeTab === 'dashboard' && styles.floatingButtonActive,
              ]}
              onPress={() => setActiveTab('dashboard')}
              activeOpacity={0.8}
            >
              <LayoutDashboard
                size={20}
                color={activeTab === 'dashboard' ? '#000000' : '#FFFFFF'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.floatingButton,
                activeTab === 'planner' && styles.floatingButtonActive,
              ]}
              onPress={() => setActiveTab('planner')}
              activeOpacity={0.8}
            >
              <Calendar
                size={20}
                color={activeTab === 'planner' ? '#000000' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonActive: {
    backgroundColor: '#FFFFFF',
  },
});
