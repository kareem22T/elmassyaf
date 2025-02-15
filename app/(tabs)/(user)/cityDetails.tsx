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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { api } from '@/API';
import WebView from 'react-native-webview';
const htmlContent = (element) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&display=swap" rel="stylesheet">
        <style>
        *{
          font-family: "Noto Kufi Arabic", serif;
        }
        p{
            font-size: 12px !important;
        }
        ul {
                font-size: 12px !important;
        }
        </style>
    </head>
    <body>
    ${element}
      <script>
        function sendHeight() {
          let height = document.documentElement.scrollHeight;
          window.ReactNativeWebView.postMessage(height);
        }
        window.onload = sendHeight;
        window.addEventListener('resize', sendHeight);
      </script>
    </body>
    </html>
  `
}

// Force RTL layout
I18nManager.forceRTL(true);

const PropertyCard = ({
  id,
  image,
  location,
  type,
  price,
  rating,
  beds,
  baths,
  specialOffer,
  styles,
  in_wishlist,
  city,
  discountDate,
  minDays,
  ownerId,
  userId,
  toggleWishlist,
}: {
  id: string;
  image: string;
  location: string;
  type: string;
  price: string;
  rating: string;
  beds: number;
  baths: number;
  specialOffer?: boolean;
  styles: any;
  in_wishlist: boolean;
  city: string;
  discountDate: string;
  minDays: number;
  ownerId: string;
  userId: string | any;
  toggleWishlist: () => void;
}) => (
    <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: image }} style={styles.propertyImage} />
      {specialOffer && (
        <View style={[styles.tag, styles.specialOfferTag]}>
          <Text style={styles.tagText}>Special Offer!</Text>
        </View>
      )}
      <View style={styles.priceTag}>
        <Text style={styles.priceText} bold>{price} جنيه</Text>
      </View>
      <TouchableOpacity onPress={() => toggleWishlist(id)} style={{
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#fff',
        borderRadius: 30,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FF0000',
      }}>
        <FontAwesome name={in_wishlist ? 'heart' : 'heart-o'} size={20} color="#FF0000" />
      </TouchableOpacity>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.locationContainer}>
        <Text style={styles.location} bold>{location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={22} color="#FFD700" />
          <Text style={styles.rating} bold>{rating}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}>
        <Text style={styles.type} bold>{type}</Text>
        <Text style={styles.type} bold>{city}</Text>
      </View>
        {
            discountDate && (              
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={require('@/assets/images/discount-icon.png')} style={{ width: 22, height: 22}} />
                        <Text style={[styles.type, {color: '#000'}]}>
                            فتره العرض
                        </Text>
                    </View>
                    <Text style={{
                        color: '#29C48B',
                        fontSize: 11
                    }} bold>
                        {discountDate}
                    </Text>
                </View>
            )
        }
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
      }}>
        <Text style={{
            fontSize: 12,
            color: '#000',
        }}>أقل مده حجز</Text>
        <Text style={{
            fontSize: 12,
            color: '#EE50FF',
        }} bold>{minDays} أيام</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        marginTop: 16,
      }}>
        {
            (ownerId != userId) && (
                <TouchableOpacity style={{
                    backgroundColor: '#EE50FF',
                    padding: 8,
                    borderRadius: 12,
                    alignItems: 'center',
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#EE50FF',
                }} onPress={() => router.push({
                    pathname: '/(tabs)/(user)/confirmPayment',
                    params: {
                        id: id
                    }
                })}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 13,
                    }}>احجز الان!</Text>
                </TouchableOpacity>
            )
        }
        <TouchableOpacity style={{
            padding: 8,
            borderRadius: 12,
            alignItems: 'center',
            flex: 1,
            borderWidth: 1,
            backgroundColor: '#FDEEFF',
            borderColor: '#EE50FF',
        }} onPress={() => router.push({
            pathname: '/(tabs)/(user)/unitDetails',
            params: {
                id: id
            }
        })}>
            <Text style={{
                fontSize: 13,
                color: '#EE50FF'
            }}>عرض التفاصيل</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const HotelDetailsScreen = () => {
    const { id } = useRoute().params;
    const player = useVideoPlayer('https://clicksegypttechnologies.com/storage/01JDD66ZXWYP1MK1NWTSES7X74.mp4', player => {
        player.loop = true;
        player.play();
    });
    const currentUdserId = useSelector((state: RootState) => state.auth.user?.id)
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
            fontSize: 20,
            width: '100%',
            textAlign: "center",
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
        },
        ratingText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginEnd: 4,
        },
                card: {
            width: width * .76,
            minWidth: 280,
            marginHorizontal: 8,
            borderRadius: 16,
            backgroundColor: '#fff',
            shadowColor: '#878787',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 8,
            marginBottom: 12
        },
        imageContainer: {
            position: 'relative',
            direction: 'ltr'
        },
        propertyImage: {
            width: '100%',
            height: 130,
            borderRadius: 12
        },
        tag: {
            position: 'absolute',
            top: 12,
            right: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        featuredTag: {
            backgroundColor: '#FFD700',
        },
        specialOfferTag: {
            backgroundColor: '#FF0000',
        },
        tagText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
        },
        priceTag: {
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: '#fff',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        priceText: {
            color: '#EE50FF',
            fontSize: 12,
        },
        cardContent: {
            padding: 12,
        },
        locationContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        location: {
            fontSize: 14,
        },
        type: {
            fontSize: 14,
            color: '#878787',
            marginBottom: 4,
        },
        rating: {
            marginRight: 4,
            fontSize: 14,
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
            fontSize: 16,
            marginHorizontal: 16,
            marginTop: 20,
            marginBottom: 12,
            textAlign: 'right',
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

      const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webViewHeight, setWebViewHeight] = useState(100); // Default height
  const [webViewHeight2, setWebViewHeight2] = useState(100); // Default height

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await api.get(API_URL + "/api/user/home/city/" + id);
        setCity(response.data.city); // Assuming the data is directly useful
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, []);

const dispatch = useDispatch<AppDispatch>()
const wishlist = useSelector((state: RootState) => state.wishlist.items)
const [innerLoader, setInnerLoader] = useState(true)

  useEffect(() => {
    if (city) {
        setImages(city?.images);
        setSelectedImage(city?.images[0]);
    }
    setTimeout(() => {
        setInnerLoader(false)
    }, 1000);
    }, [wishlist, city])

  if (loading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#EE50FF" /></View>
  return (
    <SafeAreaView style={styles.container}>
        {
            innerLoader && (
                <View style={{flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', zIndex: 22, position: 'absolute', top: 0, left: 0, width: width, height: height}}><ActivityIndicator size="large" color="#EE50FF" /></View>
            )
        }
      <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <Feather name='chevron-right' color={'#000'} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} medium>تفاصيل المدينة</Text>
          <TouchableOpacity style={[styles.headerIconBtn, {borderColor: '#fff'}]} onPress={() => router.back()}>
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
                <Text style={styles.hotelName} bold>{city?.name}</Text>
            </View>

            {
                city?.description && (
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
                        }} bold>وصف المدينه</Text>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: htmlContent(city?.description) }}
                            javaScriptEnabled
                            domStorageEnabled
                            injectedJavaScript={`
                                window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);
                            `}
                            onMessage={(event) => {
                            const height = Number(event.nativeEvent.data);
                            if (!isNaN(height) && height > 0) {
                                if (webViewHeight == 100)
                                setWebViewHeight(height);
                            }
                            }}
                            style={{ width: "100%", height: webViewHeight }}
                        />
                    </View>
                )
            }

            {
                city?.features && (
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
                        }} bold>مميزا المدينه</Text>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: htmlContent(city?.features) }}
                            javaScriptEnabled
                            domStorageEnabled
                            injectedJavaScript={`
                                window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);
                            `}
                            onMessage={(event) => {
                            const height = Number(event.nativeEvent.data);
                            if (!isNaN(height) && height > 0) {
                                if (webViewHeight2 == 100)
                                setWebViewHeight2(height);
                            }
                            }}
                            style={{ width: "100%", height: webViewHeight2 }}
                        />
                    </View>
                )
            }

        </View>

        {
            (city && city.compounds && city.compounds.length ) && (
                <View style={{ paddingHorizontal: 16}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 14,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={[styles.sectionTitle, {fontSize: 18, marginBottom: 0, marginHorizontal: 0}]} bold>
                                الكمبوندات
                                 ({city.compounds.length})
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push({
                            pathname: '/(tabs)/(user)/allUnits',
                            params: {
                                sort: 'compounds'
                            }
                        })}>
                            <Text style={{
                                fontSize: 14,
                                color: '#EE50FF',
                            }} bold>عرض الكل</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 4, paddingBottom: 12, minWidth: '100%', gap: 10}}>
                        {
                            city?.compounds?.map(compound => (
                                <TouchableOpacity key={compound.id} style={{
                                    width: 200,
                                    padding: 8,
                                    borderWidth: 1,
                                    borderColor: '#E8E8E8',
                                    borderRadius: 12,
                                    backgroundColor: '#fff',
                                    shadowColor: '#878787',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 8,
                                }} onPress={() => {
                                    router.push({
                                        pathname: '/(tabs)/(user)/compoundOrHotelDetails',
                                        params: {
                                            id: compound.id,
                                            type: 'compound'
                                        }
                                    })
                                }}>
                                    <Image source={{ uri: compound.images.length > 0 ? compound.images[0] : 'https://placehold.co/600x400/000000/FFFFFF/png' }} style={{
                                        width: '100%',
                                        height: 90,
                                        resizeMode: 'cover',
                                        borderRadius: 4,
                                    }} />
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        backgroundColor: '#fff',
                                    }}>
                                        <Text style={{
                                            fontSize: 12
                                        }} bold>
                                            {compound.name}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                        }} bold>
                                            {compound.base_code}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        gap: 8,
                                        width: '100%',
                                    }}>
                                        <Feather name='map-pin' size={14} color={'#F9D446'} />
                                        <Text style={{
                                            fontSize: 10,
                                            flex: 1,
                                        }}>
                                            {compound.address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }

                    </ScrollView>
                </View>
            )
        }

        {
            (city && city.hotels && city.hotels.length ) && (
                <View style={{ paddingHorizontal: 16}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 14,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <Text style={[styles.sectionTitle, {fontSize: 18, marginBottom: 0, marginHorizontal: 0}]} bold>
                                الفنادق 
                                    ({city.hotels.length})
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push({
                            pathname: '/(tabs)/(user)/allUnits',
                            params: {
                                sort: 'hotels'
                            }
                        })}>
                            <Text style={{
                                fontSize: 14,
                                color: '#EE50FF',
                                marginBottom: 0
                            }} bold>عرض الكل</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 4, paddingBottom: 12, minWidth: '100%', gap: 10}}>
                        {
                            city?.hotels?.map(hotel => (
                                <TouchableOpacity key={hotel.id} style={{
                                    width: 200,
                                    padding: 8,
                                    borderWidth: 1,
                                    borderColor: '#E8E8E8',
                                    borderRadius: 12,
                                    backgroundColor: '#fff',
                                    shadowColor: '#878787',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 8,
                                }} onPress={() => {
                                    router.push({
                                        pathname: '/(tabs)/(user)/compoundOrHotelDetails',
                                        params: {
                                            id: hotel.id,
                                            type: 'hotel'
                                        }
                                    })
                                }}>
                                    <Image source={{ uri: hotel.images.length > 0 ? hotel.images[0] : 'https://placehold.co/600x400/000000/FFFFFF/png' }} style={{
                                        width: '100%',
                                        height: 90,
                                        resizeMode: 'cover',
                                        borderRadius: 4,
                                    }} />
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        backgroundColor: '#fff',
                                    }}>
                                        <Text style={{
                                            fontSize: 12
                                        }} bold>
                                            {hotel.name}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                        }} bold>
                                            {hotel.base_code}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        gap: 8,
                                        width: '100%',
                                    }}>
                                        <Feather name='map-pin' size={14} color={'#F9D446'} />
                                        <Text style={{
                                            fontSize: 10,
                                            flex: 1,
                                        }}>
                                            {hotel.address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            )
        }

        {
            (city && city.units && city.units.length) ? (
                <View style={{
                    padding: 10,
                    paddingVertical: 20,
                    backgroundColor: '#fff',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 0,
                        }}>
                            <Text style={[styles.sectionTitle, {fontSize: 18, marginBottom: 0, marginHorizontal: 0}]} bold>الوحدات / الغرف</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push({
                            pathname: '/(tabs)/(user)/allUnits',
                            params: {
                                sort: 'sales'
                            }
                        })}>
                            <Text style={{
                                fontSize: 14,
                                color: '#EE50FF',
                                marginBottom: 0
                            }} bold>عرض الكل</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{minWidth: '100%'}}>
                        {
                            city?.units?.map(item => (
                                <PropertyCard
                                    key={item.id}
                                    id={item.id}
                                    city={item.city.name}
                                    discountDate={item.sales[0].from + ' - ' + item.sales[item.sales.length - 1]?.to}
                                    image={item.images.length > 0 ? item.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png'}
                                    type={item.type == 'unit' ? item.compound.name : item.hotel.name}
                                    location={item.name}
                                    in_wishlist={item.in_wishlist}
                                    minDays={item.min_reservation_days}
                                    price={item.min_price + ' - ' + item.max_price}
                                    rating={item.rate || '0.00'}
                                    baths={item.toilet_count}
                                    userId={currentUdserId}
                                    ownerId={item.owner_id}
                                    toggleWishlist={() => {dispatch(addToWishlist(item.id));dispatch(fetchWishlist())}}
                                    styles={styles}
                                />
                            ))
                        }
                    </ScrollView>
                </View>
            ) : (
                <View></View>
            )
        }


      </ScrollView>

    </SafeAreaView>
  );
};


export default HotelDetailsScreen;