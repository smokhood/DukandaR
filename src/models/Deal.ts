// Deal Data Models for DukandaR
import { Timestamp } from 'firebase/firestore';

/**
 * Special deal/offer from a shop
 */
export interface Deal {
  /** Unique deal ID */
  id: string;
  /** Shop ID offering the deal */
  shopId: string;
  /** Shop name */
  shopName: string;
  /** Product ID (null if custom deal not linked to product) */
  productId: string | null;
  /** Product name */
  productName: string;
  /** Original price in PKR */
  originalPrice: number;
  /** Deal price in PKR */
  dealPrice: number;
  /** Savings amount (calculated: originalPrice - dealPrice) */
  savingsAmount: number;
  /** Savings percentage (calculated) */
  savingsPercent: number;
  /** Optional note about the deal, e.g., "Fresh stock!" */
  note: string | null;
  /** Deal expiration timestamp */
  expiresAt: Timestamp;
  /** Whether deal is currently active */
  isActive: boolean;
  /** Deal creation timestamp */
  createdAt: Timestamp;
}
