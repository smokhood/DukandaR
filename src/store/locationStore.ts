/**
 * Location Store - Global location state management
 * Persists radius preference to AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PermissionStatus = 'unknown' | 'granted' | 'denied' | 'blocked';

interface LocationState {
  location: { lat: number; lng: number } | null;
  area: string;
  city: string;
  radius: number;
  permissionStatus: PermissionStatus;
  isLocating: boolean;
}

interface LocationActions {
  setLocation: (lat: number, lng: number) => void;
  setArea: (area: string, city: string) => void;
  setRadius: (km: number) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  setLocating: (loading: boolean) => void;
}

type LocationStore = LocationState & LocationActions;

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      // Initial state
      location: null,
      area: '',
      city: '',
      radius: 2, // default 2 km
      permissionStatus: 'unknown',
      isLocating: false,

      // Actions
      setLocation: (lat, lng) =>
        set({
          location: { lat, lng },
          isLocating: false,
        }),

      setArea: (area, city) =>
        set({
          area,
          city,
        }),

      setRadius: (km) =>
        set({
          radius: km,
        }),

      setPermissionStatus: (status) =>
        set({
          permissionStatus: status,
        }),

      setLocating: (loading) =>
        set({
          isLocating: loading,
        }),
    }),
    {
      name: 'dukandar-location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist radius preference
      partialize: (state) => ({ radius: state.radius }),
    }
  )
);
