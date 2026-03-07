/**
 * app/(onboarding)/index.tsx
 * Onboarding carousel with 3 introduction slides
 * Slides: 1. Find nearby shops
 *         2. Compare prices
 *         3. Order via WhatsApp
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useLanguage } from '../../src/hooks/useLanguage';
import { useAuthStore } from '../../src/store/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, markOnboarded } = useAuthStore();
  const { t, setLanguage } = useLanguage();
  const flatListRef = useRef<FlatList>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const slides: OnboardingSlide[] = useMemo(
    () => [
      {
        id: '1',
        title: t('onboarding.slide1_title'),
        description: t('onboarding.slide1_desc'),
        icon: 'map',
      },
      {
        id: '2',
        title: t('onboarding.slide2_title'),
        description: t('onboarding.slide2_desc'),
        icon: 'search',
      },
      {
        id: '3',
        title: t('onboarding.slide3_title'),
        description: t('onboarding.slide3_desc'),
        icon: 'logo-whatsapp',
      },
    ],
    [t]
  );

  const getIllustrationColor = (icon: OnboardingSlide['icon']) =>
    icon === 'search' ? '#2563eb' : '#16a34a';

  const getIllustrationBg = (icon: OnboardingSlide['icon']) =>
    icon === 'search' ? 'bg-blue-100' : 'bg-green-100';

  const handleNext = useCallback(() => {
    if (activeSlide < slides.length - 1) {
      const nextIndex = activeSlide + 1;
      setActiveSlide(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  }, [activeSlide]);

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      if (user?.id) {
        await markOnboarded();
      }
      
      // Navigate based on user role
      if (user?.role === 'owner') {
        router.replace('/(owner)/dashboard');
      } else {
        router.replace('/(customer)');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsCompleting(false);
    }
  }, [user, markOnboarded, router]);

  const handleSkip = useCallback(async () => {
    setIsCompleting(true);
    try {
      if (user?.id) {
        await markOnboarded();
      }
      
      if (user?.role === 'owner') {
        router.replace('/(owner)/dashboard');
      } else {
        router.replace('/(customer)');
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      setIsCompleting(false);
    }
  }, [user, markOnboarded, router]);

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={{ width: SCREEN_WIDTH }} className="h-full bg-white items-center justify-center px-6">
      <View className={`w-24 h-24 ${getIllustrationBg(item.icon)} rounded-full items-center justify-center mb-4`}>
        <Ionicons name={item.icon} size={48} color={getIllustrationColor(item.icon)} />
      </View>
      <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
        {item.title}
      </Text>
      <Text className="text-base text-gray-600 text-center leading-6">
        {item.description}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header with Skip Button */}
      {activeSlide < slides.length - 1 && (
        <View className="pt-4 pr-6 flex-row justify-end">
          <TouchableOpacity
            onPress={handleSkip}
            disabled={isCompleting}
          >
            <Text className="text-sm font-medium text-gray-600">{t('onboarding.skip')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal={true}
        pagingEnabled={true}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      />

      {/* Bottom Section */}
      <View className="pb-8 px-6">
        {/* Progress Dots */}
        <View className="flex-row justify-center items-center mb-6">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === activeSlide
                  ? 'bg-green-600 w-6'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </View>

        {/* Action Button */}
        {activeSlide === slides.length - 1 ? (
          <TouchableOpacity
            onPress={handleComplete}
            disabled={isCompleting}
            className="bg-green-600 rounded-lg py-4 flex-row items-center justify-center"
          >
            <Text className="text-white font-semibold text-base">
              {t('onboarding.get_started')}
            </Text>
            <Text className="text-white ml-2">✓</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            className="bg-green-600 rounded-lg py-4 flex-row items-center justify-center"
          >
            <Text className="text-white font-semibold text-base">{t('onboarding.next')}</Text>
            <Text className="text-white ml-2">→</Text>
          </TouchableOpacity>
        )}

        {/* Language Toggle */}
        <View className="flex-row justify-center mt-4">
          <TouchableOpacity className="px-3 py-2" onPress={() => setLanguage('en')}>
            <Text className="text-sm text-green-600 font-medium">English</Text>
          </TouchableOpacity>
          <Text className="text-gray-400">/</Text>
          <TouchableOpacity className="px-3 py-2" onPress={() => setLanguage('ur')}>
            <Text className="text-sm text-green-600 font-medium">اردو</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
