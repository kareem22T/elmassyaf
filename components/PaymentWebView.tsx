import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import Text from '@/components/Text';

interface PaymentWebViewProps {
  visible: boolean;
  url: string;
  onClose: () => void;
}

const PaymentWebView: React.FC<PaymentWebViewProps> = ({ visible, url, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} medium>الدفع</Text>
          <View style={{ width: 24 }} />
        </View>
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
});

export default PaymentWebView;