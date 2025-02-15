import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Modal,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from '@/components/Text';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { responsive } from '@/globals/globals';
import { API_URL } from '@/globals/globals';
import { useRoute } from '@react-navigation/native';
import { api } from '@/API';

const BookingDetails: React.FC = () => {
  const { reservationId } = useRoute().params;
  const [reservation, setReservation] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { width, height } = useWindowDimensions();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
        fontSize: 12,
      },
      infoValue: {
        fontWeight: '500',
        fontSize: 12,
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

  const styles = getStyles(width, height);

  const fetchReservationDetails = async () => {
    try {
      const response = await api.get(`${API_URL}/api/owner/reservations/${reservationId}`);
      if (response.data.success) {
        setReservation(response.data.reservation);
      }
    } catch (error) {
      console.error('Error fetching reservation details:', error);
    }
  };

  useEffect(() => {
    fetchReservationDetails();
  }, [reservationId]);

  const handleAccept = async () => {
    try {
      const response = await api.put(`${API_URL}/api/owner/reservations/${reservationId}/accept`);
      if (response.data.success) {
        Alert.alert('تم القبول', 'تم قبول الحجز بنجاح');
        fetchReservationDetails(); // Refresh reservation details
      }
    } catch (error) {
      console.error('Error accepting reservation:', error);
      Alert.alert('خطأ', 'فشل في قبول الحجز');
    }
  };

  const handleApprove = async () => {
    try {
      const response = await api.put(`${API_URL}/api/owner/reservations/${reservationId}/approve`);
      if (response.data.success) {
        Alert.alert('تم التأكيد', 'تم تأكيد الحجز بنجاح');
        fetchReservationDetails(); // Refresh reservation details
      }
    } catch (error) {
      console.error('Error approving reservation:', error);
      Alert.alert('خطأ', 'فشل في تأكيد الحجز');
    }
  };

  const handleCancel = async () => {
    try {
      const response = await api.put(`${API_URL}/api/owner/reservations/${reservationId}/cancel`);
      if (response.data.success) {
        Alert.alert('تم الإلغاء', 'تم إلغاء الحجز بنجاح');
        fetchReservationDetails(); // Refresh reservation details
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
      Alert.alert('خطأ', 'فشل في إلغاء الحجز');
    }
  };

  if (!reservation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name='arrow-right' color={'#000'} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} medium>تفاصيل الحجز</Text>
        <View style={{ width: 32 }}></View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image
          source={{ uri: reservation.unit.images[0]?.image || require('@/assets/images/home-img.jpeg') }}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.propertyName} bold>{reservation.unit.name}</Text>
            <Text style={styles.price} bold>{reservation.booking_price} EGP</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>اسم المدينه</Text>
            <Text style={styles.infoValue}>اسم الكومبوند</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>عدد البالغين: {reservation.adults_count}</Text>
            <Text style={styles.infoLabel}>عدد الأطفال: {reservation.children_count || 0}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { fontSize: 9 }]}>تاريخ الحجز: {formatDate(reservation.date_from)}</Text>
            <Text style={[styles.infoLabel, { fontSize: 9 }]}>تاريخ الانتهاء: {formatDate(reservation.date_to)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>حالة الدفع: {reservation.paid ? 'مدفوع' : 'غير مدفوع'}</Text>
            <Text style={styles.infoLabel}>حالة الحجز: {reservation.status}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          {reservation.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleAccept}
              >
                <Text style={styles.buttonText} bold>قبول الحجز</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText} bold>الغاء الحجز</Text>
              </TouchableOpacity>
            </>
          )}
          {reservation.status === 'accepted' && (
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleApprove}
            >
              <Text style={styles.buttonText} bold>اتمام الحجز</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.contactButton]}
            onPress={() => {
              router.push({
                pathname: '/(tabs)/(owner)/chat',
                params: {
                  id: 0,
                  name: reservation.user.name,
                  image: reservation.user.image,
                  user_id: reservation.user.id,
                },
              });
            }}
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