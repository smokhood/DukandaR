/**
 * CustomButton Component
 * Simple wrapper for themed button styling
 */
import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function CustomButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`bg-blue-600 rounded-lg p-4 items-center ${disabled ? 'opacity-50' : ''}`}
      style={style}
    >
      <Text className="text-white font-semibold text-base" style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
