/**
 * CategoryFilter Component - Horizontal scrollable category chips
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const CATEGORIES = [
  { id: 'kiryana', nameUrdu: 'کریانہ', icon: 'basket' },
  { id: 'pharmacy', nameUrdu: 'دوا خانہ', icon: 'medical' },
  { id: 'sabzi', nameUrdu: 'سبزی', icon: 'leaf' },
  { id: 'bakery', nameUrdu: 'بیکری', icon: 'cafe' },
  { id: 'mobile', nameUrdu: 'موبائل', icon: 'phone-portrait' },
  { id: 'clothing', nameUrdu: 'کپڑے', icon: 'shirt' },
  { id: 'hardware', nameUrdu: 'ہارڈویئر', icon: 'construct' },
  { id: 'beauty', nameUrdu: 'بیوٹی', icon: 'cut' },
  { id: 'restaurant', nameUrdu: 'ریسٹورنٹ', icon: 'restaurant' },
  { id: 'other', nameUrdu: 'دیگر', icon: 'ellipsis-horizontal' },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (id: string) => void;
  showAll?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryFilter({
  selected,
  onSelect,
  showAll = true,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerClassName="px-6 py-2"
    >
      {showAll && (
        <CategoryPill
          id="all"
          label="سب"
          icon="grid"
          selected={selected === 'all'}
          onPress={() => onSelect('all')}
        />
      )}

      {CATEGORIES.map((category) => (
        <CategoryPill
          key={category.id}
          id={category.id}
          label={category.nameUrdu}
          icon={category.icon}
          selected={selected === category.id}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </ScrollView>
  );
}

interface CategoryPillProps {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

function CategoryPill({ label, icon, selected, onPress }: CategoryPillProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`flex-row items-center rounded-full px-4 py-2 mr-2 border-2 ${
        selected
          ? 'bg-primary border-primary'
          : 'bg-white border-gray-300'
      }`}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={selected ? 'white' : '#6b7280'}
      />
      <Text
        className={`ml-2 font-medium ${
          selected ? 'text-white' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
