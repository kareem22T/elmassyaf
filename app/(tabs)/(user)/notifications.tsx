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


export default function Notifications() {
    const { width, height } = useWindowDimensions()
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
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard, styles.notificationCardActive]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationCard]}>
            <View style={styles.notificationHeader}>
              <Image source={require('@/assets/images/man.jpg')} style={styles.image}/>
              <Text style={styles.notificationTitle} bold>عنوان الاشعار هنا</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: responsive(width, 20, 20, 64)}}>
              <View style={{height: 30, width: 4, backgroundColor: '#EE50FF'}}></View>
              <Text style={styles.notificationDetails}>
                محتوي الاشعار هنا من وصف مكتوب يوضح الرساله بطريقه مختصرة
              </Text>
            </View>
            <Text style={styles.notificationDate}>
              الأربعاء الماضي الساعة 9:42 صباحًا
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
