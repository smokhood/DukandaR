// Location Service for DukandaR using expo-location
import * as Location from 'expo-location';

/**
 * Request foreground location permission
 * @returns Permission status
 */
export async function requestLocationPermission(): Promise<
  'granted' | 'denied' | 'blocked'
> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    return 'blocked';
  } catch (error) {
    console.error('Location permission error:', error);
    return 'denied';
  }
}

/**
 * Get current GPS location
 * @returns Location coordinates or null if failed
 */
export async function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
} | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
    });

    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  } catch (error) {
    console.error('Get location error:', error);
    return null;
  }
}

/**
 * Watch for location updates
 * @param callback Function to call with location updates
 * @returns Location subscription object
 */
export async function watchLocation(
  callback: (loc: { lat: number; lng: number }) => void
): Promise<Location.LocationSubscription> {
  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 50,
    },
    (location) => {
      callback({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }
  );

  return subscription;
}

/**
 * Get area name from coordinates using reverse geocoding
 * @param lat Latitude
 * @param lng Longitude
 * @returns Formatted area string like "Gulberg, Lahore"
 */
export async function getAreaFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (results.length > 0) {
      const location = results[0];
      const parts: string[] = [];

      if (location.subregion) parts.push(location.subregion);
      if (location.city) parts.push(location.city);

      return parts.length > 0 ? parts.join(', ') : 'Your Location';
    }

    return 'Your Location';
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return 'Your Location';
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude 1
 * @param lng1 Longitude 1
 * @param lat2 Latitude 2
 * @param lng2 Longitude 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
