/**
 * Notifications Screen - Placeholder
 * TODO: Implement FEATURE 09
 */
import { Text, View } from 'react-native';

export default function NotificationsScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">اطلاعات</Text>
      </View>
      
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          ابھی کوئی اطلاع نہیں
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Deals اور خاص آفرز کی اطلاع یہاں ملے گی
        </Text>
      </View>
    </View>
  );
}
