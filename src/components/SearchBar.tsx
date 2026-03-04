/**
 * SearchBar Component - Professional search input
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'کیا ڈھونڈ رہے ہیں؟',
  autoFocus = false,
  editable = true,
}: SearchBarProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    scale.value = withSpring(1.02, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleBlur = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Animated.View
      style={[animatedStyle]}
      className="bg-white rounded-2xl shadow-sm px-4 py-3 flex-row items-center"
    >
      <Ionicons name="search" size={20} color="#16a34a" />
      
      <TextInput
        className="flex-1 mx-3 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onSubmit(value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        editable={editable}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color="#9ca3af" />
        </Pressable>
      )}
    </Animated.View>
  );
}
