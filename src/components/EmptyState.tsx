/**
 * EmptyState Component - Reusable empty state UI
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type EmptyStateVariant =
  | 'no_results'
  | 'no_shops'
  | 'offline'
  | 'permission_denied'
  | 'empty_favourites'
  | 'empty_catalog'
  | 'empty_orders';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: string;
    title: string;
    subtitle: string;
  }
> = {
  no_results: {
    icon: 'search',
    title: 'کچھ نہیں ملا',
    subtitle: 'دوسرے الفاظ آزمائیں یا فلٹر تبدیل کریں',
  },
  no_shops: {
    icon: 'storefront',
    title: 'قریب کوئی دکان نہیں',
    subtitle: 'علاقہ بدلیں یا سرچ کا دائرہ بڑھائیں',
  },
  offline: {
    icon: 'cloud-offline',
    title: 'انٹرنیٹ نہیں',
    subtitle: 'پرانا ڈیٹا دکھا رہے ہیں',
  },
  permission_denied: {
    icon: 'location',
    title: 'لوکیشن کی اجازت دیں',
    subtitle: 'قریبی دکانیں ڈھونڈنے کے لیے لوکیشن ضروری ہے',
  },
  empty_favourites: {
    icon: 'heart-outline',
    title: 'کوئی پسندیدہ دکان نہیں',
    subtitle: 'دکانوں کو پسندیدہ کریں تاکہ جلدی سے مل سکیں',
  },
  empty_catalog: {
    icon: 'list',
    title: 'کیٹلاگ خالی ہے',
    subtitle: 'اپنی دکان کے پروڈکٹس شامل کریں',
  },
  empty_orders: {
    icon: 'receipt',
    title: 'ابھی تک کوئی آرڈر نہیں',
    subtitle: 'جب آپ آرڈر کریں گے تو یہاں نظر آئیں گے',
  },
};

export function EmptyState({
  variant,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const config = variantConfig[variant];

  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name={config.icon as any} size={40} color="#9ca3af" />
      </View>

      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        {title || config.title}
      </Text>

      <Text className="text-sm text-gray-600 text-center max-w-xs mb-6">
        {subtitle || config.subtitle}
      </Text>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="border-2 border-primary rounded-xl px-6 py-3"
        >
          <Text className="text-primary font-semibold">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
