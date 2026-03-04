// Shop Service for DukandaR
import { Shop } from '@models/Shop';
import { encodeGeohash, getGeohashesForRadius } from '@utils/geohash';
import * as ImageManipulator from 'expo-image-manipulator';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    runTransaction,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import { calculateDistance } from './locationService';

const SHOPS_COLLECTION = 'shops';

/**
 * Get shops nearby based on location and radius
 * @param lat User latitude
 * @param lng User longitude
 * @param radiusKm Search radius in kilometers
 * @returns Array of shops sorted by distance
 */
export async function getShopsNearby(
  lat: number,
  lng: number,
  radiusKm: number = 2
): Promise<Shop[]> {
  try {
    const geohashes = getGeohashesForRadius(lat, lng, radiusKm);
    const shopsMap = new Map<string, Shop>();

    // Query shops for each geohash
    for (const geohash of geohashes) {
      const q = query(
        collection(db, SHOPS_COLLECTION),
        where('location.geohash', '>=', geohash),
        where('location.geohash', '<', geohash + '~'),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        if (!shopsMap.has(doc.id)) {
          shopsMap.set(doc.id, { id: doc.id, ...doc.data() } as Shop);
        }
      });
    }

    // Filter by actual distance and sort
    const shops = Array.from(shopsMap.values())
      .map((shop) => ({
        ...shop,
        distance: calculateDistance(
          lat,
          lng,
          shop.location.latitude,
          shop.location.longitude
        ),
      }))
      .filter((shop) => shop.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50); // Limit to 50 results

    return shops;
  } catch (error) {
    console.error('Get shops nearby error:', error);
    throw error;
  }
}

/**
 * Get shop by ID
 * @param shopId Shop ID
 * @returns Shop data or null
 */
export async function getShopById(shopId: string): Promise<Shop | null> {
  try {
    const shopDoc = await getDoc(doc(db, SHOPS_COLLECTION, shopId));

    if (!shopDoc.exists()) {
      return null;
    }

    return { id: shopDoc.id, ...shopDoc.data() } as Shop;
  } catch (error) {
    console.error('Get shop by ID error:', error);
    throw error;
  }
}

/**
 * Create a new shop
 * @param shopData Shop data (without auto-generated fields)
 * @returns New shop ID
 */
export async function createShop(
  shopData: Omit<
    Shop,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'rating'
    | 'ratingCount'
    | 'totalViews'
    | 'todayViews'
    | 'whatsappClicks'
  >
): Promise<string> {
  try {
    // Generate geohash for the location
    const geohash = encodeGeohash(
      shopData.location.latitude,
      shopData.location.longitude,
      6
    );

    const newShop = {
      ...shopData,
      location: {
        ...shopData.location,
        geohash,
      },
      rating: 0,
      ratingCount: 0,
      totalViews: 0,
      todayViews: 0,
      whatsappClicks: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, SHOPS_COLLECTION), newShop);
    return docRef.id;
  } catch (error) {
    console.error('Create shop error:', error);
    throw error;
  }
}

/**
 * Update shop data
 * @param shopId Shop ID
 * @param updates Partial shop data to update
 */
export async function updateShop(
  shopId: string,
  updates: Partial<Shop>
): Promise<void> {
  try {
    const shopRef = doc(db, SHOPS_COLLECTION, shopId);

    // If location is being updated, regenerate geohash
    if (updates.location) {
      const geohash = encodeGeohash(
        updates.location.latitude,
        updates.location.longitude,
        6
      );
      updates.location = {
        ...updates.location,
        geohash,
      };
    }

    await updateDoc(shopRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Update shop error:', error);
    throw error;
  }
}

/**
 * Toggle shop open/closed status
 * @param shopId Shop ID
 * @param isOpen New open status
 */
export async function toggleShopOpen(
  shopId: string,
  isOpen: boolean
): Promise<void> {
  try {
    const shopRef = doc(db, SHOPS_COLLECTION, shopId);
    await updateDoc(shopRef, {
      isOpen,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Toggle shop open error:', error);
    throw error;
  }
}

/**
 * Increment shop statistics
 * @param shopId Shop ID
 * @param stat Stat to increment
 */
export async function incrementShopStat(
  shopId: string,
  stat: 'totalViews' | 'todayViews' | 'whatsappClicks'
): Promise<void> {
  try {
    const shopRef = doc(db, SHOPS_COLLECTION, shopId);
    await updateDoc(shopRef, {
      [stat]: increment(1),
    });
  } catch (error) {
    console.error('Increment shop stat error:', error);
    throw error;
  }
}

/**
 * Upload shop photo to Firebase Storage
 * @param shopId Shop ID
 * @param imageUri Local image URI
 * @returns Download URL
 */
export async function uploadShopPhoto(
  shopId: string,
  imageUri: string
): Promise<string> {
  try {
    // Compress image
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Convert to blob
    const response = await fetch(manipResult.uri);
    const blob = await response.blob();

    // Upload to Storage
    const photoRef = storageRef(storage, `shops/${shopId}/photo.jpg`);
    await uploadBytes(photoRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(photoRef);

    // Update shop document
    await updateShop(shopId, { photoUrl: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error('Upload shop photo error:', error);
    throw error;
  }
}

/**
 * Rate a shop
 * @param shopId Shop ID
 * @param rating Rating value (1-5)
 */
export async function rateShop(shopId: string, rating: number): Promise<void> {
  try {
    const shopRef = doc(db, SHOPS_COLLECTION, shopId);

    await runTransaction(db, async (transaction) => {
      const shopDoc = await transaction.get(shopRef);

      if (!shopDoc.exists()) {
        throw new Error('Shop not found');
      }

      const currentRating = shopDoc.data().rating || 0;
      const currentCount = shopDoc.data().ratingCount || 0;

      // Calculate new weighted average
      const newCount = currentCount + 1;
      const newRating = (currentRating * currentCount + rating) / newCount;

      transaction.update(shopRef, {
        rating: Math.round(newRating * 10) / 10, // Round to 1 decimal
        ratingCount: newCount,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    console.error('Rate shop error:', error);
    throw error;
  }
}

/**
 * Get shop by owner ID
 * @param ownerId Owner's user ID
 * @returns Shop data or null
 */
export async function getShopByOwnerId(ownerId: string): Promise<Shop | null> {
  try {
    const q = query(
      collection(db, SHOPS_COLLECTION),
      where('ownerId', '==', ownerId),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const shopDoc = snapshot.docs[0];
    return { id: shopDoc.id, ...shopDoc.data() } as Shop;
  } catch (error) {
    console.error('Get shop by owner ID error:', error);
    throw error;
  }
}
