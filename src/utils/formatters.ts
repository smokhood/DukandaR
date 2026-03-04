// Formatting Utility Functions for DukandaR
import { ShopHours } from '@models/Shop';
import { Timestamp } from 'firebase/firestore';

/**
 * Format distance in kilometers to readable string
 * @param km Distance in kilometers
 * @returns Formatted string like "150 m" or "1.2 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format price with Pakistani Rupee format
 * @param amount Amount in PKR
 * @returns Formatted string like "Rs. 1,500"
 */
export function formatPrice(amount: number): string {
  const formatted = amount.toLocaleString('en-PK', {
    maximumFractionDigits: 0,
  });
  return `Rs. ${formatted}`;
}

/**
 * Format phone number to E.164 format
 * @param phone Phone number (can be "03XX" or "+923XX")
 * @returns E.164 format "+923XXXXXXXXX"
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If starts with 92, add +
  if (digits.startsWith('92')) {
    return `+${digits}`;
  }

  // If starts with 03, replace with +923
  if (digits.startsWith('03')) {
    return `+92${digits.substring(1)}`;
  }

  // If starts with 3, add +92
  if (digits.startsWith('3')) {
    return `+92${digits}`;
  }

  // Default: assume Pakistani number
  return `+92${digits}`;
}

/**
 * Format phone number for display
 * @param phone Phone number
 * @returns Display format "0300-1234567"
 */
export function formatPhoneDisplay(phone: string): string {
  const e164 = formatPhone(phone);
  // Remove +92 and add 0
  const withoutCountry = e164.replace('+92', '0');
  // Add hyphen after 4th digit
  return `${withoutCountry.substring(0, 4)}-${withoutCountry.substring(4)}`;
}

/**
 * Format time from 24-hour to 12-hour format
 * @param time Time string in "HH:MM" format
 * @returns Formatted string like "9:00 AM"
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format timestamp to relative time
 * @param date Date or Timestamp object
 * @returns Relative time string like "2 min ago"
 */
export function formatTimeAgo(date: Date | Timestamp): string {
  const timestamp = date instanceof Timestamp ? date.toDate() : date;
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
  
  return formatDate(timestamp);
}

/**
 * Format date to readable string
 * @param date Date or Timestamp object
 * @returns Formatted date like "March 4, 2026"
 */
export function formatDate(date: Date | Timestamp): string {
  const timestamp = date instanceof Timestamp ? date.toDate() : date;
  return timestamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format savings amount and percentage
 * @param original Original price
 * @param deal Deal price
 * @returns Formatted string like "Save Rs. 200 (15% off)"
 */
export function formatSavings(original: number, deal: number): string {
  const savings = original - deal;
  const percent = Math.round((savings / original) * 100);
  return `Save ${formatPrice(savings)} (${percent}% off)`;
}

/**
 * Check if shop is currently open
 * @param hours Shop operating hours
 * @param isOpen Manual toggle state
 * @returns True if shop is currently open
 */
export function isShopOpen(hours: ShopHours, isOpen: boolean): boolean {
  // If manually closed, return false
  if (!isOpen) return false;

  // If 24 hours, return true
  if (hours.isOpen24Hours) return true;

  // Check current time against hours
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  // Simple string comparison works for 24-hour format
  return currentTime >= hours.openTime && currentTime <= hours.closeTime;
}

/**
 * Truncate text to maximum length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
