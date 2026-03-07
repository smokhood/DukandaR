/**
 * LocationPicker Component
 * Simple location select/display component
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface LocationPickerProps {
  onPress?: () => void;
  location?: { latitude: number; longitude: number; address?: string };
  placeholder?: string;
  disabled?: boolean;
}

export function LocationPicker({
  onPress,
  location,
  placeholder = 'Select Location',
  disabled = false,
}: LocationPickerProps) {
  const displayText = location?.address || placeholder;
  const isClickable = !disabled && onPress !== undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      className={`border-2 rounded-lg p-4 mb-4 flex-row items-center justify-between ${
        location 
          ? 'bg-green-50 border-green-500' 
          : 'bg-blue-50 border-blue-500'
      } ${!isClickable ? 'opacity-50' : ''}`}
    >
      <View className="flex-1 flex-row items-center">
        <Ionicons 
          name={location ? "location" : "location-outline"} 
          size={24} 
          color={location ? "#22c55e" : "#3b82f6"} 
        />
        <View className="flex-1 ml-3">
          <Text className={`text-base font-medium ${
            location ? 'text-green-700' : 'text-blue-700'
          }`}>
            {displayText}
          </Text>
          {location && (
            <Text className="text-gray-500 text-xs mt-1">
              Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </View>
      {isClickable && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={location ? "#22c55e" : "#3b82f6"} 
        />
      )}
    </TouchableOpacity>
  );
}
