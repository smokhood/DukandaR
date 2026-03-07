/**
 * My Orders Screen - Customer order history
 */
import type { Order } from '@models/Order';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@utils/formatters';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { useLanguage } from '../../src/hooks/useLanguage';
import * as orderService from '../../src/services/orderService';
import { useAuthStore } from '../../src/store/authStore';

export default function MyOrdersScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return orderService.getCustomerOrders(user.id);
    },
    enabled: !!user?.id,
  });

  const formatDate = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t('customer.today');
    if (days === 1) return t('customer.yesterday');
    if (days < 7) return `${days} ${t('customer.days_ago')}`;
    
    return date.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [language, t]);

  const renderOrder = ({ item: order }: { item: Order }) => (
    <Pressable
      onPress={() => {
        // Could navigate to order detail screen
      }}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-gray-900 font-bold text-base">
            {order.shopName}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {formatDate(order.createdAt)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-green-600 font-bold text-lg">
            {formatPrice(order.subtotal)}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            {order.items.length} {t('customer.items')}
          </Text>
        </View>
      </View>

      {/* Order Items Summary */}
      <View className="border-t border-gray-100 pt-2 mt-2">
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} className="text-gray-600 text-sm" numberOfLines={1}>
            • {item.productName} x{item.quantity}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text className="text-gray-400 text-xs mt-1">
            {t('customer.and_more', { count: order.items.length - 2 })}...
          </Text>
        )}
      </View>

      {order.note && (
        <View className="bg-gray-50 rounded-lg p-2 mt-2">
          <Text className="text-gray-600 text-xs" numberOfLines={2}>
            {t('customer.note_label')} {order.note}
          </Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">{t('customer.my_orders')}</Text>
          {orders.length > 0 && (
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-semibold text-green-700">
                {orders.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          variant="empty_orders"
          title={t('customer.no_orders')}
          subtitle={t('customer.no_orders_yet')}
          actionLabel={t('customer.search_shops')}
          onAction={() => router.push('/(customer)')}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => refetch()}
              tintColor="#16a34a"
            />
          }
        />
      )}
    </View>
  );
}
