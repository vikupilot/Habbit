import { apiClient } from './api';

const DEFAULT_MIN_TASKS_PER_DAY = 1;

export interface StreakSettings {
  minTasksPerDay: number; // N value (1-10)
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

/**
 * Get streak settings from backend
 */
export async function getStreakSettings(): Promise<StreakSettings> {
  try {
    const settings = await apiClient.getStreakSettings();
    return settings || { minTasksPerDay: DEFAULT_MIN_TASKS_PER_DAY };
  } catch (error) {
    console.error('Error loading streak settings:', error);
    return { minTasksPerDay: DEFAULT_MIN_TASKS_PER_DAY };
  }
}

/**
 * Save streak settings to backend
 */
export async function saveStreakSettings(settings: StreakSettings): Promise<void> {
  try {
    await apiClient.updateStreakSettings(settings.minTasksPerDay);
  } catch (error) {
    console.error('Error saving streak settings:', error);
    throw error;
  }
}

export type TimeFilterOption = 'day' | 'week' | 'month' | 'year';

/**
 * Get date range based on time filter
 */
export function getDateRange(filter: TimeFilterOption): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let start: Date;

  switch (filter) {
    case 'day':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      break;
    case 'week':
      // Start of week (Sunday)
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }

  return { start, end };
}

/**
 * Check if a date string (YYYY-MM-DD) is within the date range
 */
function isDateInRange(dateStr: string, start: Date, end: Date): boolean {
  const date = new Date(dateStr);
  date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  return date >= start && date <= end;
}

/**
 * Get all dates in a range (for streak calculation)
 */
function getAllDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Calculate streak based on tasks and settings
 * Streak is always calculated from today backwards (consecutive days),
 * regardless of the time filter. The filter only affects summary statistics.
 */
export async function calculateStreak(
  tasksByDate: Record<string, Task[]>
): Promise<number> {
  const settings = await getStreakSettings();
  
  // For streak calculation, we need to check consecutive days
  // Start from today and go backwards
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Go backwards day by day until we find a day that doesn't meet the requirement
  let currentDate = new Date(today);
  
  // Check up to 365 days back (reasonable limit)
  let daysChecked = 0;
  const maxDaysToCheck = 365;
  
  while (daysChecked < maxDaysToCheck) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTasks = tasksByDate[dateStr] || [];
    const completedTasks = dayTasks.filter(t => t.status === 'completed');
    
    // Check if this day meets the minimum requirement
    if (completedTasks.length >= settings.minTasksPerDay) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      daysChecked++;
    } else {
      // Streak broken
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate summary statistics for tasks
 */
export function calculateSummary(
  tasksByDate: Record<string, Task[]>,
  filter: TimeFilterOption
): {
  totalTasks: number;
  ongoingTasks: number;
  completedTasks: number;
} {
  const { start, end } = getDateRange(filter);
  
  let totalTasks = 0;
  let ongoingTasks = 0;
  let completedTasks = 0;
  
  // Iterate through all dates in the range
  Object.keys(tasksByDate).forEach((dateStr) => {
    if (isDateInRange(dateStr, start, end)) {
      const tasks = tasksByDate[dateStr];
      totalTasks += tasks.length;
      
      tasks.forEach((task) => {
        if (task.status === 'completed') {
          completedTasks++;
        } else {
          ongoingTasks++;
        }
      });
    }
  });
  
  return { totalTasks, ongoingTasks, completedTasks };
}

