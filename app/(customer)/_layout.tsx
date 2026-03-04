/**
 * Customer Layout - Placeholder for customer screens
 */
import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}
