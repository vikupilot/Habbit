import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { TaskItem, FavoriteTasks } from '../modules/planner';
import { AddFavoriteModal } from '../modules/planner/components/AddFavoriteModal';
import { plannerStyles } from '../styles/plannerStyles';
import { Star } from 'lucide-react-native';
import { apiClient } from '../utils/api';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}

interface FavoriteTask {
  id: string;
  title: string;
}

interface PlannerScreenProps {
  onScrollChange?: (isScrollingUp: boolean) => void;
}

// Helper function to format date as YYYY-MM-DD
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get dates for current week (7 days)
const getWeekDates = (date: Date): Date[] => {
  const dates: Date[] = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = startOfWeek.getDate() - day; // Subtract days to get to Sunday
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    dates.push(currentDate);
  }

  return dates;
};

export default function PlannerScreen({ onScrollChange }: PlannerScreenProps) {
  // Favorite tasks - loaded from backend
  const [favoriteTasks, setFavoriteTasks] = useState<FavoriteTask[]>([]);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const start = new Date(today);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return start;
  });
  const weekDates = getWeekDates(currentWeekStart);
  
  // Store tasks by date key (YYYY-MM-DD)
  const [tasksByDate, setTasksByDate] = useState<{ [key: string]: Task[] }>({});
  const [loading, setLoading] = useState(true);

  // Get tasks for selected date
  const selectedDateKey = formatDateKey(selectedDate);
  const tasks = tasksByDate[selectedDateKey] || [];

  const [lastScrollY, setLastScrollY] = useState(0);
  const [newTaskAutoFocus, setNewTaskAutoFocus] = useState<string | null>(null);
  const [showAddFavoriteModal, setShowAddFavoriteModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const calendarScrollRef = useRef<ScrollView>(null);
  const taskInputRefs = useRef<{ [key: string]: TextInput | null }>({});

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Load tasks and favorites from backend
  useEffect(() => {
    loadTasks();
    loadFavorites();
  }, []);

  // Ensure at least one empty task input when tasks are empty
  useEffect(() => {
    if (!loading && tasks.length === 0) {
      // Add a temporary empty task
      const tempTask: Task = {
        id: `temp-${Date.now()}`,
        title: '',
        status: 'pending',
      };
      setTasksByDate(prev => ({
        ...prev,
        [selectedDateKey]: [tempTask],
      }));
      setNewTaskAutoFocus(tempTask.id);
    }
  }, [tasks.length, loading, selectedDateKey]);

  // Update week start when selected date changes to a different week
  useEffect(() => {
    const selectedWeekStart = new Date(selectedDate);
    const day = selectedWeekStart.getDay();
    selectedWeekStart.setDate(selectedWeekStart.getDate() - day);
    selectedWeekStart.setHours(0, 0, 0, 0);
    
    const currentWeekStartDate = new Date(currentWeekStart);
    currentWeekStartDate.setHours(0, 0, 0, 0);
    
    if (selectedWeekStart.getTime() !== currentWeekStartDate.getTime()) {
      setCurrentWeekStart(selectedWeekStart);
    }
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await apiClient.getTasks();
      setTasksByDate(allTasks || {});
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      // If error, set empty tasks object
      setTasksByDate({});
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await apiClient.getFavorites();
      setFavoriteTasks(favorites || []);
    } catch (error: any) {
      console.error('Error loading favorites:', error);
      setFavoriteTasks([]);
    }
  };

  useEffect(() => {
    // Auto-scroll when tasks reach 4-5 or when new task is added
    if (tasks.length >= 4) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [tasks.length]);

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus: 'pending' | 'completed' = task.status === 'pending' ? 'completed' : 'pending';
    
    try {
      if (!id.startsWith('temp-')) {
        await apiClient.updateTask(id, selectedDateKey, { status: newStatus });
      }
      setTasksByDate(prev => ({
        ...prev,
        [selectedDateKey]: (prev[selectedDateKey] || []).map(t =>
          t.id === id ? { ...t, status: newStatus } : t
        ),
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateTask = async (id: string, title: string) => {
    if (!title.trim()) {
      // If title is empty and it's not a temp task, delete it
      if (!id.startsWith('temp-')) {
        await handleDeleteTask(id);
      }
      return;
    }

    try {
      if (id.startsWith('temp-')) {
        // Create new task in backend
        const response = await apiClient.createTask(selectedDateKey, title.trim());
        // Replace temp task with real task
        setTasksByDate(prev => ({
          ...prev,
          [selectedDateKey]: (prev[selectedDateKey] || []).map(t =>
            t.id === id ? response.task : t
          ),
        }));
      } else {
        // Update existing task
        await apiClient.updateTask(id, selectedDateKey, { title: title.trim() });
        setTasksByDate(prev => ({
          ...prev,
          [selectedDateKey]: (prev[selectedDateKey] || []).map(t =>
            t.id === id ? { ...t, title: title.trim() } : t
          ),
        }));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id.startsWith('temp-')) {
        await apiClient.deleteTask(id, selectedDateKey);
      }
      const updatedTasks = (tasksByDate[selectedDateKey] || []).filter(t => t.id !== id);
      setTasksByDate(prev => ({
        ...prev,
        [selectedDateKey]: updatedTasks,
      }));
      setNewTaskAutoFocus(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddNewTask = async () => {
    const newTask: Task = {
      id: `temp-${Date.now()}`,
      title: '',
      status: 'pending',
    };
    
    // Optimistically update UI
    setTasksByDate(prev => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newTask],
    }));
    setNewTaskAutoFocus(newTask.id);
    
    // Scroll to bottom when adding new task
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSelectFavorite = async (favorite: FavoriteTask) => {
    try {
      const response = await apiClient.createTask(selectedDateKey, favorite.title);
      setTasksByDate(prev => ({
        ...prev,
        [selectedDateKey]: [...(prev[selectedDateKey] || []), response.task],
      }));
      
      // Scroll to bottom when adding favorite task
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Filter favorites to only show ones not already in tasks for selected date
  const availableFavorites = favoriteTasks.filter(fav => {
    const taskTitles = tasks.map(t => t.title.toLowerCase().trim());
    return !taskTitles.includes(fav.title.toLowerCase().trim());
  });

  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => {
    const isLast = index === tasks.length - 1;
    
    return (
      <TaskItem
        id={item.id}
        title={item.title}
        status={item.status}
        onToggle={handleToggleTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onAddNew={handleAddNewTask}
        inputRef={(ref) => {
          taskInputRefs.current[item.id] = ref;
        }}
        isLast={isLast || false}
        autoFocus={newTaskAutoFocus === item.id}
      />
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setNewTaskAutoFocus(null);
  };

  const handleAddFavorite = () => {
    setShowAddFavoriteModal(true);
  };

  const handleAddFavoriteTask = async (taskName: string) => {
    try {
      const response = await apiClient.createFavorite(taskName);
      if (response.success) {
        await loadFavorites();
      }
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      Alert.alert('Error', error.message || 'Failed to add favorite task');
    }
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 50;

    if (onScrollChange) {
      onScrollChange(scrollingDown);
    }

    setLastScrollY(currentScrollY);
  };

  const isToday = (date: Date): boolean => {
    return formatDateKey(date) === formatDateKey(today);
  };

  const isSelected = (date: Date): boolean => {
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    if (direction === 'prev') {
      newWeekStart.setDate(newWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(newWeekStart.getDate() + 7);
    }
    setCurrentWeekStart(newWeekStart);
    
    // Update selected date to first day of new week if current selection is out of range
    const newWeekDates = getWeekDates(newWeekStart);
    const isSelectedDateInWeek = newWeekDates.some(d => formatDateKey(d) === formatDateKey(selectedDate));
    if (!isSelectedDateInWeek) {
      setSelectedDate(newWeekDates[0]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={plannerStyles.container} edges={['top']}>
        <View style={plannerStyles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={plannerStyles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={plannerStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <StatusBar style="dark" />
        
        {/* Header - Fixed at top */}
        <View style={plannerStyles.headerContainer}>
          <Text style={plannerStyles.headerTitle}>Your Daily Planner</Text>
          <TouchableOpacity
            style={plannerStyles.headerIconButton}
            onPress={handleAddFavorite}
            activeOpacity={0.7}
          >
            <Star size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={plannerStyles.scrollView}
          contentContainerStyle={plannerStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Calendar Strip - Horizontal Scrollable (One Week) */}
          <View style={plannerStyles.calendarStrip}>
            {/* Week Navigation */}
            <View style={plannerStyles.weekHeader}>
              <TouchableOpacity onPress={() => handleWeekChange('prev')} style={plannerStyles.weekNavButton}>
                <Text style={plannerStyles.weekNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={plannerStyles.weekTitle}>
                {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => handleWeekChange('next')} style={plannerStyles.weekNavButton}>
                <Text style={plannerStyles.weekNavText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Week Days Header */}
            <View style={plannerStyles.calendarDays}>
              {weekDays.map((day, index) => (
                <View key={index} style={plannerStyles.calendarDay}>
                  <Text style={plannerStyles.calendarDayLabel}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Horizontal Scrollable Dates (One Week) */}
            <ScrollView
              ref={calendarScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={plannerStyles.calendarDatesScroll}
              style={plannerStyles.calendarScrollView}
            >
              {weekDates.map((date, index) => {
                const dateDay = date.getDate();
                const active = isSelected(date);
                const isTodayDate = isToday(date);
                const dayName = weekDays[date.getDay()];
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={plannerStyles.dateItemHorizontal}
                    onPress={() => handleDateSelect(date)}
                    activeOpacity={0.7}
                  >
                    {active ? (
                      <View style={plannerStyles.dateSelected}>
                        <Text style={plannerStyles.dateSelectedDayLabel}>{dayName}</Text>
                        <Text style={plannerStyles.dateSelectedText}>{dateDay}</Text>
                      </View>
                    ) : (
                      <View style={plannerStyles.dateContainer}>
                        <Text style={[
                          plannerStyles.dateDayLabel,
                          isTodayDate && plannerStyles.dateDayLabelToday
                        ]}>
                          {dayName}
                        </Text>
                        <Text style={[
                          plannerStyles.dateText,
                          isTodayDate && plannerStyles.dateTextToday
                        ]}>
                          {dateDay}
                        </Text>
                        {isTodayDate && (
                          <View style={plannerStyles.calendarDayDotActive} />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Today Section */}
          <View style={plannerStyles.todaySection}>
            <Text style={plannerStyles.todayTitle}>
              {isSelected(today) ? 'Today' : selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>

                {/* Favorite Tasks - Above task list */}
                <FavoriteTasks
                  favorites={availableFavorites}
                  onSelectFavorite={handleSelectFavorite}
                />

            {/* Task List */}
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={renderTaskItem}
              scrollEnabled={false}
              contentContainerStyle={plannerStyles.taskList}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add Favorite Modal */}
      <AddFavoriteModal
        visible={showAddFavoriteModal}
        onClose={() => setShowAddFavoriteModal(false)}
        onAdd={handleAddFavoriteTask}
      />
    </SafeAreaView>
  );
}
