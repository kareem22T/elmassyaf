import React from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import Text from "./Text";
import { Feather } from "@expo/vector-icons";

interface CustomInputWithUnitProps {
  value: string;
  label: string;
  unit: string;
  setValue: (newValue: string) => void;
}

const CustomInputWithUnit: React.FC<CustomInputWithUnitProps> = ({ value, label, unit, setValue }) => {
  return (
    <View style={styles.container}>
        {
            label && (
                <Text style={styles.label} medium>{label}</Text>
            )
        }
      <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        value={value}
        keyboardType = 'numeric'
        onChangeText={(value) => setValue(value)}
        placeholder="0"
        />
        <Text>
            {unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    width: '100%',
    color: "#222",
    textAlign: 'right',
  },
  input: {
    fontSize: 14,
    width: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderColor: '#ddd',
    minWidth: '100%',
  },
  button: {
    padding: 4,
  },
  incrementButton: {
    backgroundColor: "#EE50FF66",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    marginHorizontal: 15,
    color: '#010101'
  },
});

export default CustomInputWithUnit;
