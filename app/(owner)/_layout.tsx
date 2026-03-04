/**
 * Owner Layout - Placeholder for owner screens
 */
import { Stack } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
