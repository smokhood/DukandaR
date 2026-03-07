// User Data Models for DukandaR
import { Timestamp } from 'firebase/firestore';

/**
 * User role in the application
 */
export type UserRole = 'customer' | 'owner';

/**
 * Main user model
 */
export interface User {
  /** Firebase Auth UID */
  id: string;
  /** Phone number in +923XXXXXXXXX format */
  phone: string;
  /** Display name */
  name: string;
  /** User role (customer or shop owner) */
  role: UserRole;
  /** Shop ID if user is an owner, null otherwise */
  shopId: string | null;
  /** Array of saved shop IDs (for customers) */
  savedShops: string[];
  /** Whether user has completed onboarding */
  isOnboarded: boolean;
  /** User's preferred language */
  preferredLanguage: 'en' | 'ur';
  /** Most recent Expo push token for this user */
  expoPushToken?: string | null;
  /** All known Expo push tokens (multi-device support) */
  expoPushTokens?: string[];
  /** Whether user has enabled push notifications */
  pushEnabled?: boolean;
  /** Last push token refresh timestamp */
  pushTokenUpdatedAt?: Timestamp;
  /** Account creation timestamp */
  createdAt: Timestamp;
  /** Last update timestamp */
  updatedAt: Timestamp;
}

/**
 * Authentication state for the app
 */
export interface AuthState {
  /** Current authenticated user, null if not logged in */
  user: User | null;
  /** Whether authentication is being checked */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether user has completed onboarding */
  isOnboarded: boolean;
}

/**
 * OTP verification state
 */
export interface OTPState {
  /** Phone number where OTP was sent */
  phoneNumber: string;
  /** Firebase confirmation result object */
  confirmationResult: any;
  /** Whether OTP has been sent */
  otpSent: boolean;
  /** Whether OTP verification is in progress */
  isVerifying: boolean;
  /** Error message if any */
  error: string | null;
  /** Countdown timer for resend OTP (in seconds) */
  countdown: number;
}
