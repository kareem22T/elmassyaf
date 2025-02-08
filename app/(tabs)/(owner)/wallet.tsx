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

// Enable RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function Wallet() {
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
        },
        card: {
            margin: 20,
            borderRadius: 20,
            height: 200,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        cardImage: {
            width: '100%',
            height: responsive(width, ((width - 32) * 0.6), ((width - 32) * 0.6), (((width/2) - 32) * 0.6)),
            resizeMode: 'contain',
        },
        cardWrapper: {
            maxWidth: responsive(width, '100%', '100%', '50%'),
            width: '100%',
        },
        cardContent: {
            padding: 16,
            position: 'relative',
            justifyContent: 'space-between',
        },
        cardLabel: {
            color: 'white',
            fontSize: 20,
            textAlign: 'right',
        },
        cardAmount: {
            color: 'white',
            fontSize: 24,
            textAlign: 'right',
        },
        cardChip: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            width: 40,
            height: 30,
            backgroundColor: '#gold',
            borderRadius: 5,
        },
        cardWave: {
            position: 'absolute',
            bottom: 20,
            left: 70,
        },
        waveIcon: {
            color: 'white',
            fontSize: 24,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            paddingTop: 0,
            gap: 10,
        },
        actionButton: {
            flex: 1,
            padding: 10,
            borderRadius: 12,
            backgroundColor: '#EE50FF',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
            alignItems: 'center',
        },
        actionText: {
            color: 'white',
            fontSize: 14,
        },
        addAccountButton: {
            flex: 1,
            padding: 10,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#EE50FF',
        },
        addAccountText: {
            color: '#EE50FF',
            fontSize: 14,
        },
        transactions: {
            padding: 20,
            paddingTop: 0,
            width: '100%',
        },
        transactionsTitle: {
            fontSize: 16,
            marginBottom: 0,
            textAlign: 'right',
        },
        transaction: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            marginBottom: 10,
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
        },
        transactionAmount: {
            fontSize: 18,
            fontWeight: '600',
            color: '#EE50FF',
        },
        transactionDetails: {
            alignItems: 'flex-start',
        },
        transactionTitle: {
            fontSize: 16,
            color: '#000000'
        },
        transactionDate: {
            fontSize: 14,
            color: '#888888',
        },
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
          <Text style={styles.headerTitle} medium>المحفظة</Text>
          <View style={{width: 32}}></View>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={{alignItems: 'center', width: '100%'}}>
            <View style={styles.cardWrapper}>                
                <View style={styles.cardContent}>
                    <Image source={require('@/assets/images/wallet-card.png')} style={styles.cardImage} />
                    <View style={{position: 'absolute', top: 32, left: 0, paddingHorizontal: 32, width: '100%'}}>
                        <Text style={styles.cardLabel}>اجمالي المبلغ المعلق</Text>
                        <Text style={styles.cardAmount} bold>$100,120.99</Text>
                    </View>
                </View>
                <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                >
                    <Image source={require('@/assets/images/money-send.png')} style={{width: 22, height: 22}} />
                    <Text style={styles.actionText} bold>طلب تحويل</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addAccountButton}>
                    <Image source={require('@/assets/images/add-square.png')} style={{width: 22, height: 22}} />
                    <Text style={styles.addAccountText} bold>أضافة حساب</Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.transactions}>
                <Text style={styles.transactionsTitle} bold>اخر المعاملات</Text>
                {[1, 2, 3, 4].map((_, index) => (
                <View key={index} style={styles.transaction}>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionTitle} medium>طلب سحب</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                            <Feather name='calendar' size={18} color={'#888888'} />
                            <Text style={styles.transactionDate}>
                                {new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                            </Text>
                        </View>
                    </View>
                    <View>
                    <Text style={styles.transactionAmount} medium>$100</Text>
                    </View>
                </View>
                ))}
            </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
