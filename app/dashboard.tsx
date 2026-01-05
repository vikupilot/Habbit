import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Grid, Plus, ChevronRight, User } from 'lucide-react-native';
import { dashboardStyles } from '../styles/dashboardStyles';

interface User {
  fullName: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    loadUser();
    const hour = new Date().getHours();
    setCurrentHour(hour);
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Mock data for summary cards
  const summaryData = [
    { label: 'Project', value: '150', color: '#000000' },
    { label: 'Client', value: '75', color: '#666666' },
    { label: 'Ongoing', value: '50', color: '#333333' },
    { label: 'Done', value: '100', color: '#999999' },
  ];

  // Mock data for activity chart (7 days)
  const activityData = [
    { day: 'Sun', hours: 8 },
    { day: 'Mon', hours: 6 },
    { day: 'Tue', hours: 7 },
    { day: 'Wed', hours: 12 },
    { day: 'Thu', hours: 10 },
    { day: 'Fri', hours: 9 },
    { day: 'Sat', hours: 11 },
  ];

  const maxHours = Math.max(...activityData.map(d => d.hours));

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
          <View style={dashboardStyles.greetingContainer}>
            <Text style={dashboardStyles.greeting}>{getGreeting()}</Text>
            <Text style={dashboardStyles.userName}>
              {user?.fullName || 'User'}
            </Text>
          </View>
          <View style={dashboardStyles.headerIcons}>
            <TouchableOpacity style={dashboardStyles.iconButton}>
              <Bell size={18} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={dashboardStyles.iconButton}>
              <Grid size={18} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={dashboardStyles.iconButton}
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <User size={18} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Create New Task Button */}
        <TouchableOpacity style={dashboardStyles.createTaskButton} activeOpacity={0.8}>
          <View style={dashboardStyles.createTaskIcon}>
            <Plus size={24} color="#FFFFFF" />
          </View>
          <View style={dashboardStyles.createTaskContent}>
            <Text style={dashboardStyles.createTaskTitle}>Create New Task</Text>
            <Text style={dashboardStyles.createTaskSubtitle}>
              You can create new task here
            </Text>
          </View>
          <ChevronRight size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Summary Section */}
        <Text style={dashboardStyles.sectionTitle}>Summary</Text>
        <View style={dashboardStyles.summaryGrid}>
          {summaryData.map((item, index) => (
            <View key={index} style={dashboardStyles.summaryCard}>
              <View style={dashboardStyles.summaryCardHeader}>
                <View
                  style={[
                    dashboardStyles.summaryCardDot,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={dashboardStyles.summaryCardLabel}>{item.label}</Text>
              </View>
              <Text style={dashboardStyles.summaryCardValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Activity Section */}
        <View style={dashboardStyles.activitySection}>
          <View style={dashboardStyles.activityHeader}>
            <View>
              <Text style={dashboardStyles.sectionTitle}>Activity</Text>
              <Text style={dashboardStyles.activitySubtitle}>90h 50m on this week</Text>
            </View>
            <ChevronRight size={20} color="#000000" />
          </View>

          <View style={dashboardStyles.chartContainer}>
            {activityData.map((item, index) => {
              const height = (item.hours / maxHours) * 150;
              return (
                <View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <View
                    style={[
                      dashboardStyles.chartBar,
                      {
                        height: height,
                        backgroundColor: index >= 3 ? '#000000' : '#E0E0E0',
                      },
                    ]}
                  />
                  <Text style={[dashboardStyles.chartLabel, { marginTop: 4, fontSize: 10 }]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

