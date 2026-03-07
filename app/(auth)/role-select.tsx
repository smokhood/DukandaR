/**
 * Role Selection Screen - Choose Customer or Owner
 */
import { Ionicons } from '@expo/vector-icons';
import type { UserRole } from '@models/User';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useLanguage } from '../../src/hooks/useLanguage';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RoleSelectScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { t, language, setLanguage } = useLanguage();

  const customerScale = useSharedValue(1);
  const ownerScale = useSharedValue(1);

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    // Navigate to OTP screen with role
    router.push({
      pathname: '/(auth)/otp' as any,
      params: { role },
    });
  };

  // Animated styles for cards
  const customerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: customerScale.value }],
  }));

  const ownerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ownerScale.value }],
  }));

  return (
    <View className="flex-1 bg-primary">
      {/* Top Section - Logo & Tagline */}
      <View className="flex-[2] items-center justify-center px-6">
        <Ionicons name="bag-handle" size={64} color="white" />
        <Text className="text-white text-4xl font-bold mt-4 text-center">
          {t('common.app_name')}
        </Text>
        <Text className="text-white text-base mt-2 text-center opacity-90">
          {t('auth.tagline')}
        </Text>
      </View>

      {/* Bottom Section - Role Cards */}
      <View className="flex-[3] bg-white rounded-t-3xl px-6 pt-8 pb-6">
        <Text className="text-2xl font-bold text-gray-900 text-center mb-8">
          {language === 'ur' ? 'آپ کون ہیں؟' : 'Who are you?'}
        </Text>

        {/* Role Cards Container */}
        <View className="flex-row gap-4 mb-8">
          {/* Customer Card */}
          <AnimatedPressable
            style={[customerStyle]}
            className="flex-1 bg-white rounded-2xl p-6 items-center border-2 border-gray-200 shadow-sm"
            onPressIn={() => {
              customerScale.value = withSpring(0.95);
            }}
            onPressOut={() => {
              customerScale.value = withSpring(1);
            }}
            onPress={() => handleRoleSelect('customer')}
          >
            <View className="bg-primary/10 p-4 rounded-full mb-3">
              <Ionicons name="cart" size={32} color="#16a34a" />
            </View>
            <Text className="text-base font-semibold text-gray-900 text-center mb-1">
              {t('auth.i_am_customer')}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              {t('auth.shop_from_nearby')}
            </Text>
          </AnimatedPressable>

          {/* Owner Card */}
          <AnimatedPressable
            style={[ownerStyle]}
            className="flex-1 bg-white rounded-2xl p-6 items-center border-2 border-gray-200 shadow-sm"
            onPressIn={() => {
              ownerScale.value = withSpring(0.95);
            }}
            onPressOut={() => {
              ownerScale.value = withSpring(1);
            }}
            onPress={() => handleRoleSelect('owner')}
          >
            <View className="bg-primary/10 p-4 rounded-full mb-3">
              <Ionicons name="storefront" size={32} color="#16a34a" />
            </View>
            <Text className="text-base font-semibold text-gray-900 text-center mb-1">
              {t('auth.i_am_shop_owner')}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              {t('auth.register_your_shop')}
            </Text>
          </AnimatedPressable>
        </View>

        {/* Language Toggle */}
        <View className="flex-row items-center justify-center gap-2 mt-auto">
          <Pressable
            onPress={() => setLanguage('en')}
            className={`px-6 py-2 rounded-full ${
              language === 'en' ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`font-medium ${
                language === 'en' ? 'text-white' : 'text-gray-700'
              }`}
            >
              English
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage('ur')}
            className={`px-6 py-2 rounded-full ${
              language === 'ur' ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`font-medium ${
                language === 'ur' ? 'text-white' : 'text-gray-700'
              }`}
            >
              اردو
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
