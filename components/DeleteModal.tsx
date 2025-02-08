import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Text from './Text';
import { Feather } from '@expo/vector-icons';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onDelete,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name='x' size={24} color="#666" />
          </TouchableOpacity>

          <Image
            source={require('@/assets/images/delete-account-avatar.png')}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.title} bold>
            حذف الحساب ؟
          </Text>

          <Text style={styles.description} bold>
            هل تريد حذف حسابك ؟انت سوف تتعرض لخسارة كل بيناتك و احتماليه انك غير قادر علي استرجاعها
          </Text>

          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onDelete}
            >
              <Text style={styles.deleteButtonText}>حذف الحساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.stayButton]}
              onPress={onClose}
            >
              <Text style={styles.stayButtonText}>اريد البقاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  illustration: {
    width: 117,
    height: 117,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  stayButton: {
    backgroundColor: '#FF00FF',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  stayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteAccountModal;