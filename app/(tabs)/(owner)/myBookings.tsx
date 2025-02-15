import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Text from '@/components/Text';
import { API_URL, responsive } from '@/globals/globals';
import { router } from 'expo-router';
import { api } from '@/API';
import axios from 'axios';

interface Reservation {
  id: number;
  date_from: string;
  date_to: string;
  adults_count: number;
  children_count: number;
  booking_price: string;
  unit: {
    name: string;
    city_id: number;
    unit_number: string;
    images: Array<{
      image: string;
    }>;
  };
}

interface ReservationsResponse {
  success: boolean;
  data: {
    reservations: Reservation[];
  };
}

export default function MyBookingsScreen() {
  const { width, height } = useWindowDimensions();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get<ReservationsResponse>(`${API_URL}/api/owner/reservations/all`);
      if (data.success) {
        setReservations(data.data.reservations);
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

  const getStyles = (width: number, height: number) =>
    StyleSheet.create({
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
        fontSize: 9,
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
      statTitle: {
        fontSize: responsive(width, 14, 14, 18),
        textAlign: 'center',
        lineHeight: responsive(width, 20, 22, 35),
        color: '#fff'
      },
      statValue: {
        fontSize: responsive(width, 16, 16, 22),
        textAlign: 'center',
        lineHeight: 25,
        color: '#fff'
      },
      requestsButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        margin: 16,
        borderWidth: 1,
        borderColor: '#101010',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8
      },
      row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent:'space-between',
        alignItems: 'center',
      },
      requestsButtonText: {
        textAlign: 'center',
        fontSize: responsive(width, 13, 14, 18),
        width: responsive(width, 100, 100, 130),
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
      unitInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      },
      rating: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        gap: 4,
      },
      dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
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
      rejectButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FF0000',
      },
      acceptButtonText: {
        color: '#fff',
        fontSize: 14,
      },
      rejectButtonText: {
        color: '#FF0000',
        fontSize: 14,
      },
      bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingVertical: 8,
      },
      navItem: {
        alignItems: 'center',
      },
      navText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
      },
      activeNavItem: {
        color: '#EE50FF',
      },
      activeNavText: {
        color: '#EE50FF',
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
    })

  const styles = getStyles(width, height);

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
      <View style={{ padding: 16 }}>
        <ScrollView 
          style={styles.optionWrapper} 
          contentContainerStyle={{ gap: 4, justifyContent: 'center', minWidth: '100%' }} 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.optionBtnActive}>
            <Text style={styles.optionTextActive}>الكل</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>معلقة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>قيد التنفيذ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>محجوزة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>اكتملت</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>تم الغائها</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Booking List */}
      <ScrollView>
        <View style={styles.cardWrapper}>
          {reservations.map((reservation) => (
            <View key={reservation.id} style={[styles.bookingCard, { width: '100%' }]}>
              <View style={styles.bookingDetails}>
                <Image
                  source={{ uri: reservation.unit.images[0]?.image || require('@/assets/images/home-img.jpeg') }}
                  style={styles.propertyImage}
                />
                <View style={styles.bookingInfo}>
                  <View style={styles.row}>
                    <Text style={styles.propertyName} bold>{reservation.unit.name}</Text>
                    <Text style={styles.price} medium>{reservation.booking_price} EGP</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.cityName}>City {reservation.unit.city_id}</Text>
                    <View style={styles.rating}>
                      <Text>{reservation.unit.rate ? reservation.unit.rate.toFixed(1) : 'N/A'}</Text>
                      <FontAwesome name='star' size={16} color="#FFD700" />
                    </View>
                  </View>

                  <View style={styles.guestInfo}>
                    <Text style={styles.capacityText}>{reservation.adults_count} فرد كبار</Text>
                    <Text style={styles.capacityText}>{reservation.children_count || 0} فرد اطفال</Text>
                  </View>

                  <View style={styles.row}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
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
                  onPress={() => { router.push({
                    pathname: '/(tabs)/(owner)/bookingDetails',
                    params: {
                      reservationId: reservation.id,
                    }
                  }) }} 
                  style={[styles.actionButton, styles.acceptButton]}
                >
                  <Text style={styles.acceptButtonText} medium>معرفة المزيد</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}