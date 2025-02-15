import { StyleSheet, View, ScrollView, I18nManager, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import Text from '@/components/Text';
import { Feather } from '@expo/vector-icons';
import { responsive } from '@/globals/globals';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchNotifications, markAllAsRead } from '@/redux/notificationsSlice';


export default function Notifications() {
    const { width, height } = useWindowDimensions()
    const dispatch = useDispatch<AppDispatch>();
    const { notifications } = useSelector((state : RootState) => state.notifications)

    useEffect(() => {
        dispatch(fetchNotifications())
        dispatch((markAllAsRead()))
    }, [dispatch])
    const getStyles = (width: number, height: number) =>
        StyleSheet.create({
          container: {
              flex: 1,
              backgroundColor: '#FEFEFE',
              direction: 'rtl'
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
          content: {
              flex: 1,
              paddingHorizontal: 16
          },
          notificationCard: {
            width: '100%',
            borderWidth: 1,
            backgroundColor: '#F5F5F5',
            borderColor: '#BFBEBE',
            borderRadius: 16,
            padding: 16,
            marginTop: responsive(width, 10, 12, 16),
            shadowColor: '#8c8c8c',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: .8,
            shadowRadius: 8,
            elevation: 5,
          },
          notificationCardActive: {
            backgroundColor: '#fff',
            borderColor: '#EE50FF',
          },
          image: {
            width: responsive(width, 48, 48, 72),
            height: responsive(width, 48, 48, 72),
            resizeMode: 'cover',
            borderRadius: responsive(width, 48, 56, 72),
          },
          notificationTitle: {
            fontSize: responsive(width, 14, 16, 22),
            color: '#2C2C2C',
            marginBottom: 8,
          },
          notificationHeader: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 14,
            alignItems: 'center',
          },
          notificationDetails: {
            fontSize: responsive(width, 14, 14, 18),
            color: '#2C2C2C',
            lineHeight: responsive(width, 22, 22, 30),
            paddingRight: 10,
            marginTop: 8,
            textAlign: 'right',
          },
          notificationDate: {
            width: '100%',
            marginTop: 10,
            textAlign: 'left',
            fontSize: responsive(width, 10, 12, 16),
            color: '#7F7F7F'
          }
        });

    const styles = getStyles(width, height)
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name='arrow-right' color={'#000'} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} medium>الاشعارات</Text>
          <View style={{width: 32}}></View>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 16, alignItems: 'center', width: '100%'}}>
          {
            (notifications && notifications.length > 0 ) ? notifications.map(notification => (
              <TouchableOpacity key={notification.id} style={[styles.notificationCard, !notification.read && styles.notificationCardActive]}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle} bold>{notification.title}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
                  <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
                  <Text style={styles.notificationDetails}>
                    {notification.body}
                  </Text>
                </View>
                <Text style={styles.notificationDate}>
                      {new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(notification.created_at || notification.updated_at)) + ' - '} 
                      {new Intl.DateTimeFormat('ar-EG', { hour: '2-digit',  minute: '2-digit'}).format(new Date(notification.created_at || notification.updated_at))}
                </Text>
              </TouchableOpacity>
            )) : (
              <View style={{ width: '100%' }}>
                  <Text style={{
                      textAlign: 'center',
                      fontSize: 22,
                      paddingVertical: 24,
                      width: '100%',
                  }} bold>لا توجد اشعارات</Text>
              </View>

            )
          }
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

