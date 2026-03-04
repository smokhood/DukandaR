/**
 * Favourites Screen - Placeholder
 * TODO: Implement FEATURE 09
 */
import { Text, View } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';

export default function FavouritesScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">پسندیدہ دکانیں</Text>
      </View>
      
      <EmptyState
        variant="empty_favourites"
        actionLabel="دکانیں تلاش کریں"
        onAction={() => {
          // Navigate to search
        }}
      />
    </View>
  );
}
