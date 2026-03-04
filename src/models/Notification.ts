// Notification Data Models for DukandaR
import { Timestamp } from 'firebase/firestore';

/**
 * Types of notifications in the app
 */
export type NotificationType =
  | 'new_deal' // Favourite shop has a new deal
  | 'shop_opened' // Favourite shop just opened
  | 'demand_alert' // Owner: people searching for a product
  | 'stock_request' // Owner: confirm stock availability
  | 'new_shop_nearby' // New shop opened near customer
  | 'system'; // App updates/announcements

/**
 * App notification model
 */
export interface AppNotification {
  /** Unique notification ID */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Notification title */
  title: string;
  /** Notification body text */
  body: string;
  /** Related shop ID if applicable */
  shopId: string | null;
  /** Related product name if applicable */
  productName: string | null;
  /** Whether notification has been read */
  read: boolean;
  /** Deep link URL for navigation */
  actionUrl: string | null;
  /** Notification creation timestamp */
  createdAt: Timestamp;
}
