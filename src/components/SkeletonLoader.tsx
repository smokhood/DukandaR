/**
 * SkeletonLoader Component - Loading skeletons with shimmer effect
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

/**
 * Base Skeleton component with shimmer animation
 */
interface SkeletonProps {
  width?: number | string;
  height: number;
  borderRadius?: number;
  className?: string;
}

function Skeleton({ width, height, borderRadius = 8, className }: SkeletonProps) {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateXValue = interpolate(
      translateX.value,
      [-1, 1],
      [-300, 300],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: translateXValue }],
    };
  });

  const widthValue = typeof width === 'string' ? width : width;

  return (
    <View
      className={className}
      style={{
        width: widthValue as any,
        height,
        borderRadius,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
      }}
    >
      <Animated.View style={[{ width: '100%', height: '100%' }, animatedStyle]}>
        <LinearGradient
          colors={['#e5e7eb', '#f3f4f6', '#e5e7eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}

/**
 * ShopCard Skeleton
 */
export function ShopCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl shadow-sm mb-3 p-4">
      <View className="flex-row">
        <Skeleton width={80} height={80} borderRadius={12} />
        
        <View className="flex-1 ml-4">
          <Skeleton width="80%" height={16} borderRadius={4} className="mb-2" />
          <Skeleton width={60} height={20} borderRadius={12} className="mb-2" />
          <Skeleton width="100%" height={14} borderRadius={4} />
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Skeleton width={100} height={12} borderRadius={4} />
        <Skeleton width={80} height={32} borderRadius={8} />
      </View>
    </View>
  );
}

/**
 * ProductItem Skeleton
 */
export function ProductItemSkeleton() {
  return (
    <View className="bg-white rounded-xl shadow-sm mb-2 p-3">
      <View className="flex-row items-center">
        <View className="flex-1">
          <Skeleton width="70%" height={16} borderRadius={4} className="mb-2" />
          <Skeleton width="50%" height={12} borderRadius={4} className="mb-1" />
          <Skeleton width="40%" height={12} borderRadius={4} />
        </View>

        <View className="items-end">
          <Skeleton width={60} height={20} borderRadius={4} className="mb-2" />
          <Skeleton width={40} height={24} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

/**
 * Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <View className="p-6">
      {/* Stats Cards */}
      <View className="flex-row justify-between mb-4">
        <Skeleton width="31%" height={100} borderRadius={16} />
        <Skeleton width="31%" height={100} borderRadius={16} />
        <Skeleton width="31%" height={100} borderRadius={16} />
      </View>

      {/* Chart Area */}
      <Skeleton width="100%" height={200} borderRadius={16} className="mb-4" />

      {/* List Items */}
      <Skeleton width="100%" height={80} borderRadius={12} className="mb-3" />
      <Skeleton width="100%" height={80} borderRadius={12} className="mb-3" />
      <Skeleton width="100%" height={80} borderRadius={12} />
    </View>
  );
}
