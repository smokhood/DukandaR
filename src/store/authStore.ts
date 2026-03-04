/**
 * Auth Store - Global authentication state management
 * Uses Zustand with SecureStore persistence for security
 */
import type { User } from '@models/User';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: () => void;
  clearUser: () => void;
}

type AuthStore = AuthState & AuthActions;

// SecureStore adapter for Zustand persist
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoading: false,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          hasCompletedOnboarding: user?.isOnboarded ?? false,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setOnboarded: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isOnboarded: true } : null,
          hasCompletedOnboarding: true,
        })),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          isLoading: false,
        }),
    }),
    {
      name: 'dukandar-auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
