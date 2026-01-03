// Storage utilities using MMKV (fast) and AsyncStorage (simple)

// MMKV - Fast key-value storage
// @ts-ignore - MMKV constructor type issue
import { MMKV } from 'react-native-mmkv';

// @ts-ignore
export const mmkvStorage = new MMKV({
  id: 'habbit-storage',
});

// MMKV helper functions
export const mmkv = {
  set: (key: string, value: string | number | boolean) => {
    mmkvStorage.set(key, value);
  },
  getString: (key: string): string | undefined => {
    return mmkvStorage.getString(key);
  },
  getNumber: (key: string): number | undefined => {
    return mmkvStorage.getNumber(key);
  },
  getBoolean: (key: string): boolean | undefined => {
    return mmkvStorage.getBoolean(key);
  },
  delete: (key: string) => {
    mmkvStorage.delete(key);
  },
  clearAll: () => {
    mmkvStorage.clearAll();
  },
  getAllKeys: () => {
    return Array.from(mmkvStorage.getAllKeys());
  },
};

// AsyncStorage - Simple key-value storage (for compatibility)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
  getAllKeys: async (): Promise<readonly string[]> => {
    return await AsyncStorage.getAllKeys();
  },
};

// Example usage:
// MMKV (faster, synchronous):
// mmkv.set('userName', 'John');
// const userName = mmkv.getString('userName');

// AsyncStorage (simpler, asynchronous):
// await asyncStorage.setItem('userName', 'John');
// const userName = await asyncStorage.getItem('userName');

