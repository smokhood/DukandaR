/**
 * Shop Detail Screen - Full shop catalog and order builder
 */
import { DealCard } from '@components/DealCard';
import { EmptyState } from '@components/EmptyState';
import { SearchBar } from '@components/SearchBar';
import { ShopCardSkeleton } from '@components/SkeletonLoader';
import { StockBadge } from '@components/StockBadge';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '@models/Product';
import { useCartStore, useTotalItems, useTotalPrice } from '@store/cartStore';
import { formatPrice, formatTime } from '@utils/formatters';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { useLanguage } from '../../../src/hooks/useLanguage';
import { useFavouritesViewModel } from '../../../src/viewModels/useFavouritesViewModel';
import { useShopViewModel } from '../../../src/viewModels/useShopViewModel';

const HEADER_HEIGHT = 200;

export default function ShopDetailScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const shopId = params.id;

  const {
    shop,
    products,
    deals,
    groupedProducts,
    categoryList,
    filteredProducts,
    isCurrentlyOpen,
    isLoading,
    error,
    rateShop,
    flagProduct,
    searchInShop,
    searchQuery,
  } = useShopViewModel({ shopId });

  const { toggleFavourite, isFavourite } = useFavouritesViewModel();

  const { items: cartItems, shopId: cartShopId } = useCartStore();
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavouriting, setIsFavouriting] = useState(false);
  const [isRating, setIsRating] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header style
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT - 60], [0, 1]);
    return {
      opacity,
      backgroundColor: 'white',
    };
  });

  // Animated title style
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT - 60], [0, 1]);
    return { opacity };
  });

  // Animated back button style
  const backButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - 60],
      [0, 1]
    );
    return {
      backgroundColor:
        backgroundColor > 0.5 ? 'white' : 'rgba(0, 0, 0, 0.3)',
    };
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Queries will auto-refetch
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleCall = useCallback(() => {
    if (shop?.phone) {
      Linking.openURL(`tel:${shop.phone}`);
    }
  }, [shop?.phone]);

  const handleWhatsApp = useCallback(() => {
    if (shop?.whatsapp) {
      const message = t('customer.shop_whatsapp_message', {
        shopName: shop.name,
      });
      const url = `whatsapp://send?phone=${shop.whatsapp.replace(
        /[+\s]/g,
        ''
      )}&text=${encodeURIComponent(message)}`;
      Linking.openURL(url);
    }
  }, [shop?.whatsapp, shop?.name, t]);

  const handleDirections = useCallback(() => {
    if (shop?.location) {
      const url = Platform.select({
        ios: `maps://app?daddr=${shop.location.latitude},${shop.location.longitude}`,
        android: `google.navigation:q=${shop.location.latitude},${shop.location.longitude}`,
      });
      if (url) {
        Linking.openURL(url);
      }
    }
  }, [shop?.location]);

  const handleAddToCart = useCallback((product: Product, overridePrice?: number) => {
    const { addItem, setShop } = useCartStore.getState();

    const cartItem = {
      productId: product.id,
      productName: product.name,
      productNameUrdu: product.nameUrdu,
      price: overridePrice ?? product.price,
      quantity: 1,
      unit: product.unit,
      shopId: product.shopId,
      shopName: shop?.name || '',
      shopWhatsapp: shop?.whatsapp || '',
    };

    // Check if different shop
    if (cartShopId && cartShopId !== product.shopId) {
      Alert.alert(
        t('customer.start_order_new_shop'),
        t('customer.old_order_lost'),
        [
          { text: t('common.no'), style: 'cancel' },
          {
            text: t('common.yes'),
            onPress: () => {
              addItem(cartItem);
            },
          },
        ]
      );
    } else {
      addItem(cartItem);
    }
  }, [cartShopId, shop?.name, shop?.whatsapp, t]);

  const handleViewCart = useCallback(() => {
    router.push('/(customer)/order' as any);
  }, [router]);

  const handleRateShop = useCallback(() => {
    if (isRating) return;
    
    Alert.alert(t('customer.rate_shop_title'), t('customer.how_many_stars'), [
      { 
        text: '⭐ 1', 
        onPress: async () => {
          setIsRating(true);
          try {
            await rateShop(1);
            Alert.alert(t('customer.thank_you'), t('customer.rating_saved'));
          } catch (error) {
            Alert.alert(t('customer.error'), t('customer.rating_save_failed'));
          } finally {
            setIsRating(false);
          }
        }
      },
      { 
        text: '⭐⭐ 2', 
        onPress: async () => {
          setIsRating(true);
          try {
            await rateShop(2);
            Alert.alert(t('customer.thank_you'), t('customer.rating_saved'));
          } catch (error) {
            Alert.alert(t('customer.error'), t('customer.rating_save_failed'));
          } finally {
            setIsRating(false);
          }
        }
      },
      { 
        text: '⭐⭐⭐ 3', 
        onPress: async () => {
          setIsRating(true);
          try {
            await rateShop(3);
            Alert.alert(t('customer.thank_you'), t('customer.rating_saved'));
          } catch (error) {
            Alert.alert(t('customer.error'), t('customer.rating_save_failed'));
          } finally {
            setIsRating(false);
          }
        }
      },
      { 
        text: '⭐⭐⭐⭐ 4', 
        onPress: async () => {
          setIsRating(true);
          try {
            await rateShop(4);
            Alert.alert(t('customer.thank_you'), t('customer.rating_saved'));
          } catch (error) {
            Alert.alert(t('customer.error'), t('customer.rating_save_failed'));
          } finally {
            setIsRating(false);
          }
        }
      },
      { 
        text: '⭐⭐⭐⭐⭐ 5', 
        onPress: async () => {
          setIsRating(true);
          try {
            await rateShop(5);
            Alert.alert(t('customer.thank_you'), t('customer.rating_saved'));
          } catch (error) {
            Alert.alert(t('customer.error'), t('customer.rating_save_failed'));
          } finally {
            setIsRating(false);
          }
        }
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [isRating, rateShop, t]);

  const handleToggleFavourite = useCallback(async () => {
    if (isFavouriting) return;
    
    setIsFavouriting(true);
    try {
      await toggleFavourite(shopId);
    } catch (error) {
      Alert.alert(t('customer.error'), t('customer.favourite_toggle_error'));
    } finally {
      setIsFavouriting(false);
    }
  }, [isFavouriting, toggleFavourite, shopId, t]);

  const handleDealPress = useCallback((deal: any) => {
    // Find the product in the catalog
    const product = products.find((p) => p.name === deal.productName);
    if (product) {
      // Add to cart with deal price instead of regular price
      handleAddToCart(product, deal.dealPrice);
      Alert.alert(
        t('customer.deal_added_title'),
        t('customer.deal_added_message', {
          productName: deal.productName,
          originalPrice: deal.originalPrice,
          dealPrice: deal.dealPrice,
          savingsAmount: deal.savingsAmount,
        })
      );
    } else {
      Alert.alert('Deal', `${deal.productName}\nRs. ${deal.dealPrice}`);
    }
  }, [products, handleAddToCart, t]);

  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      kiryana: '#16a34a',
      pharmacy: '#ef4444',
      sabzi: '#22c55e',
      bakery: '#f59e0b',
      mobile: '#3b82f6',
      clothing: '#ec4899',
      hardware: '#6b7280',
      beauty: '#a855f7',
      restaurant: '#f97316',
      other: '#64748b',
    };
    return colors[category] || '#64748b';
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <ShopCardSkeleton />
        <ShopCardSkeleton />
        <ShopCardSkeleton />
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <EmptyState
          variant="no_shops"
          title={t('customer.shop_not_found')}
          subtitle={error || t('customer.shop_details_load_failed')}
          actionLabel={t('customer.go_back')}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const displayProducts = selectedCategory
    ? groupedProducts[selectedCategory] || []
    : filteredProducts;

  const showCart =
    cartItems.length > 0 && cartShopId === shopId;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sticky Animated Header */}
      <Animated.View
        style={headerStyle}
        className="absolute top-0 left-0 right-0 z-10 pt-12 pb-3 px-4 flex-row items-center border-b border-gray-200"
      >
        <Animated.View style={backButtonStyle} className="mr-3 rounded-full">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
        </Animated.View>

        <Animated.View style={titleStyle} className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{shop.name}</Text>
        </Animated.View>

        <Pressable
          onPress={handleToggleFavourite}
          disabled={isFavouriting}
          className="ml-2 w-10 h-10 rounded-full bg-white items-center justify-center"
        >
          <Ionicons
            name={isFavourite(shopId) ? 'heart' : 'heart-outline'}
            size={24}
            color="#ef4444"
          />
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Banner */}
        <View
          className="h-[200px] relative"
          style={{ backgroundColor: getCategoryColor(shop.category) }}
        >
          {shop.photoUrl ? (
            <Image
              source={{ uri: shop.photoUrl }}
              className="w-full h-full"
              contentFit="cover"
            />
          ) : null}

          {/* Gradient Overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Floating Back Button */}
          <View className="absolute top-12 left-4">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
          </View>

          {/* Shop Name Over Image */}
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-white font-bold text-2xl">{shop.name}</Text>
            <View className="flex-row items-center mt-1">
              <View
                className="px-2 py-1 rounded-lg"
                style={{ backgroundColor: getCategoryColor(shop.category) }}
              >
                <Text className="text-white text-xs font-semibold">
                  {shop.category}
                </Text>
              </View>
              {shop.isVerified && (
                <View className="ml-2 flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text className="text-white text-xs ml-1">{t('customer.verified')}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Shop Info Section */}
        <View className="bg-white p-4 border-b border-gray-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text className="text-gray-900 font-semibold ml-1">
              {shop.rating.toFixed(1)}
            </Text>
            <Text className="text-gray-500 text-sm ml-1">
              ({shop.ratingCount})
            </Text>

            <Text className="text-gray-400 mx-2">•</Text>
            <Ionicons
              name="ellipse"
              size={12}
              color={isCurrentlyOpen ? '#10b981' : '#ef4444'}
            />
            <Text className="text-gray-600 text-sm ml-1">
              {isCurrentlyOpen ? t('customer.open') : t('customer.closed')}
            </Text>
          </View>

          <Text className="text-gray-600 text-sm">
            {isCurrentlyOpen
              ? t('customer.open_until_time', {
                  time: formatTime(shop.hours.closeTime),
                })
              : t('customer.opens_tomorrow_at_time', {
                  time: formatTime(shop.hours.openTime),
                })}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="bg-white px-4 py-3 flex-row">
          <Pressable
            onPress={handleCall}
            className="flex-1 bg-gray-100 rounded-xl py-3 items-center mr-2"
          >
            <Ionicons name="call" size={24} color="#16a34a" />
            <Text className="text-gray-900 text-sm font-semibold mt-1">
              {t('customer.call')}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleWhatsApp}
            className="flex-1 bg-gray-100 rounded-xl py-3 items-center mx-2"
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            <Text className="text-gray-900 text-sm font-semibold mt-1">
              {t('customer.whatsapp')}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDirections}
            className="flex-1 bg-gray-100 rounded-xl py-3 items-center ml-2"
          >
            <Ionicons name="navigate" size={24} color="#3b82f6" />
            <Text className="text-gray-900 text-sm font-semibold mt-1">
              {t('customer.directions')}
            </Text>
          </Pressable>
        </View>

        {/* Today's Deals */}
        {deals.length > 0 && (
          <View className="bg-white py-4 mt-2 border-t border-b border-gray-200">
            <View className="px-4 flex-row items-center mb-3">
              <Text className="text-lg font-bold text-gray-900">
                {t('customer.deals_today_with_fire')}
              </Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              className="px-4"
            >
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onPress={() => handleDealPress(deal)} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Catalog Section */}
        <View className="bg-white mt-2 pt-4">
          {/* Search Bar */}
          <View className="px-4 mb-3">
            <SearchBar
              value={searchQuery}
              onChangeText={searchInShop}
              onSubmit={searchInShop}
              onClear={() => searchInShop('')}
              placeholder={t('customer.search_in_shop')}
              autoFocus={false}
            />
          </View>

          {/* Category Tabs */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-4"
          >
            <Pressable
              onPress={() => setSelectedCategory(null)}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === null ? 'bg-green-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedCategory === null ? 'text-white' : 'text-gray-700'
                }`}
              >
                {t('customer.all')} ({products.length})
              </Text>
            </Pressable>

            {categoryList.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  selectedCategory === category ? 'bg-green-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {category} ({groupedProducts[category]?.length || 0})
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Products List */}
          <View className="px-4 pb-24">
            {displayProducts.length === 0 ? (
              <EmptyState
                variant="no_results"
                title={t('customer.no_product_found')}
                subtitle={t('customer.try_another_search')}
              />
            ) : (
              displayProducts.map((product) => (
                <View
                  key={product.id}
                  className="bg-gray-50 rounded-xl p-3 mb-2 flex-row items-center"
                >
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base">
                      {product.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-green-600 font-bold text-lg">
                        {formatPrice(product.price)}
                      </Text>
                      <Text className="text-gray-500 text-sm ml-1">
                        / {product.unit}
                      </Text>
                      <View className="ml-2">
                        <StockBadge status={product.stockStatus} size="sm" />
                      </View>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => handleAddToCart(product)}
                    disabled={product.stockStatus === 'out_of_stock'}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      product.stockStatus === 'out_of_stock'
                        ? 'bg-gray-300'
                        : 'bg-green-500'
                    }`}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Order Bar */}
      {showCart && (
        <Pressable
          onPress={handleViewCart}
          className="absolute bottom-0 left-0 right-0 bg-green-500 p-4 flex-row items-center justify-between"
          style={{ elevation: 8, shadowColor: '#000', shadowOpacity: 0.2 }}
        >
          <View className="flex-row items-center">
            <Ionicons name="cart" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              {t('customer.selected_items_total', {
                count: totalItems,
                subtotal: totalPrice,
              })}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-white font-semibold text-base mr-2">
              {t('customer.view_order')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </Pressable>
      )}
    </View>
  );
}
