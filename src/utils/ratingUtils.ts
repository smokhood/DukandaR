/**
 * Rating Utility Functions
 * Handles shop ratings and review submissions
 */

import SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const RATED_SHOPS_KEY = 'rated_shops';

interface RatingData {
  shopId: string;
  rating: number;
  note?: string;
  timestamp: number;
}

/**
 * Submit a shop rating
 */
export const submitShopRating = async (
  shopId: string,
  rating: number,
  note?: string
) => {
  try {
    // Store in secure storage to track rated shops
    const ratedShops = await getLocalRatedShops();
    
    // Check if already rated
    if (ratedShops.some((r) => r.shopId === shopId)) {
      Alert.alert('پہلے سے ریٹ کیا گیا', 'آپ اس دکان کو پہلے ریٹ کر چکے ہیں');
      return;
    }

    // Add new rating
    ratedShops.push({
      shopId,
      rating,
      note,
      timestamp: Date.now(),
    });

    // Save to secure storage
    await SecureStore.setItemAsync(
      RATED_SHOPS_KEY,
      JSON.stringify(ratedShops)
    );

    // TODO: Send rating to Firestore via service
    console.log('Rating submitted:', { shopId, rating, note });
    
    Alert.alert('شکریہ!', 'آپ کی ریٹنگ محفوظ کی گئی');
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

/**
 * Get local rated shops
 */
export const getLocalRatedShops = async (): Promise<RatingData[]> => {
  try {
    const data = await SecureStore.getItemAsync(RATED_SHOPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting rated shops:', error);
    return [];
  }
};

/**
 * Check if shop has been rated by user
 */
export const isShopRated = async (shopId: string): Promise<boolean> => {
  const ratedShops = await getLocalRatedShops();
  return ratedShops.some((r) => r.shopId === shopId);
};

/**
 * Get user's rating for a shop
 */
export const getShopRating = async (
  shopId: string
): Promise<RatingData | null> => {
  const ratedShops = await getLocalRatedShops();
  return ratedShops.find((r) => r.shopId === shopId) || null;
};

/**
 * Show rating prompt with delay (for use after order placement)
 */
export const showRatingPrompt = async (
  shopId: string,
  shopName: string,
  delayMs: number = 30000
): Promise<boolean> => {
  // Check if already rated
  if (await isShopRated(shopId)) {
    return false;
  }

  // Wait before showing prompt
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return true;
};
