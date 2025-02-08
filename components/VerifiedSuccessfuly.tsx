import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Text from './Text';

interface VerificationModalProps {
  onPress: () => void; // Define the type for the onPress prop
  text: string; // Define the type for the onPress prop
}

export default function VerificationModal({ onPress, text }: VerificationModalProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.checkmark}>✔</Text>
          </View>

          {/* Title */}
          <Text style={styles.title} bold>
            تم التحقق من الرمز بنجاح!
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            أنت الآن جاهز لاستكمال التسجيل
          </Text>

          {/* Button to Close the Modal */}
          <TouchableOpacity
            onPress={() => {
              setIsVisible(false); // Close the modal
              onPress(); // Trigger the custom action
            }}
            style={styles.confirmButton}
          >
            <Text style={styles.buttonText} bold>
              {text}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    paddingVertical: 64,
  },
  iconContainer: {
    backgroundColor: '#FF543D',
    width: 80,
    height: 80,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#FF543D',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '90%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
