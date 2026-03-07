/**
 * Order Builder Screen - Review and send order via WhatsApp
 */
import { EmptyState } from '@components/EmptyState';
import { OrderItem } from '@components/OrderItem';
import { WhatsAppButton } from '@components/WhatsAppButton';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@utils/formatters';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Clipboard,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useLanguage } from '../../src/hooks/useLanguage';
import * as shopService from '../../src/services/shopService';
import { useOrderViewModel } from '../../src/viewModels/useOrderViewModel';

export default function OrderScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const {
    items,
    shopId,
    shopName,
    shopWhatsapp,
    note,
    totalItems,
    totalPrice,
    isEmpty,
    removeItem,
    updateQuantity,
    setNote: updateNote,
    clearCart,
    sendOrderViaWhatsApp,
    isLoading,
  } = useOrderViewModel();

  const [noteText, setNoteText] = useState(note);

  // Fetch shop details
  const { data: shop } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => (shopId ? shopService.getShopById(shopId) : null),
    enabled: !!shopId,
  });

  const handleNoteChange = useCallback((text: string) => {
    setNoteText(text);
    updateNote(text);
  }, [updateNote]);

  const handleIncrement = useCallback((productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  }, [items, updateQuantity]);

  const handleDecrement = useCallback((productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (item) {
      if (item.quantity === 1) {
        Alert.alert(
          t('customer.remove_item'),
          t('customer.remove_item_confirm'),
          [
            { text: t('common.no'), style: 'cancel' },
            { text: t('common.yes'), onPress: () => removeItem(productId) },
          ]
        );
      } else {
        updateQuantity(productId, item.quantity - 1);
      }
    }
  }, [items, removeItem, t, updateQuantity]);

  const handleRemove = useCallback((productId: string) => {
    removeItem(productId);
  }, [removeItem]);

  const handleClearCart = useCallback(() => {
    Alert.alert(
      t('customer.clear_cart_title'),
      t('customer.clear_cart_confirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => {
            clearCart();
            router.back();
          },
        },
      ]
    );
  }, [clearCart, router, t]);

  const handleSendOrder = useCallback(async () => {
    try {
      await sendOrderViaWhatsApp();
      // After alert dismissed, navigate back
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      // Error already shown in alert
    }
  }, [router, sendOrderViaWhatsApp]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert(t('customer.copied'), `${label} ${t('customer.has_been_copied')}`);
  }, [t]);

  if (isEmpty) {
    return (
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white pt-12 pb-4 px-4 flex-row items-center border-b border-gray-200">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900 ml-3">{t('customer.my_order')}</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <EmptyState
            variant="empty_orders"
            title={t('customer.my_order')}
            subtitle={t('customer.nothing_added_yet')}
            actionLabel={t('customer.search_shops')}
            onAction={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const isCurrentlyOpen =
    shop && shop.isOpen && new Date().getHours() >= 8 && new Date().getHours() < 23;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="ml-3 flex-1">
            <Text className="text-xl font-bold text-gray-900">{t('customer.my_order')}</Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {shopName}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        {/* Shop Info Bar */}
        {shop && (
          <View className="bg-white px-4 py-3 mb-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {shopName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="ellipse"
                  size={10}
                  color={isCurrentlyOpen ? '#10b981' : '#ef4444'}
                />
                <Text className="text-gray-600 text-sm ml-1">
                  {isCurrentlyOpen ? t('customer.open') : t('customer.shop_closed')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View className="px-4 py-2">
          <Text className="text-gray-700 font-semibold text-lg mb-3">
            {t('customer.order_details')}
          </Text>
          {items.map((item) => (
            <OrderItem
              key={item.productId}
              item={item}
              onIncrement={() => handleIncrement(item.productId)}
              onDecrement={() => handleDecrement(item.productId)}
              onRemove={() => handleRemove(item.productId)}
            />
          ))}
        </View>

        {/* Separator */}
        <View className="h-2 bg-gray-200 my-2" />

        {/* Payment Info */}
        {shop?.payment &&
          (shop.payment.jazzCashNumber || shop.payment.easyPaisaNumber) && (
            <View className="bg-white mx-4 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Text className="text-lg">💳</Text>
                <Text className="text-gray-900 font-semibold text-base ml-2">
                  {t('customer.payment_information')}
                </Text>
              </View>

              {shop.payment.jazzCashNumber && (
                <View className="bg-gray-50 rounded-lg p-3 mb-2 flex-row items-center justify-between">
                  <View>
                    <Text className="text-gray-600 text-sm">JazzCash</Text>
                    <Text className="text-gray-900 font-semibold text-base">
                      {shop.payment.jazzCashNumber}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      copyToClipboard(
                        shop.payment.jazzCashNumber!,
                        t('customer.jazzcash_number')
                      )
                    }
                    className="bg-gray-200 rounded-lg p-2"
                  >
                    <Ionicons name="copy-outline" size={20} color="#374151" />
                  </Pressable>
                </View>
              )}

              {shop.payment.easyPaisaNumber && (
                <View className="bg-gray-50 rounded-lg p-3 mb-2 flex-row items-center justify-between">
                  <View>
                    <Text className="text-gray-600 text-sm">EasyPaisa</Text>
                    <Text className="text-gray-900 font-semibold text-base">
                      {shop.payment.easyPaisaNumber}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      copyToClipboard(
                        shop.payment.easyPaisaNumber!,
                        t('customer.easypaisa_number')
                      )
                    }
                    className="bg-gray-200 rounded-lg p-2"
                  >
                    <Ionicons name="copy-outline" size={20} color="#374151" />
                  </Pressable>
                </View>
              )}

              <Text className="text-gray-500 text-xs mt-2">
                {t('customer.make_payment_after')}
              </Text>
            </View>
          )}

        {/* Add Note */}
        <View className="bg-white mx-4 rounded-xl p-4 mb-4">
          <Text className="text-gray-900 font-semibold text-base mb-2">
            {t('customer.add_note_optional')}
          </Text>
          <Text className="text-gray-500 text-sm mb-3">
            {t('customer.delivery_instructions')}
          </Text>
          <TextInput
            value={noteText}
            onChangeText={handleNoteChange}
            placeholder={t('customer.write_note_here')}
            multiline={true}
            numberOfLines={3}
            maxLength={200}
            className="bg-gray-50 rounded-lg p-3 text-gray-900 text-base"
            style={{ textAlignVertical: 'top' }}
          />
          <Text className="text-gray-400 text-xs mt-2 text-right">
            {noteText.length}/200
          </Text>
        </View>

        {/* Order Summary */}
        <View className="bg-gray-100 mx-4 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-700 text-base">
              {t('customer.order_items')} ({totalItems})
            </Text>
            <Text className="text-gray-900 font-semibold text-base">
              {formatPrice(totalPrice)}
            </Text>
          </View>

          <View className="border-t border-gray-300 my-2" />

          <View className="flex-row justify-between">
            <Text className="text-gray-900 font-bold text-lg">{t('customer.order_total')}</Text>
            <Text className="text-green-600 font-bold text-xl">
              {formatPrice(totalPrice)}
            </Text>
          </View>
        </View>

        {/* Spacer for bottom button */}
        <View className="h-40" />
      </ScrollView>

      {/* Bottom WhatsApp Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <WhatsAppButton
          onPress={handleSendOrder}
          label={t('customer.send_order_whatsapp')}
          size="lg"
          disabled={isLoading}
        />
        <Text className="text-gray-500 text-center text-xs mt-2">
          {t('customer.order_will_be_sent')}
        </Text>
      </View>
    </View>
  );
}
