import React from 'react';
import { View, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Text from '@/components/Text';
import { responsive } from '@/globals/globals';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions()
  const units = useSelector((state: RootState) => state.units.units)
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
      statTitle: {
        fontSize: responsive(width, 14, 14, 18),
        textAlign: 'center',
        lineHeight: responsive(width, 20, 22, 35),
        color: '#fff'
      },
      statValue: {
        fontSize: responsive(width, 14, 16, 22),
        textAlign: 'center',
        lineHeight: responsive(width, 20, 35, 35),
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
    })

  const styles = getStyles(width, height)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle} bold>الرئيسية</Text>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(owner)/notifications')}}>
        <Image 
          source={require('@/assets/images/bell-notification.png')}
          style={styles.logo}
        />
        </TouchableOpacity>
      </View> 

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Image source={require('@/assets/images/new-requests.png')}  style={{height: responsive(width, 130, 140, 180), width: responsive(width, 130, 140, 180), resizeMode: 'contain'}}/>
          <View style={{position: 'absolute', bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 8}}>
          <Text style={styles.statTitle}>طلبات جديده</Text>
          <Text style={styles.statValue} bold>23</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(owner)/units')}} style={styles.statCard}>
          <Image source={require('@/assets/images/units-no.png')}  style={{height: responsive(width, 130, 140, 180), width: responsive(width, 130, 140, 180), resizeMode: 'contain'}}/>
          <View style={{position: 'absolute', bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 8}}>
          <Text style={[styles.statTitle, {color: '#3A3A3A'}]}>عدد الوحدات</Text>
          <Text style={[styles.statValue, {color: '#3A3A3A'}]} bold>
            {units.length}
          </Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(owner)/statistics')}} style={styles.statCard}>
          <Image source={require('@/assets/images/finantials.png')}  style={{height: responsive(width, 130, 140, 180), width: responsive(width, 130, 140, 180), resizeMode: 'contain'}}/>
          <View style={{position: 'absolute', bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 8}}>
          <Text style={[styles.statTitle, {color: '#3A3A3A'}]}>اجمالي الربح</Text>
          <Text style={[styles.statValue, {color: '#3A3A3A', fontSize: 12}]} bold>12,670.90 EGP</Text>
          </View>
        </TouchableOpacity>
      </View>


      {/* Booking List */}
      <ScrollView>
      {/* New Requests Button */}
      <TouchableOpacity style={styles.requestsButton}>
        <Image source={require('@/assets/images/menu-board.png')} style={{ width: responsive(width, 23, 24, 30), height: responsive(width, 23, 24, 30)  , resizeMode: 'contain'}}/>
        <Text style={styles.requestsButtonText} medium>الطلبات جديده</Text>
      </TouchableOpacity>
      <View style={styles.cardWrapper}>
        {[1, 2].map((item) => (
          <View key={item} style={[styles.bookingCard, {width: '100%'}]}>
            <View style={styles.bookingDetails}>
              <Image
                source={require('@/assets/images/home-img.jpeg')}
                style={styles.propertyImage}
              />
              <View style={styles.bookingInfo}>
                <View style={styles.row}>
                <Text style={styles.propertyName} bold>اسم الكومبوند</Text>
                <Text style={styles.price} medium>$150,7</Text>
                </View>

                <View style={styles.row}>
                <Text style={styles.cityName}>اسم المدينه</Text>
                <View style={styles.rating}>
                  <Text>5.0</Text>
                  <FontAwesome name='star' size={16} color="#FFD700" fill="#FFD700" />
                </View>
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.capacityText}>2 فرد كبار</Text>
                  <Text style={styles.capacityText}>3 فرد اطفال</Text>
                </View>
                <View style={styles.row}>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4}}>
                    <Feather name='calendar' size={14} color="#4B4F5C" />
                    <Text style={styles.capacityText}>
                      حجز 3 أيام
                    </Text>
                  </View>
                  <Text style={styles.capacityText}>رقم الوحده: (45B)</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.dateText}>السبت 6 أبريل 2024</Text>
                  <Text style={styles.dateText}>الاحد 6 أبريل 2024</Text>
                </View>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
                <Text style={styles.acceptButtonText} medium>قبول</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                <Text style={styles.rejectButtonText} medium>رفض</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

