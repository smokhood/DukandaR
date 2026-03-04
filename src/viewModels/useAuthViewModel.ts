/**
 * Auth ViewModel - Business logic for authentication flow
 * Handles OTP, biometric auth, user management
 */
import type { User, UserRole } from '@models/User';
import { auth, db } from '@services/firebase';
import { clearOldCache } from '@services/offlineService';
import { formatPhone } from '@utils/formatters';
import { otpSchema, pakistaniPhoneSchema } from '@utils/validators';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import {
    ConfirmationResult,
    signInWithPhoneNumber,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuthViewModel() {
  const router = useRouter();
  const { setUser, setLoading, clearUser: clearAuthStore } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /**
   * Send OTP to phone number
   */
  const sendOTP = async (phone: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate and format phone
      const validation = pakistaniPhoneSchema.safeParse(phone);
      if (!validation.success) {
        throw new Error('Valid Pakistani number daalen (03XX-XXXXXXX)');
      }

      const formattedPhone = formatPhone(phone);
      setPhoneNumber(formattedPhone);

      // In development/Expo Go, Firebase Phone Auth requires reCAPTCHA
      // which doesn't work in React Native. You'll need to use a dev build
      // or Firebase Auth emulator for testing.
      // For production, this will work fine.

      // Note: signInWithPhoneNumber requires a RecaptchaVerifier in web context
      // In React Native, it needs proper setup. For MVP, we'll handle the error gracefully.
      
      try {
        const confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          // @ts-ignore - RecaptchaVerifier is web-only, handled by native
          undefined
        );
        confirmationResultRef.current = confirmation;
        setOtpSent(true);
        setCountdown(60);
      } catch (authError: any) {
        // Provide helpful error messages
        if (authError.code === 'auth/invalid-phone-number') {
          throw new Error('موبائل نمبر درست نہیں');
        } else if (authError.code === 'auth/too-many-requests') {
          throw new Error('بہت زیادہ کوششیں، کچھ دیر بعد آزمائیں');
        } else if (authError.code === 'auth/network-request-failed') {
          throw new Error('انٹرنیٹ چیک کریں');
        } else {
          throw new Error('OTP بھیجنے میں مسئلہ ہوا');
        }
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || 'OTP بھیجنے میں ناکامی');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP code
   */
  const verifyOTP = async (otp: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate OTP
      const validation = otpSchema.safeParse(otp);
      if (!validation.success) {
        throw new Error('6 digit OTP daalen');
      }

      if (!confirmationResultRef.current) {
        throw new Error('پہلے OTP بھیجیں');
      }

      // Confirm OTP
      try {
        const userCredential = await confirmationResultRef.current.confirm(otp);
        const firebaseUser = userCredential.user;

        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        let userData: User;

        if (userDoc.exists()) {
          // Existing user
          userData = userDoc.data() as User;
        } else {
          // New user - create document
          userData = {
            id: firebaseUser.uid,
            phone: phoneNumber,
            name: '',
            role: 'customer', // Default, will be updated in role selection
            shopId: null,
            savedShops: [],
            isOnboarded: false,
            preferredLanguage: 'ur',
            createdAt: new Date() as any,
            updatedAt: new Date() as any,
          };

          await setDoc(userDocRef, userData);
        }

        // Update auth store
        setUser(userData);

        // Clear confirmation result
        confirmationResultRef.current = null;
        setOtpSent(false);
      } catch (authError: any) {
        if (authError.code === 'auth/invalid-verification-code') {
          throw new Error('OTP غلط ہے');
        } else if (authError.code === 'auth/code-expired') {
          throw new Error('OTP کی میعاد ختم ہو گئی');
        } else {
          throw new Error('تصدیق میں ناکامی');
        }
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'OTP تصدیق میں ناکامی');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set/update user role
   */
  const setUserRole = async (role: UserRole): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userDocRef,
        {
          role,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Fetch updated user
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      }
    } catch (err: any) {
      console.error('Set user role error:', err);
      setError(err.message || 'Role update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const resendOTP = async (): Promise<void> => {
    if (countdown > 0) {
      throw new Error(`${countdown} seconds میں دوبارہ کوشش کریں`);
    }

    await sendOTP(phoneNumber);
  };

  /**
   * Check biometric availability
   */
  const checkBiometricAvailability = async (): Promise<{
    available: boolean;
    type: string;
  }> => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

      let typeString = 'Unknown';
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        typeString = 'Face ID';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        typeString = 'Fingerprint';
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        typeString = 'Iris';
      }

      return {
        available: compatible && enrolled,
        type: typeString,
      };
    } catch (error) {
      console.error('Check biometric error:', error);
      return { available: false, type: 'Unknown' };
    }
  };

  /**
   * Authenticate with biometric
   */
  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'DukandaR mein dakhil hon',
        fallbackLabel: 'پاس ورڈ استعمال کریں',
        cancelLabel: 'منسوخ',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      // Sign out from Firebase
      await signOut(auth);

      // Clear auth store
      clearAuthStore();

      // Clear SQLite cache
      await clearOldCache();

      // Navigate to role select
      router.replace('/(auth)/role-select' as any);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    phoneNumber,
    otpSent,
    isLoading,
    error,
    countdown,

    // Functions
    sendOTP,
    verifyOTP,
    setUserRole,
    resendOTP,
    checkBiometricAvailability,
    authenticateWithBiometric,
    logout,
  };
}
