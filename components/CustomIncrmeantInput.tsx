import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "./Text";
import { Feather } from "@expo/vector-icons";

interface CustomIncrementInputProps {
  value: number;
  label: string;
  setValue: (newValue: number) => void;
}

const CustomIncrementInput: React.FC<CustomIncrementInputProps> = ({ value, label, setValue }) => {
  return (
    <View style={styles.container}>
        {
            label && (
                <Text style={styles.label} medium>{label}</Text>
            )
        }
      <View style={styles.inputContainer}>

        <TouchableOpacity 
          style={[styles.button, styles.incrementButton]} 
          onPress={() => setValue(value + 1)}
        >
            <Feather name='plus' size={20} color={'#EE50FF'} />
        </TouchableOpacity>
        <Text style={styles.value} medium>{value}</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => value > 1 && setValue(value - 1)}
        >
            <Feather name='minus' size={20} color={'#000'} />
        </TouchableOpacity>
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

export default CustomIncrementInput;
