import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Platform-specific API base URL
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // For Expo Go on physical Android device, use your computer's IP address
      // For Android emulator (Android Studio), use 10.0.2.2 instead
      return 'http://192.168.0.108:3000'; // Expo Go on physical Android device
      // return 'http://10.0.2.2:3000'; // Uncomment this if using Android Studio emulator
    } else if (Platform.OS === 'ios') {
      // For iOS simulator, use localhost
      // For physical device, use your computer's IP address
      return 'http://192.168.0.108:3000'; // Change this to your IP address
    }
  }
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = await this.getHeaders();
      const url = `${API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API request error:', error);
      console.error('Request URL:', `${API_BASE_URL}${endpoint}`);
      console.error('Platform:', Platform.OS);
      throw error;
    }
  }

  // Auth methods
  async signup(fullName: string, email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      token: string;
      user: { id: string; fullName: string; email: string };
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });

    if (response.success) {
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      token: string;
      user: { id: string; fullName: string; email: string };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async getMe() {
    const response = await this.request<{ success: boolean; user: { id: string; fullName: string; email: string; gender: string | null } }>('/api/auth/me');
    return response.user;
  }

  async updateProfile(fullName?: string, gender?: 'male' | 'female' | null) {
    const response = await this.request<{ success: boolean; user: { id: string; fullName: string; email: string; gender: string | null } }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, gender }),
    });
    // Update local storage
    if (response.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  // Task methods
  async getTasks(date?: string) {
    const endpoint = date ? `/api/tasks?date=${date}` : '/api/tasks';
    const response = await this.request<{ tasks: any }>(endpoint);
    return response.tasks;
  }

  async createTask(date: string, title: string) {
    return this.request<{ success: boolean; task: any }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ date, title }),
    });
  }

  async updateTask(taskId: string, date: string, updates: { title?: string; status?: 'pending' | 'completed' }) {
    return this.request<{ success: boolean; task: any }>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ date, ...updates }),
    });
  }

  async deleteTask(taskId: string, date: string) {
    return this.request<{ success: boolean }>(`/api/tasks/${taskId}?date=${date}`, {
      method: 'DELETE',
    });
  }

  // Drag-and-drop reorder functionality removed
  // async reorderTasks(date: string, taskIds: string[]) {
  //   return this.request<{ success: boolean; tasks: any[] }>('/api/tasks/reorder', {
  //     method: 'PUT',
  //     body: JSON.stringify({ date, taskIds }),
  //   });
  // }

  // Password reset methods
  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Favorite methods
  async getFavorites() {
    const response = await this.request<{ favorites: any[] }>('/api/favorites');
    return response.favorites;
  }

  async createFavorite(title: string) {
    return this.request<{ success: boolean; favorite: any }>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteFavorite(favoriteId: string) {
    return this.request<{ success: boolean }>(`/api/favorites/${favoriteId}`, {
      method: 'DELETE',
    });
  }

  async reorderFavorites(favoriteIds: string[]) {
    return this.request<{ success: boolean; favorites: any[] }>('/api/favorites/reorder', {
      method: 'PUT',
      body: JSON.stringify({ favoriteIds }),
    });
  }

  // Motivation methods
  async getDailyQuote() {
    return this.request<{ success: boolean; quote: string; date: string }>('/api/motivation/daily');
  }

  // Streak settings methods
  async getStreakSettings() {
    const response = await this.request<{ success: boolean; settings: { minTasksPerDay: number } }>('/api/favorites/streak-settings');
    return response.settings;
  }

  async updateStreakSettings(minTasksPerDay: number) {
    return this.request<{ success: boolean; settings: { minTasksPerDay: number } }>('/api/favorites/streak-settings', {
      method: 'PUT',
      body: JSON.stringify({ minTasksPerDay }),
    });
  }

  // Notification settings methods
  async getNotificationSettings() {
    const response = await this.request<{ success: boolean; settings: { enabled: boolean; hour: number; minute: number } }>('/api/favorites/notification-settings');
    return response.settings;
  }

  async updateNotificationSettings(enabled: boolean, hour?: number, minute?: number) {
    return this.request<{ success: boolean; settings: { enabled: boolean; hour: number; minute: number } }>('/api/favorites/notification-settings', {
      method: 'PUT',
      body: JSON.stringify({ enabled, hour, minute }),
    });
  }
}

export const apiClient = new ApiClient();
