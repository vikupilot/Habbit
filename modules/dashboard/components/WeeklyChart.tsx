import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { dashboardStyles } from '../../../styles/dashboardStyles';
import { Task } from '../../../utils/streakCalculator';

interface WeeklyChartProps {
  tasksByDate: Record<string, Task[]>;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ tasksByDate }) => {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Initialize data for each day of the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map((day, index) => ({
      day,
      completed: 0,
      date: new Date(startOfWeek),
    }));
    
    // Set dates for each day
    data.forEach((item, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      item.date = date;
    });
    
    // Count completed tasks for each day
    Object.keys(tasksByDate).forEach((dateStr) => {
      const date = new Date(dateStr);
      date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      if (date >= startOfWeek && date <= endOfWeek) {
        const dayIndex = date.getDay();
        const tasks = tasksByDate[dateStr] || [];
        const completedCount = tasks.filter(t => t.status === 'completed').length;
        data[dayIndex].completed = completedCount;
      }
    });
    
    return data;
  }, [tasksByDate]);
  
  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1);
  const chartHeight = 100; // Height available for bars
  
  return (
    <View style={dashboardStyles.weeklyChartContainer}>
      <Text style={dashboardStyles.weeklyChartTitle}>Weekly Progress</Text>
      <View style={dashboardStyles.weeklyChartContent}>
        {weeklyData.map((item, index) => {
          const barHeight = maxCompleted > 0 
            ? (item.completed / maxCompleted) * chartHeight 
            : 0;
          
          return (
            <View key={index} style={dashboardStyles.weeklyChartDayContainer}>
              <View style={dashboardStyles.weeklyChartBarWrapper}>
                <Text style={dashboardStyles.weeklyChartValue}>{item.completed}</Text>
                <View
                  style={[
                    dashboardStyles.weeklyChartBar,
                    {
                      height: Math.max(barHeight, 8),
                      backgroundColor: item.completed > 0 ? '#5A8A6F' : '#E0E0E0',
                    },
                  ]}
                />
              </View>
              <Text style={dashboardStyles.weeklyChartDayLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

