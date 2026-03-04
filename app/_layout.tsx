/**
 * Root Layout - App entry point with providers and auth guard
 */
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { initDB } from '@services/offlineService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { initI18n } from '../src/i18n';
import { useAuthStore } from '../src/store/authStore';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Configure TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading, isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize i18n
        await initI18n();

        // Initialize SQLite database
        await initDB();
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  // Hide splash screen when ready
  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  // Auth guard - redirect based on auth state
  useEffect(() => {
    if (isLoading || !fontsLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inOwnerGroup = segments[0] === '(owner)';

    if (!isAuthenticated) {
      // Not authenticated → redirect to auth
      if (!inAuthGroup) {
        router.replace('/(auth)/role-select');
      }
    } else if (isAuthenticated && user) {
      // Authenticated
      if (!user.role || user.role === 'customer') {
        // Customer role
        if (!inCustomerGroup && !inAuthGroup) {
          router.replace('/(customer)');
        }
      } else if (user.role === 'owner') {
        // Owner role
        if (!inOwnerGroup && !inAuthGroup) {
          router.replace('/(owner)/dashboard');
        }
      }
    }
  }, [isAuthenticated, user, segments, isLoading, fontsLoaded]);

  // Show nothing while loading
  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(owner)" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
