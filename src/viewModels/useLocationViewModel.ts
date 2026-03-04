/**
 * Location ViewModel - Business logic for location management
 */
import {
    getAreaFromCoords,
    getCurrentLocation,
    requestLocationPermission,
} from '@services/locationService';
import { useEffect } from 'react';
import { useLocationStore } from '../store/locationStore';

export function useLocationViewModel() {
  const {
    location,
    area,
    city,
    radius,
    permissionStatus,
    isLocating,
    setLocation,
    setArea,
    setRadius,
    setPermissionStatus,
    setLocating,
  } = useLocationStore();

  // Initialize location on mount
  useEffect(() => {
    initializeLocation();
  }, []);

  /**
   * Initialize location - check permission and get location if granted
   */
  const initializeLocation = async () => {
    try {
      const status = await requestLocationPermission();
      setPermissionStatus(status);

      if (status === 'granted') {
        await refreshLocation();
      }
    } catch (error) {
      console.error('Initialize location error:', error);
    }
  };

  /**
   * Request location permission
   */
  const requestPermission = async (): Promise<void> => {
    try {
      const status = await requestLocationPermission();
      setPermissionStatus(status);

      if (status === 'granted') {
        await refreshLocation();
      }
    } catch (error) {
      console.error('Request permission error:', error);
      throw error;
    }
  };

  /**
   * Refresh location - get fresh GPS coordinates and reverse geocode
   */
  const refreshLocation = async (): Promise<void> => {
    try {
      setLocating(true);

      const coords = await getCurrentLocation();
      if (!coords) {
        throw new Error('Could not get location');
      }

      setLocation(coords.lat, coords.lng);

      // Reverse geocode to get area name
      const areaName = await getAreaFromCoords(coords.lat, coords.lng);
      
      // Parse area name (format: "Area, City")
      const parts = areaName.split(',').map((s) => s.trim());
      if (parts.length >= 2) {
        setArea(parts[0], parts[1]);
      } else {
        setArea(areaName, '');
      }
    } catch (error) {
      console.error('Refresh location error:', error);
      throw error;
    } finally {
      setLocating(false);
    }
  };

  /**
   * Set manual area (when user types instead of GPS)
   */
  const setManualArea = (areaName: string): void => {
    setArea(areaName, '');
  };

  /**
   * Update radius preference
   */
  const updateRadius = (km: number): void => {
    setRadius(km);
  };

  return {
    // State
    location,
    area,
    city,
    radius,
    permissionStatus,
    isLocating,
    hasLocation: location !== null,

    // Functions
    requestPermission,
    refreshLocation,
    setManualArea,
    updateRadius,
  };
}
