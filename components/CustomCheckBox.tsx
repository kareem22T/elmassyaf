import { useState } from "react";
import { View, TouchableOpacity, TextInput, StyleSheet, Pressable, I18nManager, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import Text from "./Text";
import axios from "axios";
import { api } from "@/API";
import { API_URL } from "@/globals/globals";

I18nManager.forceRTL(true);

interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
}

interface CustomCheckBoxInterface {
  setItems: any;
  items: CheckboxItem[];
  label: string;
  add_btn_text: string;
  add_placeholder: string;
  type: string; // 'unit' or 'room'
}

const CustomCheckBox: React.FC<CustomCheckBoxInterface> = ({
  setItems,
  items,
  label,
  add_btn_text,
  add_placeholder,
  type,
}) => {
  const [newItemText, setNewItemText] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCheckbox = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const addNewItem = async () => {
    if (!newItemText.trim()) return;

    setLoading(true);

    try {
      const response = await api.post(API_URL + "/api/owner/units/amenitie", {
        name: newItemText,
        type: type, // Change this if needed
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setItems([
          ...items,
          {
            id: response.data.data.id.toString(),
            text: response.data.data.name,
            checked: false,
          },
        ]);
        setNewItemText("");
        setIsAddingNew(false);
      } else {
        console.error("Error adding item:", response.data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} medium>{label}</Text>

      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemRow} onPress={() => toggleCheckbox(item.id)}>
            <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
              {item.checked && <Feather name="check" size={16} color="white" />}
            </View>
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isAddingNew ? (
        <View style={styles.addNewContainer}>
          <Pressable style={[styles.addButton, { backgroundColor: "#FF5050", paddingHorizontal: 8 }]} onPress={() => setIsAddingNew(false)}>
            <Feather name="x-circle" size={20} color="#fff" />
          </Pressable>
          <TextInput
            value={newItemText}
            onChangeText={setNewItemText}
            placeholder={add_placeholder}
            placeholderTextColor="#666"
            style={styles.input}
          />
          <Pressable style={styles.addButton} onPress={addNewItem} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#111827" /> : <Text style={styles.addButtonText}>إضافة</Text>}
          </Pressable>
        </View>
      ) : (
        <TouchableOpacity style={styles.addNewButton} onPress={() => setIsAddingNew(true)}>
          <Feather name="plus" size={20} color="#EE50FF" />
          <Text style={styles.addNewText}>{add_btn_text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    marginBottom: 12,
    color: "#222",
    textAlign: "right",
  },
  itemsContainer: {
    gap: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 150,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#A8A8A8",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#EE50FF",
    borderColor: "#EE50FF",
  },
  itemText: {
    fontSize: 14,
  },
  addNewContainer: {
    marginTop: 16,
    flexDirection: "row-reverse",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EE50FF",
    borderRadius: 6,
    padding: 8,
    textAlign: "right",
  },
  addButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#111827",
  },
  addNewButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  addNewText: {
    color: "#EE50FF",
    fontSize: 14,
  },
});

export default CustomCheckBox;
