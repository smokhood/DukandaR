import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, type LatLng, type MapPressEvent } from 'react-native-maps';
import { CustomButton } from './CustomButton';

interface LocationMapModalProps {
  visible: boolean;
  initialLocation: LatLng | null;
  selectedLocation: LatLng | null;
  onSelectLocation: (location: LatLng) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const DEFAULT_LOCATION: LatLng = {
  latitude: 31.5204,
  longitude: 74.3587,
};

export function LocationMapModal({
  visible,
  initialLocation,
  selectedLocation,
  onSelectLocation,
  onConfirm,
  onClose,
}: LocationMapModalProps) {
  const [isMapReady, setIsMapReady] = React.useState(false);
  const startLocation = initialLocation || DEFAULT_LOCATION;
  const markerLocation = selectedLocation || startLocation;

  const handleMapPress = (event: MapPressEvent) => {
    onSelectLocation(event.nativeEvent.coordinate);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white">
        <View className="px-4 pt-12 pb-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Select Shop Location</Text>
            <TouchableOpacity onPress={onClose} className="px-3 py-1 rounded-md bg-gray-100">
              <Text className="text-gray-700">Close</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-500 mt-2">
            Move marker or tap on map to set exact shop location.
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView
          style={styles.map}
          initialRegion={{
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => setIsMapReady(true)}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={markerLocation}
            draggable
            onDragEnd={(event) => onSelectLocation(event.nativeEvent.coordinate)}
            title="Shop Location"
            description="Drag to adjust"
          />
          </MapView>

          {!isMapReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text className="text-gray-600 mt-2">Loading map...</Text>
            </View>
          )}
        </View>

        <View className="p-4 border-t border-gray-200 bg-white">
          <Text className="text-xs text-gray-500 mb-3">
            Lat: {markerLocation.latitude.toFixed(6)} | Lng: {markerLocation.longitude.toFixed(6)}
          </Text>
          <CustomButton title="Confirm Location" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    minHeight: 320,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
