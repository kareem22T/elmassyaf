import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from './Text';

interface RadioOption {
  label: string;
  value: string | number;
}

interface CustomRadioProps {
  options: RadioOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
}

export const CustomRadio: React.FC<CustomRadioProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label} medium>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioButton,
              value === option.value && styles.radioButtonSelected,
            ]}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.radioCircle}>
              {value === option.value && <View style={styles.selectedRing} />}
            </View>
            <Text
              style={[
                styles.radioLabel,
                value === option.value && styles.radioLabelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    backgroundColor: '#fce7fa',
    borderColor: '#EE50FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EE50FF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  radioLabelSelected: {
    color: '#EE50FF',
    fontWeight: '500',
  },
});