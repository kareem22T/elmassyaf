import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Text from '@/components/Text';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { responsive } from '@/globals/globals';

interface BookingDetailsProps {
  onConfirm: () => void;
  onCancel: () => void;
  onContactHost: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  onConfirm,
  onCancel,
  onContactHost,
}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
  const { width, height } = useWindowDimensions()
  const getStyles = (width: number, height: number) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
      },
      header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
      },
      headerTitle: {
          fontSize: responsive(width, 16, 18, 24),
          color: '#000',
      },
      headerIcon: {
          fontSize: 24,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      propertyImage: {
        width: '100%',
        height: responsive(width, 180, 190, 240),
        borderRadius: 16,
      },
      detailsContainer: {
        padding: 15,
      },
      priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      price: {
        fontSize: 14,
        color: '#EE50FF',
      },
      propertyName: {
        fontSize: 14,
        color: '#101010',
      },
      infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      infoLabel: {
        color: '#666',
        fontSize: 12
      },
      infoValue: {
        fontWeight: '500',
        fontSize: 12,
      },
      roomDetailsButton: {
        alignSelf: 'flex-start',
        marginVertical: 10,
      },
      roomDetailsText: {
        color: '#EE50FF',
        fontSize: 12,
      },
      distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
      },
      distanceText: {
        color: '#666',
        fontSize: 12,
      },
      distanceLabel: {
        color: '#666',
        fontSize: 12,
      },
      documentsSection: {
        marginTop: 6,
      },
      documentsTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 15,
        color: '#EE50FF',
      },
      documentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 8,
        borderRadius: 12,
        marginBottom: 8,
      },
      documentName: {
        flex: 1,
        textAlign: 'right',
        marginHorizontal: 10,
      },
      viewButton: {
        padding: 5,
      },
      downloadButton: {
        padding: 5,
      },
      buttonsContainer: {
        padding: 10,
        gap: 10,
      },
      button: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
      },
      confirmButton: {
        backgroundColor: '#EE50FF',
      },
      cancelButton: {
        backgroundColor: '#E24A4A',
      },
      contactButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EE50FF',
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
      contactButtonText: {
        color: '#EE50FF',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: '80%',
      },
      modalImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
      },
      modalText: {
        fontSize: 24,
        color: '#EE50FF',
        marginVertical: 10,
        textAlign: 'center',
      },
      modalSubText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
      },
      modalButton: {
        backgroundColor: '#EE50FF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
      },
      modalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
      },
    });

    const styles = getStyles(width, height)

  const handleConfirm = () => {
    setShowConfirmModal(true);
    onConfirm?.();
  };

  const handleCancel = () => {
    setShowCancelModal(true);
    onCancel?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name='arrow-right' color={'#000'} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} medium>المحفظة</Text>
        <View style={{width: 32}}></View>
      </View>
      <ScrollView contentContainerStyle={{
          padding: 16,
      }}>

        <Image
          source={require('@/assets/images/home-img.jpeg')}
          style={styles.propertyImage}
          resizeMode="cover"
        />

        <View style={styles.detailsContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.propertyName} bold>اسم الوحده</Text>
            <Text style={styles.price} bold>$150,7</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>اسم المدينه</Text>
            <Text style={styles.infoValue}>اسم الكومبوند</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>رقم الطابق: 2</Text>
            <Text style={styles.infoLabel}>يتوافر اسنانسير</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>عدد الغرف : 2 غرفه</Text>
            <Text style={styles.roomDetailsText}>تفاصيل الغرف</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.distanceLabel}>المسافه بين الشاطئ و الوحده :</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <FontAwesome5 name='walking' size={14} color="#666" />
              <Text style={styles.distanceText}>100 دقيقه</Text>
            </View>
          </View>

          <View style={styles.documentsSection}>
            <Text style={styles.documentsTitle}>صور الهويات</Text>
            {[1, 2].map((item) => (
              <View key={item} style={styles.documentRow}>
                <TouchableOpacity style={styles.viewButton}>
                  <FontAwesome name="eye" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.documentName}>rlgnlgflg.png</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download-outline" size={20} color="#EE50FF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton]} 
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText} bold>تأكيد الحجز</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={handleCancel}
          >
            <Text style={styles.buttonText} bold>الغاء الحجز</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.contactButton]} 
            onPress={() => {router.push('/(tabs)/(owner)/chat')}}
          >
            <Text style={[styles.buttonText, styles.contactButtonText]} bold>تواصل مع العميل</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('@/assets/images/congrats-icon.png')}
              style={styles.modalImage}
            />
            <Text style={styles.modalText} bold>تم تأكيد الحجز</Text>
            <Text style={styles.modalSubText}>يمكنك تغيير او الغاء الحجز بكل سهولة</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={styles.modalButtonText}>الرجوع</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('@/assets/images/congrats-icon.png')}
              style={styles.modalImage}
            />
            <Text style={styles.modalText}>تم الغاء الحجز</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowCancelModal(false)}
            >
              <Text style={styles.modalButtonText}>العودة للصفحة الرئيسية</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default BookingDetails;