// Validation Schemas for DukandaR using Zod
import { z } from 'zod';

/**
 * Pakistani phone number validation
 * Accepts 10 digits starting with 3 (e.g., 3001234567)
 * The "+92" is added in the UI and formatPhone function
 */
export const pakistaniPhoneSchema = z
  .string()
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, '');
      // Must be 10 digits starting with 3
      return digits.length === 10 && digits.startsWith('3');
    },
    {
      message: 'Valid Pakistani number daalen (3XX-XXXXXXX)',
    }
  );

/**
 * OTP validation (6 digits)
 */
export const otpSchema = z
  .string()
  .length(6, '6 digit OTP daalen')
  .regex(/^\d{6}$/, '6 digit OTP daalen');

/**
 * Shop name validation
 */
export const shopNameSchema = z
  .string()
  .trim()
  .min(3, 'Shop name kam az kam 3 characters ka hona chahiye')
  .max(60, 'Shop name 60 characters se zyada nahi ho sakta');

/**
 * Owner name validation
 */
export const ownerNameSchema = z
  .string()
  .trim()
  .min(2, 'Name kam az kam 2 characters ka hona chahiye')
  .max(50, 'Name 50 characters se zyada nahi ho sakta');

/**
 * Price validation
 */
export const priceSchema = z
  .number()
  .positive('Price positive honi chahiye')
  .max(999999, 'Price 9,99,999 se zyada nahi ho sakti')
  .refine(
    (val) => {
      // Check if has max 2 decimal places
      return Number.isInteger(val * 100);
    },
    {
      message: 'Price mein sirf 2 decimal places ho sakte hain',
    }
  );

/**
 * Search query validation
 */
export const searchQuerySchema = z
  .string()
  .trim()
  .min(2, 'Kam az kam 2 characters daalen')
  .max(100, '100 characters se zyada nahi')
  .refine(
    (val) => {
      // Basic XSS prevention
      return !/<script|<iframe|javascript:/i.test(val);
    },
    {
      message: 'Invalid search query',
    }
  );

/**
 * Shop registration validation schema
 */
export const shopRegistrationSchema = z.object({
  name: shopNameSchema,
  ownerName: ownerNameSchema,
  whatsapp: pakistaniPhoneSchema,
  category: z.enum([
    'kiryana',
    'pharmacy',
    'sabzi',
    'bakery',
    'mobile',
    'clothing',
    'hardware',
    'beauty',
    'restaurant',
    'other',
  ]),
  address: z
    .string()
    .trim()
    .min(5, 'Address kam az kam 5 characters ka hona chahiye')
    .max(200, 'Address 200 characters se zyada nahi ho sakta'),
  city: z
    .string()
    .trim()
    .min(2, 'City name kam az kam 2 characters ka hona chahiye')
    .max(50, 'City name 50 characters se zyada nahi ho sakta'),
  area: z
    .string()
    .trim()
    .min(2, 'Area name kam az kam 2 characters ka hona chahiye')
    .max(100, 'Area name 100 characters se zyada nahi ho sakta'),
  openTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time HH:MM format mein hona chahiye'),
  closeTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time HH:MM format mein hona chahiye'),
});

/**
 * Deal validation schema
 */
export const dealSchema = z
  .object({
    productName: z
      .string()
      .trim()
      .min(2, 'Product name kam az kam 2 characters ka hona chahiye')
      .max(100, 'Product name 100 characters se zyada nahi ho sakta'),
    originalPrice: priceSchema,
    dealPrice: priceSchema,
    note: z
      .string()
      .max(200, 'Note 200 characters se zyada nahi ho sakta')
      .optional(),
  })
  .refine(
    (data) => {
      return data.dealPrice < data.originalPrice;
    },
    {
      message: 'Deal price original price se kam honi chahiye',
      path: ['dealPrice'],
    }
  );

/**
 * Product validation schema
 */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product name kam az kam 2 characters ka hona chahiye')
    .max(100, 'Product name 100 characters se zyada nahi ho sakta'),
  nameUrdu: z.string().max(100).nullable().optional(),
  category: z.enum([
    'atta_rice',
    'oil_ghee',
    'dairy',
    'sugar_salt',
    'tea_drinks',
    'soap_hygiene',
    'pulses',
    'spices',
    'snacks',
    'cleaning',
    'medicines',
    'vitamins',
    'vegetables',
    'fruits',
    'bread_baked',
    'electronics',
    'other',
  ]),
  price: priceSchema,
  unit: z.string().min(1, 'Unit daalen').max(20),
  inStock: z.boolean(),
});

// Export types
export type ShopRegistrationInput = z.infer<typeof shopRegistrationSchema>;
export type DealInput = z.infer<typeof dealSchema>;
export type ProductInput = z.infer<typeof productSchema>;
