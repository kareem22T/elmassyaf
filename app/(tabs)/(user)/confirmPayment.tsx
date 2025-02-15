import { api } from "@/API";
import IntervalPickerReservation from "@/components/customeAvilableDatesPicker";
import Text from "@/components/Text";
import { API_URL, responsive } from "@/globals/globals";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { StyleSheet, useWindowDimensions } from "react-native";
import Toast from "react-native-toast-message";

const ConfirmPayment = () => {
    const { id } = useRoute().params;
    
    const { width, height } = useWindowDimensions()
    const getStyles = (width: number, height: number) =>
        StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        scrollView: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            padding: 20,
            paddingBottom: 10
        },
        headerTitle: {
            fontSize: responsive(width, 16, 18, 24),
            color: '#000',
        },
        headerIcon: {
            fontSize: 24,
        },
        mainImage: {
            width: '100%',
            resizeMode: 'cover',
            height: 240,
            borderRadius: 12,
        },
        mainImageContainer: {
            position: 'relative',
            width: '100%',
            padding: 12,
            paddingBottom: 60
        },
        hotelInfo: {
            padding: 16,
            paddingTop: 8,
        },
        hotelName: {
            fontSize: 15,
            marginBottom: 8,
        },
        locationRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        locationText: {
            fontSize: 14,
            color: '#666',
            marginStart: 4,
        },
        price: {
            fontSize: 14,
            color: '#EE50FF',
        },
        previewScroll: {
            paddingHorizontal: 16,
            marginVertical: 16,
        },
        previewImage: {
            width: 120,
            height: 80,
            borderRadius: 8,
            marginEnd: 8,
        },
        amenitiesContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        amenityItem: {
            alignItems: 'center',
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 8,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        ratingText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginEnd: 4,
        },
        amenityText: {
            fontSize: 12,
            color: '#666',
            marginTop: 4,
        },
        section: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        sectionText: {
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
        },
        moreLink: {
            color: '#EE50FF',
            marginTop: 8,
        },
        pricingSection: {
            padding: 16,
        },
        pricingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        pricingLabel: {
            fontSize: 16,
        },
        pricingValue: {
            fontSize: 16,
            color: '#EE50FF',
            fontWeight: 'bold',
        },
        mapContainer: {
            padding: 16,
        },
        map: {
            width: '100%',
            height: 200,
            backgroundColor: '#333',
            borderRadius: 16,
            marginTop: 8,
        },
        bookButton: {
            backgroundColor: '#EE50FF',
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
            flex: 1,
            borderWidth: 1,
            borderColor: '#EE50FF',
        },
        bookButtonText: {
            color: '#fff',
            fontSize: 14,
        },
        bottomNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 12,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
        },
        navItem: {
            alignItems: 'center',
        },
        navText: {
            fontSize: 12,
            color: '#666',
            marginTop: 4,
        },
        headerIconBtn: {
            borderWidth: 1,
            borderColor: "#EDEDED",
            padding: 8,
            borderRadius: 8,
        },
        albumContainer: {
            width: '100%',
            padding: 16,
            position: 'absolute',
            bottom: 0,
            left: 16,
            zIndex: 10,
        },
        albumSlider: {
            width: '100%',
        },
        albumImage: {
            width: 80,
            height: 80,
            borderRadius: 8,
            marginEnd: 8,
        },
        albumImageActive: {
            borderColor: '#EE50FF',
            borderWidth: 1,
        }
        });

    const styles = getStyles(width, height)

    const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await api.get(API_URL + "/api/user/home/get/" + id);
        setUnit(response.data); // Assuming the data is directly useful
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, []);

  const [price, setPrice] = useState()
  const [deposiit, setDiposit] = useState()
  const [start, setStart] = useState<Date | null>()
  const [end, setEnd] = useState<Date | null>()

  const handleGetPrice = async (start, end) => {
    setStart(start)
    setEnd(end)
    try {
        const response = await api.get(API_URL + "/api/user/reservations/price/calculate?unit_id=" + id + "&date_from=" + start + "&date_to=" + end);

        setPrice(response.data.price)
        setDiposit(response.data.book_advance)
        
      } catch (err) {
        setPrice(null)
        Toast.show(
            {
                type: 'error',
                text1: 'حدث خطأ ما!',
                text2: err.response.data.message || 'فشل حساب السعر',
                duration: 5000,
            }
        )
      } finally {
        setLoading(false);
      }

  }

  if (loading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#EE50FF" /></View>

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Feather name='chevron-right' color={'#000'} size={28} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} medium>ميعاد الحجز</Text>
            <View style={{width: 32}}></View>
            </View>
            {
                unit && (
                    <ScrollView style={styles.scrollView} contentContainerStyle={{padding: 16}}>
                        <IntervalPickerReservation
                            unavailable_dates={unit.unavailable_dates.concat(unit.reservations?.map(res => {return{from: res.date_from, to: res.date_to}})) || []}
                            setStart={setStart}
                            setEnd={setEnd}
                            unit={unit}
                            onDatesSelected={(from, to) => handleGetPrice(from, to)}
                        />
                        <View style={{
                            width: '100%',
                            padding: 12,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E8E8E8',
                            backgroundColor: '#fff',
                            shadowColor: '#878787',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 8,
                            marginTop: 16,
                            flexDirection: 'row',
                            gap: 16
                        }}>
                            <Image 
                                source={{ uri: (unit?.images.length > 0 ? unit?.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png') }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    resizeMode: 'cover',
                                    borderRadius: 12,
                                }} />
                                <View style={{
                                    flex: 1,
                                    gap: 8
                                }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                    <Text style={{fontSize: 16}} bold>{unit.name}</Text>
                                    <Text style={{fontSize: 12, color: '#EE50FF'}} bold>{unit.max_price + ' - ' + unit.min_price} EGP</Text>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: 5
                                    }}>
                                        <FontAwesome name="building-o" size={14} color="#EE50FF" />                
                                        <Text style={{color: '#878787', fontSize: 12}}>
                                        {unit.type == 'unit' ? unit.compound?.name : unit.hotel?.name}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: 5
                                    }}>
                                        <Feather name='map-pin' size={14} color={'#EE50FF'} />
                                        <Text style={{color: '#878787', fontSize: 12}}>
                                        {unit.city.name}
                                        </Text>
                                    </View>
                                </View>
                        </View>
                        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 16}} bold>يختلف السعر حسب ميعاد الحجز *</Text>
                    </ScrollView>
                )
            }
        <View style={{
            flexDirection: 'row',
            gap: 16,
            padding: 16,
            borderTopWidth: 1,
            borderColor: '#ccc',
        }}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <Text style={{color: '#878787', fontSize: 12}}>
                    {price ? 'الاجمالي' : 'تقدير السعر'}
                </Text>
                <Text style={{textAlign: 'right', color: '#EE50FF'}} bold>
                    {(price && start && end) ? (price + ' جنيه مصري') : (unit?.min_price + ' - ' + unit?.max_price + ' /ليلة')}
                </Text>
            </View>
            <Pressable style={styles.bookButton} onPress={() => {
                if (price && start && end)
                router.push({
                    pathname: '/(tabs)/(user)/payNow',
                    params: {
                        id: id,
                        price: price,
                        deposiit: deposiit,
                        start: start,
                        end: end,
                    },
                })
                else 
                    Toast.show({
                        type: 'error',
                        text1: 'حدث خطأ ما!',
                        text2: 'اختار فترة الحجز',
                        duration: 5000,
                    })
            }}>
            <Text style={styles.bookButtonText} bold>حجز الان!</Text>
            </Pressable>
        </View>


        </SafeAreaView>
    )
}

export default ConfirmPayment;