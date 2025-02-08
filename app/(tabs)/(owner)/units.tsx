import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, SafeAreaView, useWindowDimensions, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { I18nManager } from 'react-native';
import Text from '@/components/Text';
import { router } from 'expo-router';
import { responsive } from '@/globals/globals';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUnit, fetchUnits } from '@/redux/unitSlice';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

type DayStatus = 'available' | 'unavailable';

interface UnitProps {
  id: string;
  name: string;
  cityName: string;
  compoundName: string;
  imageUrl: string;
  isReserved: boolean;
  isAvailable: boolean;
  days: Record<number, DayStatus>;
}

export default function Units() {
    const dispatch = useDispatch<AppDispatch>()
    const units = useSelector((state: RootState) => state.units.units)
  const mockDays: Record<number, DayStatus> = {
    1: 'available',
    2: 'available',
    3: 'available',
    // ... add more days
    19: 'unavailable',
    20: 'unavailable',
    // ... rest of the days
  };

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
            marginTop: 16,
            paddingBottom: 0
        },
        headerTitle: {
            fontSize: responsive(width, 16, 18, 24),
            color: '#000',
        },
        headerIcon: {
            fontSize: 24,
        },
        subtitle: {
            fontSize: 16,
            color: '#666',
            textAlign: 'right',
            marginTop: 4,
        },
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            paddingBottom: 10,
            gap: 12,
        },
        exportButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 8,
            borderWidth: 1,
            gap: 8,
            borderColor: '#000',
        },
        exportButtonText: {
            marginLeft: 8,
            fontSize: responsive(width, 10, 12, 16),
            color: 'black',
        },
        addButton: {
            flex: 1,
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: '#FDEEFF',
            borderColor: '#EE50FF',
            borderWidth: 1,
            borderRadius: 8,
        },
        addButtonText: {
            marginLeft: 8,
            color: '#EE50FF',
            fontSize: responsive(width, 10, 12, 16),
        },
        scrollView: {
            flex: 1,
        },
        card: {
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 12,
            overflow: 'hidden',
            shadowColor: '#8c8c8c',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .8,
            shadowRadius: 8,
            elevation: 5,
            maxWidth: responsive(width, 350, 360,(width / 2 ) - 32)
        },
        image: {
            width: '100%',
            height: 160,
            borderRadius: 12
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
        },
        unitName: {
            fontSize: 14,
        },
        locationText: {
            fontSize: 12,
            color: '#666',
        },
        statusContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
            marginTop: 8,
        },
        status: {
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
        },
        statusText: {
            marginLeft: 8,
            fontSize: 12,
        },
        calendar: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 4,
            marginBottom: 16,
        },
        day: {
            width: responsive(25, 26, 35),
            height: responsive(25, 26, 35),
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dayText: {
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        buttonPrimary: {
            flex: 1,
            backgroundColor: '#EE50FF',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
        },
        buttonPrimaryText: {
            color: 'white',
            fontSize: 12
        },
        buttonSecondary: {
            flex: 1,
            backgroundColor: '#ea00000d',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            borderColor: '#ea0000',
            borderWidth: 1,
        },
        buttonSecondaryText: {
            color: '#ea0000',
            fontSize: 12,
        },
    });

    const styles = getStyles(width, height)

    function getAvailability(availableDates, reservations) {
        const today = new Date(); // Set to current date
        const daysCount = 30;
        const availability = [];

        // Convert available date range
        const availableFrom = new Date(availableDates[0].from);
        const availableTo = new Date(availableDates[0].to);

        // Convert reservation date ranges (ensure end date is inclusive)
        const reservedRanges = reservations.map(res => ({
            from: new Date(res.date_from),
            to: new Date(new Date(res.date_to).setDate(new Date(res.date_to).getDate() + 1)) // Include end date
        }));

        for (let i = 0; i < daysCount; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let available = 0; // Default: Not available

            // Check if date falls in any reservation range first
            const isReserved = reservedRanges.some(res => currentDate >= res.from && currentDate < res.to);

            // If not reserved and within available range, mark as available
            if (!isReserved && currentDate >= availableFrom && currentDate <= availableTo) {
                available = 1;
            }

            availability.push({ day: currentDate.getDate(), available });
        }

        return availability;
    }

    const handleDeleteUnit = (unitId: number) => {
        Alert.alert(
            "تأكيد الحذف",
            "هل أنت متأكد أنك تريد حذف هذه الوحدة؟",
            [
            { text: "إلغاء", style: "cancel" },
            { text: "حذف", onPress: () => dispatch(deleteUnit(unitId)) }
            ]
        );
    };


    useEffect(() => {
        dispatch(fetchUnits())
    }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name='arrow-right' color={'#000'} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} medium>عرض الوحدات</Text>
          <View style={{width: 32}}></View>
        </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10}}>
        <Text style={{fontSize: 18, color: '#3A3A3A'}} medium>عدد الوحدات</Text>
        <Text style={styles.subtitle} medium> ({units.length})</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/(owner)/addUnit')}>
          <Ionicons name="add" size={20} color="#EE50FF" />
          <Text style={styles.addButtonText}>اضافة وحدة جديدة</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="document-text-outline" size={20} color="black" />
          <Text style={styles.exportButtonText}>تصدير بيانات الوحدات</Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={
        {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: responsive(12, 14, 16),
            padding: responsive(12, 14, 16),
            justifyContent: 'center',
        }
      }>
        {units.map((unit) => (
            <View style={styles.card} key={unit.id}>
                <Image
                    source={unit.images && unit.images[0] ? { uri: unit.images[0].image } : require('@/assets/images/home-img.jpeg')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View>
                    <View style={styles.cardHeader}>
                    <Text style={[styles.unitName, {color: '#000'}]} bold>{unit.name}</Text>
                    <Text style={[styles.unitName, {color: '#000'}]} bold>({unit.unit_number})</Text>
                    </View>
                    <View style={styles.cardHeader}>
                    <Text style={styles.locationText}>{unit.compound_id ? unit.compound?.name : unit.hotel?.name}</Text>
                    <Text style={styles.locationText}>{unit.city?.name}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <View style={styles.status}>
                            <Ionicons
                            name={'calendar-outline'}
                            size={18}
                            color={'#F44336'}
                            />
                            <Text style={styles.statusText}>
                            {unit.isReserved ? 'محجوزة' : 'متوفرة'}
                            </Text>
                        </View>
                        <View style={styles.status}>
                            <Ionicons
                            name={'calendar-outline'}
                            size={18}
                            color={'#4CAF50'}
                            />
                            <Text style={styles.statusText}>
                            {'متوفرة'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.calendar}>
                        {getAvailability(unit.available_dates, unit.reservations).map((day, index) => (
                            <View
                            key={index}
                            style={[
                                styles.day,
                                {
                                backgroundColor: day.available ? '#4CAF50' : '#F44336',
                                },
                            ]}>
                            <Text style={styles.dayText}>{day.day}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={() => {
                        router.push(
                            {
                                pathname: '/(tabs)/(owner)/editUnit',
                                params: {
                                    id: unit.id,
                                },
                            }
                        )
                    }}>
                        <Text style={styles.buttonPrimaryText} bold>تعديل بيانات الوحدة</Text>
                    </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSecondary} onPress={() => handleDeleteUnit(unit.id as number)}>
                        <Text style={styles.buttonSecondaryText} bold>حذف الوحدة</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

