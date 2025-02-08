import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import Text from './Text';

type CustomSelectBoxProps<T> = {
  data: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  placeholder: string;
  label: string;
  onSelect: (value: T) => void;
  defaultValue?: T; // Add optional defaultValue prop
};

const CustomSelectBox = <T extends Record<string, any>>({
  data,
  labelKey,
  valueKey,
  placeholder,
  label,
  onSelect,
  defaultValue, // Destructure the defaultValue prop
}: CustomSelectBoxProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set default value on mount or when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue[labelKey] as string);
    }
  }, [defaultValue, labelKey]);

  const filteredData = data.filter((item) =>
    String(item[labelKey]).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: T) => {
    setSelectedValue(item[labelKey] as string);
    setModalVisible(false);
    onSelect(item);
  };

  return (
    <View>
      <Text style={styles.label} medium>{label}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
        placeholderTextColor="#626262"
          style={styles.input}
          value={selectedValue}
          editable={false}
          placeholder={placeholder}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
        placeholderTextColor="#626262"
              style={styles.searchInput}
              placeholder="بحث..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item[labelKey] }</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    textAlign: 'right',
    fontFamily: 'NotoKufiArabic_400Regular',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  searchInput: {
    borderWidth: 1,
    fontFamily: 'NotoKufiArabic_400Regular',
    textAlign: 'right',
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  optionContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CustomSelectBox;
