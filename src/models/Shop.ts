// Shop Data Models for DukandaR
import { Timestamp } from 'firebase/firestore';

/**
 * Shop category types
 */
export type ShopCategory =
  | 'kiryana'
  | 'pharmacy'
  | 'sabzi'
  | 'bakery'
  | 'mobile'
  | 'clothing'
  | 'hardware'
  | 'beauty'
  | 'restaurant'
  | 'other';

/**
 * Shop location with geospatial data
 */
export interface ShopLocation {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Geohash for efficient radius queries */
  geohash: string;
  /** Full address string */
  address: string;
  /** Neighbourhood/area name */
  area: string;
  /** City name */
  city: string;
}

/**
 * Shop operating hours
 */
export interface ShopHours {
  /** Opening time in 24-hour format, e.g., "09:00" */
  openTime: string;
  /** Closing time in 24-hour format, e.g., "23:00" */
  closeTime: string;
  /** Whether shop operates 24 hours */
  isOpen24Hours: boolean;
}

/**
 * Shop payment options
 */
export interface ShopPayment {
  /** JazzCash number if available */
  jazzCashNumber: string | null;
  /** EasyPaisa number if available */
  easyPaisaNumber: string | null;
  /** Bank account details if available */
  bankAccount: string | null;
}

/**
 * Main shop model
 */
export interface Shop {
  /** Unique shop ID */
  id: string;
  /** Shop name */
  name: string;
  /** Owner's name */
  ownerName: string;
  /** Owner's Firebase Auth UID */
  ownerId: string;
  /** Shop category */
  category: ShopCategory;
  /** WhatsApp number in +923XXXXXXXXX format */
  whatsapp: string;
  /** Alternative phone number */
  phone: string | null;
  /** Shop location details */
  location: ShopLocation;
  /** Shop photo URL from Firebase Storage */
  photoUrl: string | null;
  /** Whether shop is currently open (manual toggle) */
  isOpen: boolean;
  /** Shop operating hours */
  hours: ShopHours;
  /** Payment options */
  payment: ShopPayment;
  /** Average rating (0-5) */
  rating: number;
  /** Total number of ratings */
  ratingCount: number;
  /** Total views all time */
  totalViews: number;
  /** Views today */
  todayViews: number;
  /** Total WhatsApp clicks */
  whatsappClicks: number;
  /** Whether shop is verified by admin */
  isVerified: boolean;
  /** Whether shop is active (not deleted) */
  isActive: boolean;
  /** Shop creation timestamp */
  createdAt: Timestamp;
  /** Last update timestamp */
  updatedAt: Timestamp;
}

/**
 * Shop with calculated distance from user
 */
export interface ShopWithDistance extends Shop {
  /** Distance from user in kilometers */
  distanceKm: number;
  /** Formatted distance label, e.g., "150 m" or "1.2 km" */
  distanceLabel: string;
  /** Whether shop is currently open based on time and toggle */
  isCurrentlyOpen: boolean;
}

/**
 * Shop statistics
 */
export interface ShopStats {
  /** Shop ID */
  shopId: string;
  /** Views today */
  viewsToday: number;
  /** Views this week */
  viewsThisWeek: number;
  /** WhatsApp clicks today */
  whatsappClicksToday: number;
  /** Number of users who saved this shop */
  savedByCount: number;
  /** Top searched products near this shop */
  topSearchedProducts: string[];
}

/**
 * Demand alert for shop owners
 */
export interface DemandAlert {
  /** Product name being searched */
  productName: string;
  /** Number of times searched */
  searchCount: number;
  /** Formatted message, e.g., "18 log X dhundh rahe..." */
  message: string;
  /** Last search timestamp */
  lastSearchedAt: Timestamp;
}
