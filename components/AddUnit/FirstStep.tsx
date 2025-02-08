import React, { useEffect, useState } from 'react';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomRadio } from '@/components/CustomRadio';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_URL } from '@/globals/globals';
import { Modal } from 'react-native';
import axios from 'axios';
import 'react-native-get-random-values'; // Add this import at the top
import Toast from 'react-native-toast-message';

// Polyfill for crypto.getRandomValues
if (typeof crypto === 'undefined') {
  const getRandomValues = require('react-native-get-random-values');
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues
    }
  });
}
const GOOGLE_MAPS_APIKEY = 'AIzaSyAkjJFp9iih_AByTiGWZxQ_imBv2Ep-8Ec'; // Replace with your API key

const transportOptions = [
  { label: 'سير علي الاقدام', value: 'walking' },
  { label: 'بالسيارة', value: 'car' },
];

interface Location {
  longitude: number | null;
  latitude: number | null;
  address: string;
}

interface FirstStepInterface {
  styles: any;
  formData: any;
  selectedUnitType: string;
  handleUnitTypeChange: (unitType: string) => void;
  handleChange: (unitType: string, value: any) => void;
  selectedLocation: Location;
  setSelectedLocation: (value: Location) => void;
  selectedCompound: any;
  setSelectedCompound: (value: any) => void;
}

const FirstStep: React.FC<FirstStepInterface> = ({
  formData,
  styles,
  selectedUnitType,
  handleUnitTypeChange,
  handleChange,
  selectedLocation,
  setSelectedLocation,
  selectedCompound,
  setSelectedCompound
}) => {
    const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 30.033333,
    longitude: 31.233334,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

    // Modified Modal section with error handling
  const [mapError, setMapError] = useState<string | null>(null);
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

const handleMapOpen = () => {
  try {
    if (selectedCompound && selectedCompound.coordinates?.length) {
      const newRegion = getBoundingRegion(selectedCompound.coordinates);
      if (newRegion) {
        setRegion(newRegion);
      }
    }
    
    setModalVisible(true);
    setMapError(null);
  } catch (error) {
    setMapError('Failed to open map. Please try again.');
    console.error('Map modal error:', error);
  }
};

  const handleLocationSelect = async (data: any, details: any = null) => {
    try {
      if (details) {
        const newLocation = {
          address: data.description,
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        };
        setSelectedLocation(newLocation);
        setRegion({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      setMapError('Failed to select location. Please try again.');
      console.error('Location selection error:', error);
    }
  };

  // Modified Modal component with error handling
  const renderModal = (selectedCompound) => (
    <Modal visible={modalVisible} animationType="slide">
      <View style={{ flex: 1 }}>
        {mapError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{mapError}</Text>
          </View>
        )}
        

        <MapView
          style={{ flex: 1 }}
          region={region}
          onPress={handleMapPress}
        >
          <Polygon coordinates={selectedCompound.coordinates.map(coord => ({ latitude: coord.lat, longitude: coord.lng }))} fillColor="rgba(0, 255, 13, 0.25)" strokeColor="green" strokeWidth={2} />
          {selectedLocation.latitude && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="الموقع المحدد"
            />
          )}
        </MapView>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.confirmButton}
            style={styles.confirmButton}
            onPress={() => {
              handleChange('address', selectedLocation.address);
              handleChange('latitude', selectedLocation.latitude);
              handleChange('longitude', selectedLocation.longitude);
              setModalVisible(false);
            }}
          >
            <Text style={styles.confirmButtonText}>تأكيد الموقع</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const [locations, setLocations] = useState([]);
  const [locationOriginal, setLocationsOriginal] = useState([]);
  function getCentroid(coordinates) {
      let totalLat = 0;
      let totalLng = 0;
      let count = coordinates.length;

      coordinates.forEach(coord => {
          totalLat += coord.lat;
          totalLng += coord.lng;
      });

      return {
          lat: totalLat / count,
          lng: totalLng / count
      };
  }
function getBoundingRegion(coordinates) {
  if (coordinates.length === 0) return null;

  let minLat = Math.min(...coordinates.map(coord => coord.lat));
  let maxLat = Math.max(...coordinates.map(coord => coord.lat));
  let minLng = Math.min(...coordinates.map(coord => coord.lng));
  let maxLng = Math.max(...coordinates.map(coord => coord.lng));

  return {
    latitude: (maxLat + minLat) / 2, // Center Latitude
    longitude: (maxLng + minLng) / 2, // Center Longitude
    latitudeDelta: Math.max(0.01, (maxLat - minLat) * 1.2), // Adjust delta with padding
    longitudeDelta: Math.max(0.01, (maxLng - minLng) * 1.2) // Adjust delta with padding
  };
}

const handleSelectCompound = (value: string) => {
  let compound = locationOriginal.find(loc => loc.id == value);
  if (!compound || !compound.coordinates?.length) return;

  let region = getBoundingRegion(compound.coordinates);

  setSelectedCompound(compound);   
  if (region) {
    setRegion(region);
  }

  handleChange('location', value);
};
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if(isInsidePolygon(latitude, longitude, selectedCompound.coordinates ))
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setSelectedLocation({ address, latitude, longitude });
          }
        })
        .catch((error) => console.error(error));
    else
    alert('الموقع خارج نطاق المجمع لسكني, اختر نقطة داخل المجمع السكني')

  };

  const [unitTypes, setUnitTypes] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch unit types when selectedUnitType changes
  useEffect(() => {
    handleChange('location', '')
    const fetchUnitTypes = async () => {
      try {
        let url = selectedUnitType === 'unit' 
          ? `${API_URL}/api/owner/dropdown/unit-types` 
          : `${API_URL}/api/owner/dropdown/hotel-types`;
        
        const response = await axios.get(url);
        if (response.data.success) {
          const mappedTypes = response.data.data.map((type) => ({
            label: type.name,
            value: type.id.toString(),
          }));
          setUnitTypes(mappedTypes);
        }
      } catch (error) {
        console.error('Error fetching unit types:', error);
      }
    };

    fetchUnitTypes();
  }, [selectedUnitType]);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/owner/dropdown/cities`);
        if (response.data.success) {
          const mappedCities = response.data.data.map((city) => ({
            label: city.name,
            value: city.id.toString(),
          }));
          setCities(mappedCities);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

useEffect(() => {
  const fetchLocations = async () => {
    try {
      let url = selectedUnitType === 'unit'
        ? `${API_URL}/api/owner/dropdown/compounds`
        : `${API_URL}/api/owner/dropdown/hotels`;

      const response = await axios.get(url);
      if (response.data.success) {
        const mappedLocations = response.data.data.map((location) => ({
          label: location.name,
          value: location.id.toString(),
        }));
        setLocationsOriginal(response.data.data)
        setLocations(mappedLocations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  fetchLocations();
}, [selectedUnitType]);



  return (
    <View style={styles.content}>
      <View style={styles.unitTypeButtons}>
        <TouchableOpacity
          style={[
            styles.unitTypeButton,
            selectedUnitType === 'unit' && styles.activeUnitType,
          ]}
          onPress={() => handleUnitTypeChange('unit')}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={selectedUnitType === 'unit' ? '#fff' : '#EE50FF'}
          />
          <Text
            style={[
              styles.unitTypeButtonText,
              selectedUnitType === 'unit' && { color: '#fff' },
            ]}
          >
            وحدة مصيفية
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.unitTypeButton,
            selectedUnitType === 'hotel' && styles.activeUnitType,
          ]}
          onPress={() => handleUnitTypeChange('hotel')}
        >
          <Ionicons
            name="bed-outline"
            size={20}
            color={selectedUnitType === 'hotel' ? '#fff' : '#666'}
          />
          <Text
            style={[
              styles.unitTypeButtonText,
              selectedUnitType === 'hotel' && { color: '#fff' },
            ]}
          >
            غرف فندقية
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label} medium>
          {selectedUnitType === 'unit' ? 'اسم الوحدة' : 'اسم الغرفة'}
        </Text>
        <TextInput
          style={styles.input}
          value={formData.unitName}
          onChangeText={(value) => handleChange('unitName', value)}
          placeholder={selectedUnitType === 'unit' ? 'ادخل اسم الوحدة' : 'ادخل اسم الغرفة'}
        />
      </View>

      {/* Dynamic CustomSelect for unit types */}
      <CustomSelect
        label={selectedUnitType == 'unit' ? "حدد نوع الوحدة" : 'حدد نوع الغرفه'}
        value={formData.unitType}
        placeholder="اختر نوع"
        options={unitTypes} // Use fetched unit types
        onChange={(value) => handleChange('unitType', value)}
      />

      <View style={styles.row}>
        <View style={{flex: 1}}>
        <CustomSelect
          label="اختر المدينة"
          value={formData.city}
          placeholder="اختر مدينة"
          options={cities}
          onChange={(value) => handleChange('city', value)}
          />
        </View>
        <View style={{flex: 1}}>
          <CustomSelect
            label={selectedUnitType === 'unit' ? 'اختر المجمع السكني' : 'اختر الفندق'}
            value={formData.location}
            placeholder="اختر الموقع"
            options={locations}
            onChange={(value) => selectedUnitType == 'unit' ? handleSelectCompound(value) : handleChange('location', value)}
          />
        </View>
      </View>

      {
        selectedUnitType === 'unit' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label} medium>الموقع علي الخريطة</Text>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => handleMapOpen()}
            >
              <Ionicons name="location-outline" size={24} color="#666" />
              <Text style={styles.mapButtonText}>{selectedLocation.address || formData.address || 'حدد الموقع'}</Text>
            </TouchableOpacity>
          </View>
        )
      }

      {
        selectedUnitType == 'unit' && (
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label} medium>
                رقم الشالية
              </Text>
              <TextInput
                style={styles.input}
                value={formData.unitNumber}
                onChangeText={(value) => handleChange('unitNumber', value)}
                placeholder="25B"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label} medium>
                حدد الطابق
              </Text>
              <TextInput
                style={styles.input}
                value={formData.floor}
                onChangeText={(value) => handleChange('floor', value)}
                placeholder="2"
                keyboardType="numeric"
              />
            </View>
          </View>
        )
      }

      {
        selectedUnitType == 'hotel' && (
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label} medium>
                حدد الطابق
              </Text>
              <TextInput
                style={styles.input}
                value={formData.floor}
                onChangeText={(value) => handleChange('floor', value)}
                placeholder="2"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label} medium>
                رقم الغرفه 
              </Text>
              <TextInput
                style={styles.input}
                value={formData.roomNumber}
                onChangeText={(value) => handleChange('roomNumber', value)}
                placeholder="1"
              />
            </View>
          </View>
        )
      }

      <CustomRadio
        label="هل يوجد اسانسير"
        value={formData.hasElevator}
        options={[
          { label: 'نعم', value: 1 },
          { label: 'لا', value: 0 },
        ]}
        onChange={(value) => handleChange('hasElevator', value)}
      />
      {
        selectedUnitType == 'unit' && (
          <View style={styles.row}>
            <View style={{ width: '100%' }}>
              <Text style={styles.label} medium>
                مساحة الشاليه
              </Text>
              <TextInput
                style={styles.input}
                value={formData.size}
                keyboardType='numeric'
                onChangeText={(value) => handleChange('size', value)}
                placeholder="المساحة بالمتر المربع"
              />
            </View>
          </View>
        )    
      }
      <View style={styles.row}>
        <View style={{ width: '100%' }}>
          <Text style={styles.label} medium>
            {
              selectedUnitType == 'unit'
               ? "المسافه بين الشاطئ و الوحده (بالدقيقة)"
                : "المسافه بين الشاطئ و الغرفة (بالدقيقة)"
            }
          </Text>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={formData.distanceBetweenUnitAndBeach}
            onChangeText={(value) => handleChange('distanceBetweenUnitAndBeach', value)}
            placeholder="المسافة بالدقيقة"
          />
        </View>
      </View>

      <CustomRadio
        label={selectedUnitType == 'unit' ? "اختر طريقة تحديد المسافة بين الشاطئ و الوحدة" : "اختر طريقة تحديد المسافة بين الشاطئ و الغرفة"}
        value={formData.wayBetweenUnitAndBeach}
        options={transportOptions}
        onChange={(value) => handleChange('wayBetweenUnitAndBeach', value)}
      />
      <View style={styles.row}>
        <View style={{ width: '100%' }}>
          <Text style={styles.label} medium>
            {
              selectedUnitType == 'unit'
               ? "المسافه بين حمام السباحة و الوحده (بالدقيقة)"
                : "المسافة بين حمام السباحة و الغرفة (بالدقيقة)"
            }
          </Text>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={formData.distanceBetweenUnitAndPool}
            onChangeText={(value) => handleChange('distanceBetweenUnitAndPool', value)}
            placeholder="المسافة بالدقيقة"
          />
        </View>
      </View>

      <CustomRadio
        label={
          selectedUnitType == 'unit' ? 'اختر طريقة تحديد المسافة بين حمام السباحة و الوحدة' : 'اختر طريقة تحديد المسافة بين حمام السباحة و الغرفة'
        }
        value={formData.wayBetweenUnitAndPool}
        options={transportOptions}
        onChange={(value) => handleChange('wayBetweenUnitAndPool', value)}
      />
      
      {selectedCompound && renderModal(selectedCompound)}
    </View>
  );
};

export default FirstStep;