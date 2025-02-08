import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Text from './Text';
import axios from 'axios';
import { API_URL } from '@/globals/globals';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAkjJFp9iih_AByTiGWZxQ_imBv2Ep-8Ec';

const LocationPicker = ({ selectedCompound, handleChange, modalVisible }) => {
  const [region, setRegion] = useState({
    latitude: 30.033333,
    longitude: 31.233334,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [compoundZone, setCompoundZone] = useState([]);

  useEffect(() => {
    if (selectedCompound && selectedCompound.coordinates) {
      setCompoundZone(selectedCompound.coordinates);
      const center = selectedCompound.coordinates[0];
      setRegion({
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [selectedCompound]);

  const isInsidePolygon = (lat, lng, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].lat, yi = polygon[i].lng;
      let xj = polygon[j].lat, yj = polygon[j].lng;
      let intersect = ((yi > lng) !== (yj > lng)) &&
                      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (isInsidePolygon(latitude, longitude, compoundZone)) {
      setSelectedLocation({ latitude, longitude });
    } else {
      alert('الموقع المختار خارج نطاق المجمع السكني');
    }
  };

  return (
    <View>
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            placeholder="بحث عن موقع"
            onPress={(data, details = null) => {
              if (details) {
                const lat = details.geometry.location.lat;
                const lng = details.geometry.location.lng;
                if (isInsidePolygon(lat, lng, compoundZone)) {
                  setSelectedLocation({ latitude: lat, longitude: lng });
                  setRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 });
                } else {
                  alert('الموقع المختار خارج نطاق المجمع السكني');
                }
              }
            }}
            query={{ key: GOOGLE_MAPS_APIKEY, language: 'ar' }}
            fetchDetails
          />
          <MapView style={{ flex: 1 }} region={region} onPress={handleMapPress}>
            <Polygon coordinates={compoundZone.map(coord => ({ latitude: coord.lat, longitude: coord.lng }))} fillColor="rgba(0, 128, 255, 0.3)" strokeColor="blue" strokeWidth={2} />
            {selectedLocation && <Marker coordinate={selectedLocation} title="الموقع المحدد" />}
          </MapView>
          <TouchableOpacity onPress={() => {
            if (selectedLocation) {
              handleChange('latitude', selectedLocation.latitude);
              handleChange('longitude', selectedLocation.longitude);
              setModalVisible(false);
            }
          }}>
            <Text>تأكيد الموقع</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LocationPicker;
