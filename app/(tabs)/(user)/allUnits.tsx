import { StyleSheet, View, ScrollView, I18nManager, Image, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Text from '@/components/Text';
import { Feather, Ionicons } from '@expo/vector-icons';
import { API_URL, responsive } from '@/globals/globals';
import { router } from 'expo-router';
import { api } from '@/API';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// Create a custom axios instance with interceptor
const axiosInstance = axios.create();

// Configure the interceptor outside of the component
const setupAxiosInterceptors = (token: string | null) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
export default function AllUnits() {
    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {sort} = useRoute().params;
    const { token } = useSelector((state: RootState) => state.auth);

    // Setup axios interceptor when token changes
    useEffect(() => {
        setupAxiosInterceptors(token);
    }, [token]);

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
            },
            pagination: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 16,
                width: '100%',
            },
            paginationButton: {
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: '#EE50FF',
                borderRadius: 8,
                marginHorizontal: 8,
            },
            paginationText: {
                color: '#fff',
                fontSize: 14,
            },
        });

    const styles = getStyles(width, height);

    const returnPageTitle = () => {
        switch (sort) {
            case 'sales':
                return 'كل العروض';
                break;
        
            case 'top_rated':
                return 'الاعلى تقييم';
                break;
        
            case 'best_seller':
                return 'الاكثر رواجًا';
                break;
        
            case 'cities':
                return 'المدن';
                break;
        
            case 'compounds':
                return 'المجمعات السكنية';
                break;
        
            case 'hotels':
                return 'الفنادق';
                break;
        
            default:
                return 'كل الوحدات';
                break;
        }
    }

    const fetchHome = async (page: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/api/user/home/all?page=${page}&filter=${sort}&per_page=10`);
            setUnits(response.data.data.data);
            setTotalPages(response.data.data.last_page);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHome(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderPageItem = (item: any) => {
        switch (sort) {
            case 'sales':
            case 'best_seller':
            case 'top_rated':
                return (
                    <View key={item.id} style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#E8E8E8',
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        shadowColor: '#878787',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 8,
                        maxWidth: "50%"
                    }}>
                        <View style={{
                            width: '100%',
                            position: 'relative'
                        }}>
                            <Image source={{ uri: item.images.length > 0 ? item.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png' }} style={{
                                width: '100%',
                                height: 120,
                                resizeMode: 'cover',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }} />
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    color: '#333333',
                                    fontSize: 10,
                                    backgroundColor: '#EE50FF',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 8,
                                }} bold>
                                    {item.min_price + ' - ' + item.max_price + ' جنيه'}
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 12,
                            }} bold>{item.name}</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={{
                                    fontSize: 10
                                }} bold>{item.rate}</Text>
                            </View>
                        </View>
                        <View style={{
                            padding: 8,
                            paddingTop: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 10,
                            }} >{item.city.name}</Text>
                            <Text style={{
                                fontSize: 10,
                            }} >{item.type == 'unit' ? item.compound.name : item.hotel.name}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingHorizontal: 8,
                            gap: 4,
                        }}>
                            <Feather name='map-pin' size={12} color={'#F9D446s'} />
                            <Text style={{
                                fontSize: 10,
                            }}>{item.type == 'unit' ? item.compound.address : item.hotel.address}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                backgroundColor: '#EE50FF',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                            }} onPress={() => router.push({
                                pathname: '/(tabs)/(user)/unitDetails',
                                params: {
                                    id: item.id
                                }
                            })}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    textAlign: 'center',
                                }} medium>
                                    التفاصيل
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1,
                                backgroundColor: '#EE50FF',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                            }} onPress={() => router.push({
                                pathname: '/(tabs)/(user)/confirmPayment',
                                params: {
                                    id: item.id
                                }
                            })}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    textAlign: 'center',
                                }} medium>
                                    الحجز الآن
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                break;
            
            case 'compounds':
            case 'hotels':
                return (
                    <View key={item.id} style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#E8E8E8',
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        shadowColor: '#878787',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 8,
                        maxWidth: "50%"
                    }}>
                        <View style={{
                            width: '100%',
                            position: 'relative'
                        }}>
                            <Image source={{ uri: item.images.length > 0 ? item.images[0] : 'https://placehold.co/600x400/000000/FFFFFF/png' }} style={{
                                width: '100%',
                                height: 120,
                                resizeMode: 'cover',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }} />
                        </View>
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 12,
                            }} bold>{item.name}</Text>
                            <Text style={{
                                fontSize: 12,
                            }} bold>{item.base_code}</Text>
                        </View>
                        {/* <View style={{
                            padding: 8,
                            paddingTop: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 10,
                            }} >{item.description?.length > 30 ? item.description.slice(0, 30) + '...' : item.description}</Text>
                        </View> */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingHorizontal: 8,
                            gap: 4,
                        }}>
                            <Feather name='map-pin' size={12} color={'#F9D446s'} />
                            <Text style={{
                                fontSize: 10,
                            }}>{item.address}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                backgroundColor: '#EE50FF',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                            }} onPress={() => router.push({
                                pathname: '/(tabs)/(user)/compoundOrHotelDetails',
                                params: {
                                    id: item.id,
                                    type: sort == 'hotels' ? 'hotel' : 'compound'
                                }
                            })}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    textAlign: 'center',
                                }} medium>
                                    عرض {sort == 'compounds' ? 'الوحدات' : 'الغرف'} المتاحة
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                break;
            
            case 'cities':
                return (
                    <View key={item.id} style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#E8E8E8',
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        shadowColor: '#878787',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 8,
                        maxWidth: "50%"
                    }}>
                        <View style={{
                            width: '100%',
                            position: 'relative'
                        }}>
                            <Image source={{ uri: item.images.length > 0 ? item.images[0] : 'https://placehold.co/600x400/000000/FFFFFF/png' }} style={{
                                width: '100%',
                                height: 120,
                                resizeMode: 'cover',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }} />
                        </View>
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 12,
                            }} bold>{item.name}</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                            </View>
                        </View>
                        {/* <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingHorizontal: 8,
                            gap: 4,
                        }}>
                            <Text style={{
                                fontSize: 10,
                            }}>{item.description?.length > 50 ? item.description.slice(0, 50) + '...' : item.description}</Text>
                        </View> */}
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                backgroundColor: '#EE50FF',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                            }} onPress={() => router.push({
                                pathname: '/(tabs)/(user)/cityDetails',
                                params: {
                                    id: item.id
                                }
                            })}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    textAlign: 'center',
                                }} medium>
                                    عرض الوجهة
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                break;
            default:
                return (
                    <View key={item.id} style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#E8E8E8',
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        shadowColor: '#878787',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 8,
                        maxWidth: "50%"
                    }}>
                        <View style={{
                            width: '100%',
                            position: 'relative'
                        }}>
                            <Image source={{ uri: item.images.length > 0 ? item.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png' }} style={{
                                width: '100%',
                                height: 120,
                                resizeMode: 'cover',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }} />
                        </View>
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 12,
                            }} bold>{item.name}</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={{
                                    fontSize: 10
                                }} bold>{item.rate}</Text>
                            </View>
                        </View>
                        <View style={{
                            padding: 8,
                            paddingTop: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={{
                                fontSize: 10,
                            }} >{item.city.name}</Text>
                            <Text style={{
                                fontSize: 10,
                            }} >{item.type == 'unit' ? item.compound.name : item.hotel.name}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingHorizontal: 8,
                            gap: 4,
                        }}>
                            <Feather name='map-pin' size={12} color={'#F9D446s'} />
                            <Text style={{
                                fontSize: 10,
                            }}>{item.type == 'unit' ? item.compound.address : item.hotel.address}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                backgroundColor: '#EE50FF',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                            }} onPress={() => router.push({
                                pathname: '/(tabs)/(user)/unitDetails',
                                params: {
                                    id: item.id
                                }
                            })}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    textAlign: 'center',
                                }} medium>
                                    التفاصيل
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1,
                                backgroundColor: '#EE50FF',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                            }} onPress={() => router.push({
                                pathname: '/(tabs)/(user)/confirmPayment',
                                params: {
                                    id: item.id
                                }
                            })}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    textAlign: 'center',
                                }} medium>
                                    الحجز الآن
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                break;
        }
    }

    if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#EE50FF" /></View>;

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name='arrow-right' color={'#000'} size={28} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} bold>{returnPageTitle()}</Text>
                    <View style={{ width: 32 }}></View>
                </View>
                <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 16, alignItems: 'flex-start', width: '100%' }}>
                    {(units && units.length > 0) ? (
                        units.map((_, i) => (i % 2 === 0 ? units.slice(i, i + 2) : null))
                            .filter(Boolean)
                            .map((pair, index) => (
                                <View key={index} style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    gap: 8,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                }}>
                                    {pair.map((item, idx) => (
                                        renderPageItem(item)
                                    ))}
                                </View>
                            ))
                    ) : (
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 22,
                                paddingVertical: 24,
                                width: '100%',
                            }} bold>لا توجد وحدات</Text>
                        </View>
                    )}
                    {
                        totalPages > 1 && (
                            <View style={styles.pagination}>
                                <TouchableOpacity style={styles.paginationButton} onPress={handlePrevPage} disabled={currentPage === 1}>
                                    <Text style={styles.paginationText}>السابق</Text>
                                </TouchableOpacity>
                                <Text style={[styles.paginationText, {color: '#222'}]}>{currentPage} / {totalPages}</Text>
                                <TouchableOpacity style={styles.paginationButton} onPress={handleNextPage} disabled={currentPage === totalPages}>
                                    <Text style={styles.paginationText}>التالي</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}