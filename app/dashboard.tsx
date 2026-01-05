import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, User } from 'lucide-react-native';
import { dashboardStyles } from '../styles/dashboardStyles';
import { MotivationalQuote, TimeFilter, SummaryTiles, WeeklyChart } from '../modules/dashboard';
import type { TimeFilterOption } from '../modules/dashboard';
import { apiClient } from '../utils/api';
import { calculateSummary, calculateStreak } from '../utils/streakCalculator';

interface User {
  fullName: string;
  gender?: 'male' | 'female' | null;
}

const QUOTE_STORAGE_KEY = 'daily_motivational_quote';
const QUOTE_DATE_KEY = 'daily_motivational_quote_date';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>('day');
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalTasks: 0,
    ongoingTasks: 0,
    completedTasks: 0,
    streak: 0,
  });

  useEffect(() => {
    loadUser();
    loadSavedQuote();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      updateSummary();
    }
  }, [tasks, timeFilter]);

  const loadUser = async () => {
    try {
      // Try to load from API first to get latest data including gender
      try {
        const userData = await apiClient.getMe();
        const userWithGender: User = {
          fullName: userData.fullName,
          gender: (userData.gender === 'male' || userData.gender === 'female') ? userData.gender : null,
        };
        setUser(userWithGender);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } catch (apiError) {
        // Fallback to local storage if API fails
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser({
            fullName: parsed.fullName,
            gender: (parsed.gender === 'male' || parsed.gender === 'female') ? parsed.gender : null,
          });
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const getGenderIcon = () => {
    if (user?.gender === 'male') return '👨';
    if (user?.gender === 'female') return '👩';
    return '👤';
  };

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const loadSavedQuote = async () => {
    try {
      const savedQuote = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
      const savedDate = await AsyncStorage.getItem(QUOTE_DATE_KEY);
      const todayDate = getTodayDateString();

      // If we have today's quote saved, use it
      if (savedQuote && savedDate === todayDate) {
        setDailyQuote(savedQuote);
      }
    } catch (error) {
      console.error('Error loading saved quote:', error);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await apiClient.getTasks();
      setTasks(allTasks || {});
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSummary = async () => {
    try {
      const summaryData = calculateSummary(tasks, timeFilter);
      // Streak is always calculated from today backwards, regardless of filter
      const streak = await calculateStreak(tasks);
      setSummary({
        ...summaryData,
        streak,
      });
    } catch (error) {
      console.error('Error calculating summary:', error);
    }
  };


  return (
    <View style={dashboardStyles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={dashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={dashboardStyles.scrollView}
      >
        {/* Header */}
        <View style={dashboardStyles.header}>
          <View style={dashboardStyles.welcomeContainer}>
            <Text style={dashboardStyles.welcomeText}>Welcome</Text>
            <Text style={dashboardStyles.userNameText}>{user?.fullName || 'User'}</Text>
          </View>
          <View style={dashboardStyles.headerIcons}>
            <TouchableOpacity style={dashboardStyles.iconButton} activeOpacity={0.7}>
              <Bell size={22} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={dashboardStyles.iconButton}
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 22 }}>{getGenderIcon()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Quote */}
        <MotivationalQuote onQuoteLoaded={setDailyQuote} savedQuote={dailyQuote} />

        {/* Summary Section */}
        <View>
          <Text style={dashboardStyles.sectionTitle}>Summary</Text>
          <TimeFilter selected={timeFilter} onSelect={setTimeFilter} />
        </View>

        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : (
          <>
            <SummaryTiles
              totalTasks={summary.totalTasks}
              ongoingTasks={summary.ongoingTasks}
              completedTasks={summary.completedTasks}
              streak={summary.streak}
            />
            <WeeklyChart tasksByDate={tasks} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

