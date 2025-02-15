import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Text from '@/components/Text';
import { API_URL, responsive } from '@/globals/globals';
import { router } from 'expo-router';
import { api } from '@/API';

interface Reservation {
  id: number;
  date_from: string;
  date_to: string;
  adults_count: number;
  children_count: number;
  booking_price: string;
  owner_profit: string;
  app_profit: string;
  book_advance: string;
  paid: number;
  status: string;
  days_count: number;
  transaction_id: number;
  code: string | null;
  unit: {
    name: string;
    city_id: number;
    unit_number: string;
    rate: number | null;
    images: Array<{
      image: string;
    }>;
  };
}

interface ReservationsResponse {
  success: boolean;
  reservations: Reservation[];
}

export default function MyBookingsScreen() {
  const { width, height } = useWindowDimensions();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { id: 'all', label: 'الكل' },
    { id: 'pending', label: 'معلقه' },
    { id: 'in_progress', label: 'قيد التنفيذ' },
    { id: 'accepted', label: 'محجوزه' },
    { id: 'completed', label: 'اكتملت' },
    { id: 'cancelled', label: 'تم الغائها' },
  ];

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const getPaymentStatus = (paid: number) => {
    return paid === 1 ? 'مدفوع' : 'غير مدفوع';
  };

  const getPaymentStatusColor = (paid: number) => {
    return paid === 1 ? '#4CAF50' : '#F44336';
  };


  const fetchReservations = async () => {
    try {
      const { data } = await api.get<ReservationsResponse>(API_URL + '/api/user/reservations/all');
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Error fetching reservations:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStyles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      direction: 'rtl',
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      marginTop: 24
    },
    headerTitle: {
      fontSize: 20,
      textAlign: 'center',
    },
    logo: {
      width: responsive(width, 44, 44, 50),
      height: responsive(width, 44, 44, 50),
    },
    capacityText: {
      fontSize: 12,
      color: '#4B4F5C',
      marginBottom: 4,
    },
    dateText: {
      fontSize: 11,
      color: '#4B4F5C',
      marginBottom: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      padding: 16,
    },
    statCard: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flex: 1
    },
    cardWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      padding: 16,
      justifyContent: 'center',
      boxSizing: 'content-box',
    },
    row: {
      flexDirection: 'row',
      flex: 1,
      justifyContent:'space-between',
      alignItems: 'center',
    },
    bookingCard: {
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: responsive(width, 500, 500, (width / 2 ) - 32),
      borderRadius: 12,
      padding: 12,
      shadowColor: '#8c8c8c',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: .8,
      shadowRadius: 8,
      elevation: 5,
    },
    bookingDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      flex: 1,
      marginBottom: 16,
    },
    propertyImage: {
      width: 100,
      height: "100%",
      borderRadius: 12,
      marginLeft: 10
    },
    bookingInfo: {
      flex: 1,
    },
    propertyName: {
      fontSize: 13,
      color: '#4B4F5C',
      marginBottom: 4,
      flex: 1,
    },
    cityName: {
      fontSize: 13,
      color: '#4B4F5C',
      flex: 1,
      marginBottom: 4,
    },
    guestInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    rating: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
      gap: 4,
    },
    price: {
      fontSize: 16,
      color: '#EE50FF',
      flex: 1,
      textAlign: 'left',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },
    actionButton: {
      flex: 1,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    acceptButton: {
      backgroundColor: '#EE50FF',
    },
    acceptButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    optionWrapper: {
      direction: 'rtl',
    },
    optionBtnActive: {
      borderWidth: 1,
      borderColor: '#EE50FF',
      backgroundColor: '#EE50FF',
      borderRadius: 8,
      padding: 4,
      paddingHorizontal: 12,
    },
    optionBtn: {
      borderWidth: 1,
      borderColor: '#C9C9C9',
      borderRadius: 8,
      padding: 4,
      paddingHorizontal: 12,
    },
    optionTextActive: {
      color: '#fff'
    },
    optionText: {
      color: '#B3B3B3'
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      width: '100%',
      maxWidth: 500,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    closeButton: {
      padding: 8,
    },
    modalSection: {
      marginBottom: 16,
    },
    modalSectionTitle: {
      fontSize: 16,
      color: '#4B4F5C',
      marginBottom: 8,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    statusText: {
      color: 'white',
      fontSize: 14,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    detailLabel: {
      fontSize: 14,
      color: '#4B4F5C',
    },
    detailValue: {
      fontSize: 14,
      color: '#2C2C2C',
    },
  });
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  const ReservationDetailsModal = ({ visible, reservation, onClose }: {
    visible: boolean;
    reservation: Reservation | null;
    onClose: () => void;
  }) => {
    if (!reservation) return null;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView 
            showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalSectionTitle} bold>تفاصيل الحجز</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="#4B4F5C" />
                </TouchableOpacity>
              </View>

              {/* Reservation Status */}
              <View style={styles.modalSection}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                  <Text style={styles.statusText}>
                    {statusOptions.find(opt => opt.id === reservation.status)?.label || reservation.status}
                  </Text>
                </View>
              </View>

              {/* Basic Info */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>معلومات الحجز</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>رقم الحجز</Text>
                  <Text style={styles.detailValue} bold>{reservation.code || `#${reservation.id}`}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>حالة الدفع</Text>
                  <Text style={[styles.detailValue, { color: getPaymentStatusColor(reservation.paid) }]} bold>
                    {getPaymentStatus(reservation.paid)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>رقم المعاملة</Text>
                  <Text style={styles.detailValue} bold>{reservation.transaction_id}</Text>
                </View>
              </View>

              {/* Financial Details */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>التفاصيل المالية</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>السعر الإجمالي</Text>
                  <Text style={styles.detailValue} bold>${reservation.booking_price}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>العربون</Text>
                  <Text style={styles.detailValue} bold>${reservation.book_advance}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ربح المالك</Text>
                  <Text style={styles.detailValue} bold>${reservation.owner_profit}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>عمولة التطبيق</Text>
                  <Text style={styles.detailValue} bold>${reservation.app_profit}</Text>
                </View>
              </View>

              {/* Guest Details */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>تفاصيل الضيوف</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>عدد البالغين</Text>
                  <Text style={styles.detailValue} bold>{reservation.adults_count}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>عدد الأطفال</Text>
                  <Text style={styles.detailValue} bold>{reservation.children_count}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>مدة الإقامة</Text>
                    <Text style={styles.detailValue} bold>{reservation.days_count} أيام</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    };
  

  const styles = getStyles;

  const filteredReservations = selectedStatus === 'all' 
    ? reservations 
    : reservations.filter(res => res.status === selectedStatus);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle} bold>حجوزاتي</Text>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(owner)/notifications')}}>
          <Image 
            source={require('@/assets/images/bell-notification.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View> 

      {/* Status Filter */}
      <View style={{padding: 16}}>
        <ScrollView 
          style={styles.optionWrapper} 
          contentContainerStyle={{gap: 4, justifyContent: 'center', minWidth: '100%'}} 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          {statusOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.optionBtn,
                selectedStatus === option.id && styles.optionBtnActive
              ]}
              onPress={() => setSelectedStatus(option.id)}
            >
              <Text style={selectedStatus === option.id ? styles.optionTextActive : styles.optionText}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reservations List */}
      <ScrollView>
        <View style={styles.cardWrapper}>
          {filteredReservations.map((reservation) => (
            <View key={reservation.id} style={[styles.bookingCard, {width: '100%'}]}>
              <View style={styles.bookingDetails}>
                <Image
                  source={{ uri: reservation.unit.images[0]?.image }}
                  style={styles.propertyImage}
                  defaultSource={require('@/assets/images/home-img.jpeg')}
                />
                <View style={styles.bookingInfo}>
                  <View style={styles.row}>
                    <Text style={styles.propertyName} bold>{reservation.unit.name}</Text>
                    <Text style={styles.price} medium>EGP {reservation.booking_price}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.cityName}>City {reservation.unit.city_id}</Text>
                    {reservation.unit.rate && (
                      <View style={styles.rating}>
                        <Text>{reservation.unit.rate.toFixed(1)}</Text>
                        <FontAwesome name='star' size={16} color="#FFD700" />
                      </View>
                    )}
                  </View>

                  <View style={styles.guestInfo}>
                    <Text style={styles.capacityText}>{reservation.adults_count} فرد كبار</Text>
                    <Text style={styles.capacityText}>{reservation.children_count} فرد اطفال</Text>
                  </View>

                  <View style={styles.row}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4}}>
                      <Feather name='calendar' size={14} color="#4B4F5C" />
                      <Text style={styles.capacityText}>
                        حجز {reservation.days_count} أيام
                      </Text>
                    </View>
                    <Text style={styles.capacityText}>رقم الوحده: ({reservation.unit.unit_number})</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.dateText}>{formatDate(reservation.date_from)}</Text>
                    <Text style={styles.dateText}>{formatDate(reservation.date_to)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionButtons}>
                    <TouchableOpacity 
                    onPress={() => {
                        setSelectedReservation(reservation);
                        setModalVisible(true);
                    }} 
                    style={[styles.actionButton, styles.acceptButton]}
                    >
                    <Text style={styles.acceptButtonText} medium>معرفة المزيد</Text>
                    </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    <ReservationDetailsModal
        visible={modalVisible}
        reservation={selectedReservation}
        onClose={() => {
          setModalVisible(false);
          setSelectedReservation(null);
        }}
      />

    </SafeAreaView>
  );
}