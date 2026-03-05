/**
 * LocationPicker Component
 * Simple location select/display component
 */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface LocationPickerProps {
  onPress?: () => void;
  location?: { latitude: number; longitude: number; address?: string };
  placeholder?: string;
}

export function LocationPicker({
  onPress,
  location,
  placeholder = 'Select Location',
}: LocationPickerProps) {
  const displayText = location?.address || placeholder;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
    >
      <Text className="text-gray-700">
        {displayText}
      </Text>
      {location && (
        <Text className="text-gray-500 text-xs mt-1">
          Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
        </Text>
      )}
    </TouchableOpacity>
  );
}
