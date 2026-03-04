// DukandaR Shop Categories

export interface ShopCategory {
  id: string;
  name: string;           // English
  nameUrdu: string;       // اردو
  icon: string;           // Ionicons name
  color: string;          // hex
  bgColor: string;        // light background hex
  templateKey: string;    // links to template file
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: 'kiryana',
    name: 'Grocery Store',
    nameUrdu: 'کریانہ',
    icon: 'cart',
    color: '#16a34a',
    bgColor: '#dcfce7',
    templateKey: 'kiryana',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    nameUrdu: 'دوا خانہ',
    icon: 'medical',
    color: '#dc2626',
    bgColor: '#fee2e2',
    templateKey: 'pharmacy',
  },
  {
    id: 'sabzi',
    name: 'Fruit & Vegetables',
    nameUrdu: 'سبزی فروٹ',
    icon: 'leaf',
    color: '#16a34a',
    bgColor: '#d1fae5',
    templateKey: 'sabzi',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    nameUrdu: 'بیکری',
    icon: 'pizza',
    color: '#d97706',
    bgColor: '#fef3c7',
    templateKey: 'bakery',
  },
  {
    id: 'mobile',
    name: 'Mobile & Electronics',
    nameUrdu: 'موبائل الیکٹرانکس',
    icon: 'phone-portrait',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    templateKey: 'mobile',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    nameUrdu: 'کپڑے',
    icon: 'shirt',
    color: '#ec4899',
    bgColor: '#fce7f3',
    templateKey: 'clothing',
  },
  {
    id: 'hardware',
    name: 'Hardware',
    nameUrdu: 'ہارڈویئر',
    icon: 'hammer',
    color: '#78716c',
    bgColor: '#f5f5f4',
    templateKey: 'hardware',
  },
  {
    id: 'beauty',
    name: 'Beauty & Cosmetics',
    nameUrdu: 'بیوٹی پارلر',
    icon: 'sparkles',
    color: '#a855f7',
    bgColor: '#f3e8ff',
    templateKey: 'beauty',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    nameUrdu: 'ریستوراں',
    icon: 'restaurant',
    color: '#f97316',
    bgColor: '#ffedd5',
    templateKey: 'restaurant',
  },
  {
    id: 'other',
    name: 'Other',
    nameUrdu: 'دیگر',
    icon: 'storefront',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    templateKey: 'other',
  },
];
