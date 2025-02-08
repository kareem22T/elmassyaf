import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { router } from 'expo-router';
import { API_URL, responsive } from '@/globals/globals';
import axios from 'axios';

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
}) => (
  <TouchableOpacity  onPress={() => {
                            router.push({
                                pathname: '/(tabs)/(user)/unitDetails',
                                params: {
                                    id: id,
                                },
                            })
                        }} style={styles.card}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: image }} style={styles.propertyImage} />
      {specialOffer && (
        <View style={[styles.tag, styles.specialOfferTag]}>
          <Text style={styles.tagText}>Special Offer!</Text>
        </View>
      )}
      <View style={styles.priceTag}>
        <Text style={styles.priceText} bold>{price} EG per night</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.locationContainer}>
        <View>
            <Text style={styles.location} bold>{location}</Text>
            <Text style={styles.type} bold>{type}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={22} color="#FFD700" />
          <Text style={styles.rating} bold>{rating}</Text>
        </View>
      </View>
      <View style={styles.amenities}>
        <View style={styles.amenityItem}>
          <Text style={styles.amenityText}>{baths}</Text>
          <MaterialCommunityIcons name="shower" size={20} color="#EE50FF" />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Text>Code: 334</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
    const { width, height } = useWindowDimensions()
    const getStyles = (width: number, height: number) =>
        StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
            header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            marginTop: 24,
            width: '100%',
            },
            headerTitle: {
            fontSize: 20,
            textAlign: 'center',
            },
            logo: {
                width: responsive(width, 44, 44, 50),
                height: responsive(width, 44, 44, 50),
            },
            searchIcon: {
                width: responsive(width, 28, 32, 40),
                height: responsive(width, 28, 32, 40),
            },
            notificationIcon: {
                width: responsive(width, 35, 45, 55),
                height: responsive(width, 35, 45, 55),
            },
        content: {
            flex: 1,
        },
        sectionTitle: {
            fontSize: 16,
            marginHorizontal: 16,
            marginTop: 20,
            marginBottom: 12,
            textAlign: 'right',
        },
        card: {
            width: 280,
            marginHorizontal: 8,
            borderRadius: 12,
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
            height: 220,
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
            backgroundColor: '#F9D446',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        priceText: {
            color: '#333333',
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
            fontSize: 12,
            color: '#878787',
            marginBottom: 4,
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        rating: {
            marginRight: 4,
            fontSize: 14,
        },
        amenities: {
            flexDirection: 'row',
            marginTop: 8,
        },
        amenityItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 16,
        },
        amenityText: {
            marginLeft: 4,
            color: '#878787',
        },
        topRatedContainer: {
            padding: 16,
        },
        topRatedItem: {
            flexDirection: 'row',
            marginBottom: 16,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 8,
            shadowColor: '#878787',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 8,
        },
        topRatedImage: {
            width: 100,
            height: 100,
            borderRadius: 8,
        },
        topRatedContent: {
            flex: 1,
            marginLeft: 12,
            justifyContent: 'space-between',
        },
        topRatedTitle: {
            fontSize: 13,
            textAlign: 'right',
        },
        topRatedLocation: {
            fontSize: 11,
            color: '#666',
            textAlign: 'right',
        },
        topRatedPrice: {
            fontSize: 12,
            color: '#EE50FF',
            textAlign: 'right',
        },
        tabBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: '#eee',
            backgroundColor: '#fff',
        },
        tabItem: {
            alignItems: 'center',
        },
        tabText: {
            fontSize: 12,
            color: '#666',
            marginTop: 4,
        },
        activeTabText: {
            color: '#EE50FF',
        },
        });

    const styles = getStyles(width, height)
    const [bestSeller, setBestSeller] = useState()
    const [topRated, setTopRated] = useState()
    const [sales, setSales] = useState()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchBestSeller = async () => {
        try {
            const response = await axios.get(API_URL + "/api/user/home/best-seller");
            setBestSeller(response.data.units); // Assuming the data is directly useful
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };
        const fetchSales = async () => {
        try {
            const response = await axios.get(API_URL + "/api/user/home/sales");
            setSales(response.data.units); // Assuming the data is directly useful
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        const fetchTopRated = async () => {
        try {
            const response = await axios.get(API_URL + "/api/user/home/top-rated");
            setTopRated(response.data.units); // Assuming the data is directly useful
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchBestSeller()
        fetchTopRated()
        fetchSales()
    }, [])

    if (loading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#EE50FF" /></View>
    
  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(user)/notifications')}}>
            <Image 
            source={require('@/assets/images/search.png')}
            style={styles.searchIcon}
            />
        </TouchableOpacity>

        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />

        <TouchableOpacity onPress={() => {router.push('/(tabs)/(user)/notifications')}}>
            <Image 
            source={require('@/assets/images/bell-notification.png')}
            style={styles.notificationIcon}
            />
        </TouchableOpacity>
      </View> 


      <ScrollView style={styles.content}>
        {
            (bestSeller && bestSeller.length) ? (
                <View>
                    <Text style={styles.sectionTitle} bold>الوجهات الاكثر طلبا</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            bestSeller?.map(item => (
                                <PropertyCard
                                key={item.id}
                                id={item.id}
                                image={item.images.length > 0 ? item.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png'}
                                type={item.type == 'unit' ? item.compound.name : item.hotel.name}
                                location={item.name}
                                price={item.min_price + ' - ' + item.max_price}
                                rating={item.rate || '0.00'}
                                baths={item.toilet_count}
                                featured
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

        {
            (sales && sales.length) ? (
                <View>
                    <Text style={styles.sectionTitle} bold>العروض والخصومات</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            sales?.map(item => (
                                <PropertyCard
                                key={item.id}
                                id={item.id}
                                image={item.images.length > 0 ? item.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png'}
                                type={item.type == 'unit' ? item.compound.name : item.hotel.name}
                                location={item.name}
                                price={item.min_price + ' - ' + item.max_price}
                                rating={item.rate || '0.00'}
                                baths={item.toilet_count}
                                specialOffer
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

        {
            (topRated && topRated?.length) ? (
                <View>
                    <Text style={[styles.sectionTitle, {marginBottom: 0}]} bold>الاعلي تقييما</Text>
                    <View style={styles.topRatedContainer}>
                    {topRated.map((item) => (
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '/(tabs)/(user)/unitDetails',
                                params: {
                                    id: item.id,
                                },
                            })
                        }} key={item.id} style={styles.topRatedItem}>
                        <Image
                            source={{ uri: (item.images.length > 0 ? item.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png') }}
                            style={styles.topRatedImage}
                        />
                        <View style={styles.topRatedContent}>
                            <View style={{
                            }}>
                            <Text style={styles.topRatedTitle} bold>{item.name}</Text>
                            <View style={{flexDirection: 'row', gap: 4}}>
                                <Text style={styles.topRatedPrice} bold>
                                    {item.min_price} - {item.max_price} EGP
                                </Text>
                                <Text style={[styles.topRatedPrice, {color: '#222'}]}>
                                    / ليلة
                                </Text>
                            </View>
                            </View>
                            <Text style={styles.topRatedLocation}>
                            {item.type == 'unit' ? item.compound.name : item.hotel.name}
                            </Text>
                            <View style={styles.ratingContainer}>
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <MaterialCommunityIcons key={index} name="star" size={18} color={index < (item?.rate ? item?.rate : 0) ? '#FFD700' : '#ccc'} />
                                ))}
                            <Text style={styles.rating}>{item.reating || '0.00'}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                    ))}
                    </View>
                </View>
            ) : (
                <View></View>
            )
        }
      </ScrollView>

    </SafeAreaView>
  );
}

