import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  I18nManager,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, Feather, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import Text from '@/components/Text';
import { API_URL, responsive } from '@/globals/globals';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { Button } from 'react-native';
import axios from 'axios';
import moment from "moment";
import "moment/locale/ar"; // Import Arabic locale
import { useRoute } from '@react-navigation/native';

// Force RTL layout
I18nManager.forceRTL(true);

const handleMapPress = () => {
    console.log('pressed');
    
}
const HotelDetailsScreen = () => {
    const { id } = useRoute().params;
    const player = useVideoPlayer('https://clicksegypttechnologies.com/storage/01JDD66ZXWYP1MK1NWTSES7X74.mp4', player => {
        player.loop = true;
        player.play();
    });
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const { width, height } = useWindowDimensions()
    const [selectedImage, setSelectedImage] = useState("");

    const [images, setImages] = useState([])

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
        const response = await axios.get(API_URL + "/api/user/home/get/" + id);
        setUnit(response.data); // Assuming the data is directly useful
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, []);

  useEffect(() => {
    if (unit) {
        const storedImages = unit?.images?.map(image => (
            image.image
        ))
        setImages(storedImages);
        setSelectedImage(storedImages[0]);
    }
  }, [unit])

  if (loading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#EE50FF" /></View>
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <Feather name='chevron-right' color={'#000'} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} medium>التفاصيل</Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <Feather name='heart' color={'#000'} size={28} />
          </TouchableOpacity>
        </View>

      <ScrollView style={styles.scrollView}>
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
            <Image
            source={{ uri: selectedImage }}
            style={styles.mainImage}
            resizeMode="cover"
            />
            {
                (images.length > 0) && (
                    <View style={styles.albumContainer}>
                        <ScrollView style={styles.albumSlider} contentContainerStyle={{minWidth: "100%", justifyContent: 'center', alignItems: 'center'}} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {images.map((image, index) => (
                                <TouchableOpacity key={index} onPress={() => setSelectedImage(image)}>
                                    <Image source={{uri: image}} style={[styles.albumImage, selectedImage === image && styles.albumImageActive]} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )
            }
        </View>

        {/* Hotel Info */}
        <View style={styles.hotelInfo}>
            <View style={{
                flexDirection: 'row',
                justifyContent:'space-between',
            }}>
                <Text style={styles.hotelName} bold>{unit?.name}</Text>
                <Text style={styles.price} bold>{unit?.min_price + ' - ' + unit?.max_price} EGP</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent:'flex-start',
                marginBottom: 8,
                gap: 4
            }}>
                <Text>التقييم: ({unit?.rate ? unit?.rate : 0})</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    padding: 4,
                }}>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <MaterialCommunityIcons key={index} name="star" size={18} color={index < (unit?.rate ? unit?.rate : 0) ? '#FFD700' : '#ccc'} />
                    ))}
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
                gap: 4,
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#F3F3F3',
                marginTop: 12
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    padding: 4,
                    gap: 8
                }}>
                    <FontAwesome5 name="door-open" size={16} color="black" />
                    <Text>
                        {unit?.room_count} غرفه
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    padding: 4,
                    gap: 8
                }}>
                    <FontAwesome6 name="bath" size={16} color="black" />
                    <Text>
                        {unit?.toilet_count} حمام
                    </Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12
            }}>
                <Text
                style={{
                    fontSize: 14,
                    color: '#4B4F5C'
                }}
                bold
                >
                    الطابق {unit?.floors_count}
                </Text>
                <Text
                style={{
                    fontSize: 12,
                    color: '#4B4F5C'
                }}
                medium
                >
                    {unit?.elevator ? 'متوفر اسانسير' : 'لا يوجد اسانسير'}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12
            }}>
                <Text
                style={{
                    fontSize: 12,
                    color: '#4B4F5C'
                }}
                medium
                >
                    {unit?.city?.name}
                </Text>
                <Text
                style={{
                    fontSize: 12,
                    color: '#4B4F5C'
                }}
                medium
                >
                    {unit?.type == 'unit' ? unit?.compound?.name : unit?.hotel?.name}
                </Text>
            </View>

            <View style={{
                justifyContent: 'space-between',
                marginBottom: 8,
                gap: 4,
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#F3F3F3',
                marginTop: 16
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        padding: 4,
                        gap: 8
                    }}>
                        <Text style={{fontSize: 10}}>
                            المسافه بين الشاطئ 
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        padding: 4,
                        gap: 8
                    }}>
                        <FontAwesome5 name={unit?.beach_unit_transportation} size={12} color="black" />
                        <Text style={{fontSize: 10}}>
                            {parseInt(unit?.distance_unit_beach) + ' دقيقة ' + (unit?.beach_unit_transportation == 'walking' ? 'سير على الاقدام' : 'بالسيارة')}
                        </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        padding: 4,
                        gap: 8
                    }}>
                        <Text style={{fontSize: 10}}>
                            المسافه بين حمام السباحه  
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        padding: 4,
                        gap: 8
                    }}>
                        <FontAwesome5 name={unit?.pool_unit_transportation} size={12} color="black" />
                        <Text style={{fontSize: 10}}>
                            {parseInt(unit?.distance_unit_pool) + ' دقيقة ' + (unit?.pool_unit_transportation == 'walking' ? 'سير على الاقدام' : 'بالسيارة')}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{
                borderWidth: 1,
                borderColor: '#E4E4E4',
                padding: 12,
                borderRadius: 12,
                marginVertical: 16
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: '#000',
                    }} bold>أقصي عدد للافراد البالغين</Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#000',
                    }} bold>{unit?.max_individuals} فرد</Text>
                </View>
                {
                    unit?.youth_only && (
                        <View style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: '#E8FFF6',
                            paddingHorizontal: 16

                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#29C48B',
                            }} bold>
                            متاح حجز شباب
                            </Text>
                        </View>
                    )
                }
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 12
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: '#000',
                    }} bold>أقل فتره حجز</Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#000',
                    }} bold>{unit?.min_reservation_days} يوم</Text>
                </View>
            </View>

            <View style={{marginBottom: 16, marginTop: 10}}>
                <Text style={{fontSize: 14, color: '#010101', marginBottom: 10}} bold>
                    كماليات الوحده
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: '100%',
                    gap: 10
                }}>
                    {
                        unit?.unit_amenities?.map(item => (
                            <View style={{flex: 1, minWidth: '45%'}} key={item.id}>
                                <Text style={{color: '#6A6A6A'}}>- {item.name}</Text>
                            </View>
                        ))
                    }
                </View>
            </View>
            {
                (unit?.rooms && unit?.rooms?.length) && (
                    unit?.rooms.map((room, index) => (
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#E4E4E4',
                            padding: 12,
                            borderRadius: 12,
                            marginBottom: 16,
                            marginTop: 10
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                    padding: 4,
                                    gap: 8,
                                    marginBottom: 8
                                }}>
                                    <FontAwesome5 name="door-open" size={18} color="#705F1F" />
                                    <Text bold>
                                        {index + 1} غرفه
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                    padding: 4,
                                    gap: 8
                                }}>
                                    <Ionicons name="bed" size={18} color="#00BCBF" />
                                    <Text bold>
                                        {room.bed_count} سرير
                                    </Text>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 12
                            }}>
                                {
                                    (room.bed_sizes && room.bed_sizes.length) && (
                                        room.bed_sizes.map(size => (
                                            <View style={{
                                                padding: 8,
                                                borderRadius: 8,
                                                backgroundColor: '#F6F6F6',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flex: 1
                                            }}>
                                                <Text style={{
                                                    fontSize: 11,
                                                    color: '#6A6A6A',
                                                }} bold>
                                                    عرض السرير 1
                                                </Text>
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: '#6A6A6A',
                                                }}>
                                                    {size} سم
                                                </Text>
                                            </View>
                                        ))
                                    )
                                }
                            </View>
                            <View style={{width: '100%', height: 1, backgroundColor: '#C4C4C4', marginVertical: 16}}></View>

                            <View style={{marginBottom: 16}}>
                            <Text style={{fontSize: 14, color: '#010101', marginBottom: 4}} bold>
                                كماليات الغرفة
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                width: '100%',
                                gap: 4
                            }}>
                                {
                                    (room.amenities && room.amenities.length) && (
                                        room.amenities.map(amenity => (
                                            <View style={{flex: 1, minWidth: '45%'}}>
                                            <Text style={{color: '#6A6A6A'}}>- {amenity.name}</Text>
                                            </View>
                                        ))
                                    )
                                }
                            </View>
                        </View>

                        </View>
                    ))
                )
            }

            {
                (unit?.reception_amenities && unit?.reception_amenities.length) ? (
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#E4E4E4',
                        padding: 12,
                        borderRadius: 12,
                        marginBottom: 16,
                        marginTop: 10
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            gap: 10
                        }}>
                            <MaterialCommunityIcons name="sofa" size={24} color="#BB9F35" />
                            <Text bold>كماليات الريسبشن</Text>
                        </View>
                        <View style={{width: '100%', height: 1, backgroundColor: '#C4C4C4', marginVertical: 16}}></View>
                                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            width: '100%',
                            gap: 4
                        }}>
                            {
                                unit?.reception_amenities?.map(item => (
                                    <View style={{flex: 1, minWidth: '45%'}}>
                                        <Text style={{color: '#6A6A6A'}}>- {item.name}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                ) : (
                    <View></View>
                )
            }

            {
                (unit?.kitchen_amenities && unit?.kitchen_amenities.length) ? (
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#E4E4E4',
                        padding: 12,
                        borderRadius: 12,
                        marginBottom: 16,
                        marginTop: 10
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            gap: 10
                        }}>
                            <FontAwesome6 name="kitchen-set" size={24} color="black" /> 
                            <Text bold>محتويات المطبخ</Text>
                        </View>
                        <View style={{width: '100%', height: 1, backgroundColor: '#C4C4C4', marginVertical: 16}}></View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            width: '100%',
                            gap: 4
                        }}>
                            {
                                unit?.kitchen_amenities?.map(item => (
                                    <View style={{flex: 1, minWidth: '45%'}}>
                                        <Text style={{color: '#6A6A6A'}}>- {item.name}</Text>
                                    </View>
                                ))
                            }
                    </View>
                    </View>
                ) : (
                    <View></View>
                )
            }

            <View style={{
                padding: 12,
                borderRadius: 8,
                shadowColor: '#878787',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
                backgroundColor: '#FFFFFF',
                marginBottom: 24
            }}>
                <Text style={{
                    fontSize: 14
                }} bold>وصف الوحده/ غرفه</Text>
                <Text style={{
                    fontSize: 12,
                    color: '#656565'
                }}>
                    {unit?.description}
                </Text>
            </View>

            {
                (unit?.type == 'unit') && (
                    <View>
                        <Text style={{fontSize: 14}} bold>
                            الموقع علي الخريطة
                        </Text>
                        <View style={styles.locationRow}>
                            <MaterialCommunityIcons name="map-marker" size={16} color="#F9D446" />
                            <Text style={styles.locationText}>{unit?.address}</Text>
                        </View>
                        <View style={{
                            height: 180,
                            width: '100%',
                            borderRadius: 12,
                            overflow: 'hidden',
                        }}>
                            <MapView
                            style={{ flex: 1 }}
                            region={{
                                latitude: parseFloat(unit?.lat),
                                longitude: parseFloat(unit?.lng),
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            onPress={handleMapPress}
                            >
                                <Marker
                                coordinate={{
                                    latitude: parseFloat(unit?.lat),
                                    longitude: parseFloat(unit?.lng),
                                }}
                                title="الموقع المحدد"
                                />
                            </MapView>

                        </View>
                    </View>
                )
            }

            <View style={{
                padding: 10,
                borderRadius: 12,
                shadowColor: '#878787',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
                backgroundColor: '#FFFFFF',
                marginTop: 24,
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12
            }}>
                <Image source={{uri: unit?.owner?.image}} style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                }} />
                <View style={{flex: 1}}>
                    <Text style={{
                        fontSize: 14,
                        color: '#222',
                    }} bold>
                        {unit?.owner?.name}
                    </Text>
                    <Text style={{
                        fontSize: 12,
                        color: '#656565',
                    }}>
                        عدد وحدات المالك ({unit?.owner?.units_count})
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text style={{
                        fontSize: 12,
                        color: '#EE50FF',
                    }}>
                        شاهد الوحدات
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{
                padding: 10,
                backgroundColor: '#F6F6F6',
                borderRadius: 12,
                marginBottom: 16,
                marginTop: 24,
                paddingHorizontal: 16,
                paddingVertical: 12,
            }}>
                <Text style={{fontSize: 13, color: '#000000', marginBottom: 8}} bold>شروط وقواعد الحجز الخاصه بالوحده</Text>
                <Text style={{fontSize: 12, color: '#656565'}}>
                    {unit?.reservation_roles}
                </Text>
            </View>

            {/* <View style={{
                width: '100%'
            }}>
                <VideoView style={{
                    width: "100%",
                    height: 200,
                    overflow: "hidden"
                }} player={player} allowsFullscreen allowsPictureInPicture />
            </View> */}
            {
                (unit?.long_term_reservations && unit?.long_term_reservations.length) && (
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 12,
                        borderColor: '#00BCBF',
                        padding: 12,
                        marginBottom: 16,
                        marginTop: 24,
                        backgroundColor: '#FFFFFF',
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#00BCBF',
                        }} bold>حجز لمدد طويله</Text>
                        {
                            unit?.long_term_reservations.map((item) => (

                                <Text style={{
                                    fontSize: 13,
                                    color: '#3F3F3F',
                                    marginBottom: 8,
                                }}>حجز أكثر من {item.more_than_days} يوم يتم خصم {parseInt(item.sale_percentage)}% من قيمه مقدم الحجز</Text>
                            ))
                        }
                    </View>
                )
            }
            {
                (unit?.weekend_prices && (
                    <View style={{
                        backgroundColor: '#F9D446',
                        padding: 4,
                        paddingBottom: 0,
                        borderRadius: 12,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                        paddingHorizontal: 0,
                        gap: 10
                    }}>
                        <Image source={require('@/assets/images/weekend-icon.png')}  style={{
                            width: 50,
                            height: 50,
                        }} />
                        <View style={{
                            flex: 1,
                            backgroundColor: '#FEFBED',
                            borderRadius: 12,
                            padding: 10,
                            borderBottomRightRadius: 0
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#222',
                            }} bold>فتره حجز خاصه</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent:'flex-start',
                                gap: 8,
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#2F2F2F',
                                }}>
                                    أقل مده حجز 2 يوم سعر الويك اند
                                </Text>
                                <Text style={{
                                    color: '#2F2F2F',
                                }} bold>
                                    EGP {unit?.weekend_price}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))
            }
            {
                (unit?.special_reservation_times && unit?.special_reservation_times.length) && (
                    unit.special_reservation_times.map(item => (
                        <View style={{
                            backgroundColor: '#FEF7FF',
                            borderWidth: 1,
                            borderStyle: 'dashed',
                            borderColor: '#FAC9FF',
                            padding: 16,
                            borderRadius: 12
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 16,
                            }}>
                                <FontAwesome name="qrcode" size={24} color="#EE50FF" />
                                <Text style={{
                                    color: '#000000',
                                    fontSize: 14
                                }} bold>
                                    فتره حجز استثنائيه
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                borderRadius: 12,
                                backgroundColor: "#fff",
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                                <Text style={{color: '#EE50FF', fontSize: 12}} bold>{moment(item.from).locale("ar").format("D MMMM YYYY")}</Text>
                                <Text style={{color: '#EE50FF', fontSize: 12}} bold>-</Text>
                                <Text  style={{color: '#EE50FF', fontSize: 12}} bold>{moment(item.to).locale("ar").format("D MMMM YYYY")}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                justifyContent: 'space-between',
                                marginVertical: 12
                            }}>
                                <Text bold>السعر</Text>
                                <Text bold>{item.price} EGP</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                justifyContent: 'space-between'
                            }}>
                                <Text bold>أقل فتره حجز</Text>
                                <Text bold>{item.min_reservation_period} يوم</Text>
                            </View>
                        </View>
                    ))
                )
            }
        </View>

      </ScrollView>
        {/* Book Button */}
        <View style={{
            flexDirection: 'row',
            gap: 16,
            padding: 16,
            borderTopWidth: 1,
            borderColor: '#ccc',
        }}>
            <Pressable style={styles.bookButton} onPress={() => {
                router.push({
                    pathname: '/(tabs)/(user)/confirmPayment',
                    params: {
                        id: id,
                    },
                })
            }}>
            <Text style={styles.bookButtonText} bold>حجز الان!</Text>
            </Pressable>
            <Pressable style={[styles.bookButton, {
                backgroundColor: '#FDEEFF',
                borderColor: '#EE50FF',
            }]}>
            <Text style={[styles.bookButtonText, {color: '#EE50FF'}]} bold>تحدث مع المالك</Text>
            </Pressable>
        </View>

    </SafeAreaView>
  );
};


export default HotelDetailsScreen;