/**
 * useFavouritesViewModel
 * Business logic for managing favorite shops
 * Handles: Fetching saved shops, toggling favorites, tracking local state
 */

import type { Shop } from '@models/Shop';
import { db } from '@services/firebase';
import { getShopById } from '@services/shopService';
import { useAuthStore } from '@store/authStore';
import { useLocationStore } from '@store/locationStore';
import { useQuery } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

interface FavouritesState {
  shops: (Shop & { distance: number })[];
  isLoading: boolean;
  isEmpty: boolean;
}

export function useFavouritesViewModel() {
  const { user } = useAuthStore();
  const { location } = useLocationStore();
  const [localFavourites, setLocalFavourites] = useState<string[]>(
    user?.savedShops || []
  );

  // Fetch details for each favorited shop
  const favoritesQuery = useQuery({
    queryKey: ['favourites', user?.id, user?.savedShops],
    queryFn: async () => {
      if (!user?.savedShops.length) return [];
      if (!location?.lat || !location?.lng) return [];

      const shopsPromises = user.savedShops.map((shopId) =>
        getShopById(shopId)
      );

      const shops = await Promise.all(shopsPromises);

      // Calculate distance for each shop
      const shopsWithDistance = shops
        .filter((shop) => shop !== null)
        .map((shop) => ({
          ...shop,
          distance: calculateDistance(location.lat, location.lng, shop.location.latitude, shop.location.longitude),
        }));

      return shopsWithDistance.sort((a, b) => a.distance - b.distance);
    },
    enabled: !!user && (user.savedShops?.length || 0) > 0 && !!location?.lat && !!location?.lng,
  });

  // Sync local state with Firestore
  useEffect(() => {
    if (user?.savedShops) {
      setLocalFavourites(user.savedShops);
    }
  }, [user?.savedShops]);

  // Toggle favorite status with optimistic update
  const toggleFavourite = useCallback(
    async (shopId: string) => {
      if (!user?.id) throw new Error('User not found');

      const isFav = localFavourites.includes(shopId);
      const updatedList = isFav
        ? localFavourites.filter((id) => id !== shopId)
        : [...localFavourites, shopId];

      // Optimistic update
      setLocalFavourites(updatedList);

      try {
        // Update Firestore
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          savedShops: updatedList,
          updatedAt: new Date(),
        });
      } catch (error) {
        // Rollback on error
        setLocalFavourites(localFavourites);
        throw error;
      }
    },
    [user?.id, localFavourites]
  );

  // Check if shop is in favorites
  const isFavourite = useCallback(
    (shopId: string): boolean => {
      return localFavourites.includes(shopId);
    },
    [localFavourites]
  );

  // Remove from favorites
  const removeFavourite = useCallback(
    async (shopId: string) => {
      return toggleFavourite(shopId);
    },
    [toggleFavourite]
  );

  return {
    favouriteShops: (favoritesQuery.data || []) as (Shop & { distance: number })[],
    isLoading: favoritesQuery.isLoading,
    isEmpty: (favoritesQuery.data?.length || 0) === 0,
    toggleFavourite,
    isFavourite,
    removeFavourite,
    refetch: favoritesQuery.refetch,
  };
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
