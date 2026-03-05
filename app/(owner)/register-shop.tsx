/**
 * app/(owner)/register-shop.tsx
 * Shop registration screen with 4-step form
 * Steps: Shop Info → Location → Category → Verification
 */

import { zodResolver } from '@hookform/resolvers/zod';
import type { Shop } from '@models/Shop';
import { createShop } from '@services/shopService';
import { useAuthStore } from '@store/authStore';
import { useLocationStore } from '@store/locationStore';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { z } from 'zod';
import { CustomButton } from '../../src/components/CustomButton';
import { LocationPicker } from '../../src/components/LocationPicker';
import { TextInput } from '../../src/components/TextInput';

const shopRegistrationSchema = z.object({
  name: z.string().min(2, 'Shop name required'),
  nameUrdu: z.string().min(2, 'Shop name in Urdu required'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
  category: z.enum([
    'kiryana',
    'pharmacy',
    'sabzi',
    'bakery',
    'general',
  ]),
  phone: z.string().regex(/^\+92\d{10}$/, 'Valid phone required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
});

type ShopFormData = z.infer<typeof shopRegistrationSchema>;

export default function RegisterShopScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { location, area, city } = useLocationStore();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShopFormData>({
    resolver: zodResolver(shopRegistrationSchema),
    defaultValues: {
      name: '',
      nameUrdu: '',
      description: '',
      category: 'general',
      phone: user?.phone || '',
      address: '',
      city: '',
    },
  });

  const category = watch('category');
  const address = watch('address');

  const handleNextStep = useCallback(() => {
    if (step < 4) {
      setStep(step + 1);
    }
  }, [step]);

  const handlePreviousStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const onSubmit = async (data: ShopFormData) => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location not set');
      return;
    }

    setIsLoading(true);
    try {
      const shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'ratingCount' | 'totalViews' | 'todayViews' | 'whatsappClicks'> = {
        name: data.name,
        ownerName: user.name,
        ownerId: user.id,
        category: data.category as any,
        whatsapp: data.phone,
        phone: data.phone,
        location: {
          latitude: location.lat,
          longitude: location.lng,
          geohash: '', // Will be calculated by service
          address: data.address,
          area: area || '',
          city: data.city,
        },
        photoUrl: null,
        isOpen: true,
        isActive: true,
        hours: {
          openTime: '09:00',
          closeTime: '23:00',
          isOpen24Hours: false,
        },
        payment: {
          jazzCashNumber: null,
          easyPaisaNumber: null,
          bankAccount: null,
        },
        isVerified: false,
      };

      const shopId = await createShop(shopData);

      // Update user's shopId in auth store
      // Note: This should be handled by your auth service
      
      Alert.alert(
        'Success',
        'Shop registered successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(owner)/dashboard');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Shop registration error:', error);
      Alert.alert('Error', 'Failed to register shop');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Shop Information
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="Shop Name (English)"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm">{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="nameUrdu"
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="دکان کا نام (اردو)"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
              )}
            />
            {errors.nameUrdu && (
              <Text className="text-red-500 text-sm">
                {errors.nameUrdu.message}
              </Text>
            )}

            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="+92 300 1234567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              )}
            />
            {errors.phone && (
              <Text className="text-red-500 text-sm">{errors.phone.message}</Text>
            )}
          </View>
        );

      case 2:
        return (
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Location
            </Text>
            <LocationPicker />

            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="Store Address"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                  multiline
                />
              )}
            />
            {errors.address && (
              <Text className="text-red-500 text-sm">{errors.address.message}</Text>
            )}

            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="City"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
              )}
            />
            {errors.city && (
              <Text className="text-red-500 text-sm">{errors.city.message}</Text>
            )}
          </View>
        );

      case 3:
        return (
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Category
            </Text>

            {['kiryana', 'pharmacy', 'sabzi', 'bakery', 'general'].map(
              (cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setValue('category', cat as any)}
                  className={`p-4 rounded-lg border-2 ${
                    category === cat
                      ? 'bg-red-50 border-red-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      category === cat ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            )}

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="Shop Description"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm">
                {errors.description.message}
              </Text>
            )}
          </View>
        );

      case 4:
        return (
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Verification
            </Text>
            <View className="bg-blue-50 p-4 rounded-lg">
              <Text className="text-sm text-blue-900 mb-2">
                📋 Your shop details will be reviewed within 24-48 hours.
              </Text>
              <Text className="text-sm text-blue-800">
                Make sure all information is accurate for faster verification.
              </Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="font-semibold text-gray-800 mb-2">Summary</Text>
              <Text className="text-sm text-gray-600 mb-1">
                Name: {watch('name')}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                Category: {category}
              </Text>
              <Text className="text-sm text-gray-600">
                City: {watch('city')}
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Progress Indicator */}
      <View className="mb-6">
        <Text className="text-sm text-gray-600 mb-2">
          Step {step} of 4
        </Text>
        <View className="flex-row space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-red-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </View>
      </View>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <View className="flex-row space-x-3 mt-8">
        <TouchableOpacity
          onPress={handlePreviousStep}
          disabled={step === 1 || isLoading}
          className={`flex-1 py-3 rounded-lg border border-gray-300 ${
            step === 1 || isLoading ? 'opacity-50' : ''
          }`}
        >
          <Text className="text-center text-gray-700 font-medium">
            Previous
          </Text>
        </TouchableOpacity>

        {step < 4 ? (
          <CustomButton
            title="Next"
            onPress={handleNextStep}
            disabled={isLoading}
          />
        ) : (
          <View className="flex-row items-center">
            <CustomButton
              title={isLoading ? 'Loading...' : 'Submit'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            />
            {isLoading && <ActivityIndicator color="#2563eb" style={{ marginLeft: 10 }} />}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
