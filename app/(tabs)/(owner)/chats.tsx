import React from 'react';
import { View, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Text from '@/components/Text';
import { responsive } from '@/globals/globals';
import { router } from 'expo-router';

export default function Chats() {
  const { width, height } = useWindowDimensions()
  
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
      userImage: {
        width: responsive(width, 48, 48, 72),
        height: responsive(width, 48, 48, 72),
        resizeMode: 'cover',
        borderRadius: responsive(width, 48, 56, 72),
      },
      chatItem: {
        paddingVertical: responsive(9, 10, 16),
        paddingHorizontal: 16,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 8,
      }
    })

  const styles = getStyles(width, height)

const notifications = Array(5).fill({
    id: '1',
    timestamp: 'منذ 2 دقيقة',
    title: 'الاسم',
    subtitle: 'ركوب الخيل في 7 فبراير',
    img: '',
    showActions: false,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle} bold>المحادثات</Text>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(owner)/notifications')}}>
        <Image 
          source={require('@/assets/images/bell-notification.png')}
          style={styles.logo}
        />
        </TouchableOpacity>
      </View> 
      <ScrollView style={{flex: 1, width: '100%', marginTop: responsive(width, 0, 0, 16)}}>
        {
            notifications.map((notification, index) => (
                <TouchableOpacity key={index} style={styles.chatItem} onPress={() => router.push('/(tabs)/(owner)/chat')}>
                    <Image source={require('@/assets/images/man.jpg')} style={styles.userImage}/>
                    <View style={{flex: 1}}>
                        <Text style={{color: '#000', fontSize: responsive(width, 15, 16, 20)}} bold>الاسم</Text>
                        <Text style={{color: '#676767', fontSize: responsive(width, 12, 12, 16)}}>ركوب الخيل في 7 فبراير</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'flex-end'}}>
                        <Text style={{fontSize: responsive(width, 12, 12, 16), color: '#797C7B'}}>منذ 2 دقيقة</Text>
                        <Text style={{width: responsive(width, 24, 24, 35), height: responsive(width, 24, 24, 35), backgroundColor: '#EE50FF', fontSize: responsive(width, 12, 12, 18), borderRadius: 24, color: '#fff', textAlign: 'center'}}>3</Text>
                    </View>
                </TouchableOpacity>
            ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

