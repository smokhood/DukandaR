// Product Data Models for DukandaR
import { Timestamp } from 'firebase/firestore';
import { ShopWithDistance } from './Shop';

/**
 * Product stock status
 */
export type StockStatus = 'in_stock' | 'out_of_stock' | 'unverified';

/**
 * Product categories
 */
export type ProductCategory =
  | 'atta_rice'
  | 'oil_ghee'
  | 'dairy'
  | 'sugar_salt'
  | 'tea_drinks'
  | 'soap_hygiene'
  | 'pulses'
  | 'spices'
  | 'snacks'
  | 'cleaning'
  | 'medicines'
  | 'vitamins'
  | 'vegetables'
  | 'fruits'
  | 'bread_baked'
  | 'electronics'
  | 'other';

/**
 * Main product model
 */
export interface Product {
  /** Unique product ID */
  id: string;
  /** Shop ID where product is sold */
  shopId: string;
  /** Product name in English, e.g., "Lux Soap 135g" */
  name: string;
  /** Product name in Urdu, e.g., "لکس صابن" */
  nameUrdu: string | null;
  /** Product category */
  category: ProductCategory;
  /** Price in PKR */
  price: number;
  /** Unit of measurement, e.g., "piece", "kg", "litre" */
  unit: string;
  /** Whether product is in stock */
  inStock: boolean;
  /** Stock verification status */
  stockStatus: StockStatus;
  /** Last stock verification timestamp */
  stockVerifiedAt: Timestamp | null;
  /** Number of community out-of-stock flags */
  flagCount: number;
  /** Number of times searched near this shop */
  searchCount: number;
  /** Whether product is active (not deleted) */
  isActive: boolean;
  /** Product creation timestamp */
  createdAt: Timestamp;
  /** Last update timestamp */
  updatedAt: Timestamp;
}

/**
 * Product with associated shop details
 */
export interface ProductWithShop extends Product {
  /** Shop details with distance */
  shop: ShopWithDistance;
  /** Whether this is the cheapest option nearby */
  isCheapestNearby: boolean;
  /** Whether this is the nearest shop with stock */
  isNearestWithStock: boolean;
}

/**
 * Search result for products
 */
export interface SearchResult {
  /** Search query string */
  query: string;
  /** Matching products with shop details */
  products: ProductWithShop[];
  /** Total number of shops found */
  totalShops: number;
  /** Search radius in kilometers */
  radiusKm: number;
  /** Timestamp when search was performed */
  searchedAt: Date;
}

/**
 * Shop with matched products
 */
export interface ShopWithProducts {
  /** Shop details with distance */
  shop: ShopWithDistance;
  /** Products that match search criteria */
  matchedProducts: Product[];
  /** Total number of matched products */
  totalMatchCount: number;
  /** Whether shop has all items in multi-item search */
  hasAllItems: boolean;
  /** Items missing from multi-item search */
  missingItems: string[];
  /** Estimated total price for all items */
  estimatedTotal: number;
}

/**
 * Template item for catalog builder
 */
export interface TemplateItem {
  /** Unique template item ID */
  id: string;
  /** Product name in English */
  name: string;
  /** Product name in Urdu */
  nameUrdu: string;
  /** Product category */
  category: ProductCategory;
  /** Unit of measurement */
  unit: string;
  /** Suggested price in PKR */
  suggestedPrice: number;
}
