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
  Linking,
} from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { router } from 'expo-router';
import { API_URL, responsive } from '@/globals/globals';
import axios from 'axios';
import { TextInput } from 'react-native';
import { CustomSelect } from '@/components/CustomSelect';
import { api } from '@/API';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addToWishlist, fetchWishlist } from '@/redux/wishlistSlice';

// Intercept Axios requests to append the token to headers
// Create a custom axios instance with interceptor
const axiosInstance = axios.create();

// Configure the interceptor outside of the component
const setupAxiosInterceptors = (token:string | any) => {
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('@/assets/images/discount-icon.png')} style={{ width: 22, height: 22 }} />
              <Text style={[styles.type, { color: '#000' }]}>
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
          ownerId != userId && (
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
        paddingTop: 0
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
      searchInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'right',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        width: ((width / 3) * 2) - 25,
        fontFamily: 'NotoKufiArabic_400Regular',
      },
      searchFormContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      filterInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
      },
      searchButton: {
        backgroundColor: '#EE50FF',
        padding: 12,
        width: ((width / 3)) - 18,
        borderRadius: 12,
        alignItems: 'center',
      },
      searchButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'NotoKufiArabic_400Regular',
        fontWeight: '600',
      },
    });

  const styles = getStyles(width, height)
  const [homeData, setHomeData] = useState()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const [cities, setCities] = useState([]);
  const [compounds, setCompounds] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [roomsNumber, setRoomsNumber] = useState();
  const [searchText, setSearchText] = useState('');
  const {token} = useSelector((state: RootState) => state.auth)
  const currentUdserId = useSelector((state: RootState) => state.auth.user?.id)
  
  // Setup axios interceptor when token changes
  useEffect(() => {
    setupAxiosInterceptors(token);
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResponse, citiesResponse, compoundsResponse] = await Promise.all([
          axiosInstance.get(`${API_URL}/api/user/home`),
          axiosInstance.get(`${API_URL}/api/owner/dropdown/cities`),
          axiosInstance.get(`${API_URL}/api/owner/dropdown/compounds`)
        ]);

        setHomeData(homeResponse.data.data);
        setCities(citiesResponse.data.data);
        setCompounds(compoundsResponse.data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wishlist]);

  const handleSearch = () => {
    router.push({
      pathname: '/(tabs)/(user)/filter',
      params: {
        city_id: selectedCity,
        compound_id: selectedCompound,
        rooms_number: roomsNumber,
        search_text: searchText
      }
    })
  };

  useEffect(() => {
    const fetchCompoundsByCity = async () => {
      if (!selectedCity) return;
      
      try {
        const response = await axiosInstance.get(`${API_URL}/api/owner/dropdown/compounds?city_id=${selectedCity}`);
        setCompounds(response.data.data);
      } catch (err) {
        console.error("Failed to fetch compounds by city:", err);
      }
    };

    fetchCompoundsByCity();
  }, [selectedCity]);


  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#EE50FF" /></View>

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { setShowSearch(!showSearch) }}>
          {
            !showSearch && (
              <Image
                source={require('@/assets/images/search.png')}
                style={styles.searchIcon}
              />
            )
          }
          {
            showSearch && (
              <Feather name='x' size={32} color={'#000'} />
            )
          }
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />

        <TouchableOpacity onPress={() => { router.push('/(tabs)/(user)/notifications') }}>
          <Image
            source={require('@/assets/images/bell-notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>
      {
        showSearch && (
          <View style={styles.searchFormContainer}>
            <View style={styles.filterInputContainer}>
              <View style={{ flex: 1 }}>
                <CustomSelect
                  label={''}
                  value={selectedCity}
                  fontSize={12}
                  placeholder="المدينة"
                  options={cities.map(city => ({ label: city.name, value: city.id }))}
                  onChange={(value) => setSelectedCity(value)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <CustomSelect
                  label={''}
                  value={selectedCompound}
                  fontSize={12}
                  placeholder="القريه"
                  options={compounds.map(compound => ({ label: compound.name, value: compound.id }))}
                  onChange={(value) => setSelectedCompound(value)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomSelect
                  label={''}
                  value={roomsNumber}
                  fontSize={12}
                  placeholder="الغرف"
                  options={[
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4', value: 4 },
                    { label: '5', value: 5 },
                    { label: '6', value: 6 },
                    { label: '7', value: 7 },
                    { label: '8', value: 8 },
                    { label: '9', value: 9 },
                    { label: '10', value: 10 }
                  ]}
                  onChange={(value) => setRoomsNumber(value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن وحداتك..."
                placeholderTextColor="#999999"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>
                  بحث
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
      <ScrollView style={styles.content}>
        {
          (homeData && homeData.sales && homeData.sales.length) ? (
            <View style={{
              padding: 10,
              paddingVertical: 20,
              backgroundColor: '#FDEEFF61',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}>
                  <Image source={require('@/assets/images/hot-icon.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                  <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 17, marginHorizontal: 0 }]} bold>العروض الساخنة</Text>
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
                    marginBottom: 10
                  }} bold>كل العروض</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                  (homeData?.sales)?.map(item => (
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
                      toggleWishlist={() => { dispatch(addToWishlist(item.id)); dispatch(fetchWishlist()) }}
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
          (homeData && homeData.cities && homeData.cities.length) && (
            <View style={{
              padding: 16
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Image source={require('@/assets/images/signpost.png')} style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                  }} />
                  <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 17, marginHorizontal: 0 }]} bold>
                    أفضل الوجهات
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({
                  pathname: '/(tabs)/(user)/allUnits',
                  params: {
                    sort: 'cities'
                  }
                })}>
                  <Text style={{
                    fontSize: 14,
                    color: '#EE50FF',
                    marginBottom: 10
                  }} bold>عرض الكل</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: '100%', gap: 10 }}>
                {
                  homeData?.cities?.map(city => (
                    <TouchableOpacity key={city.id} style={{
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#DEDEDE',
                    }} onPress={() => router.push({
                      pathname: '/(tabs)/(user)/cityDetails',
                      params: {
                        id: city.id
                      }
                    })}>
                      <Text style={{
                        color: '#333333',
                        fontSize: 16,
                      }}>
                        {city.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
              {
                homeData?.ads?.length > 0 ? (
                  homeData?.ads.map(ad => (
                    <TouchableOpacity key={ad.id} style={{
                      marginTop: 24,
                      position: 'relative'
                    }} onPress={() => Linking.openURL(ad.url)}>
                      <Image source={{ uri: API_URL + "/storage/app/public/" + ad.image }} style={{
                        width: '100%',
                        height: 250,
                        borderRadius: 12,
                        position: 'relative',
                        zIndex: 2,
                        resizeMode: 'cover',
                      }} />
                      <Image source={require('@/assets/images/ad-bg.png')} style={{
                        position: 'absolute',
                        top: 8,
                        left: '5%',
                        width: '90%',
                        aspectRatio: 'auto',
                        resizeMode: 'contain'
                      }} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View></View>
                )
              }
            </View>
          )
        }

        {
          (homeData && homeData.cities && homeData.cities.length) && (
            <View style={{ padding: 16 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Image source={require('@/assets/images/compounds-icon.png')} style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                  }} />
                  <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 17, marginHorizontal: 0 }]} bold>
                    الكمبوندات المميزه
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
                    marginBottom: 10
                  }} bold>عرض الكل</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 12, minWidth: '100%', gap: 10 }}>
                {
                  homeData?.compounds?.map(compound => (
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
          (homeData && homeData.hotels && homeData.hotels.length) && (
            <View style={{ padding: 16 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Image source={require('@/assets/images/hotel-icon.png')} style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                  }} />
                  <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 17, marginHorizontal: 0 }]} bold>
                    الفنادق المميزه
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
                    marginBottom: 10
                  }} bold>عرض الكل</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 12, minWidth: '100%', gap: 10 }}>
                {
                  homeData?.hotels?.map(hotel => (
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
          (homeData && homeData.best_seller && homeData.best_seller.length) ? (
            <View style={{
              backgroundColor: '#fffcf382',
              paddingBottom: 10
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Image source={require('@/assets/images/best-seller.png')} style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                  }} />
                  <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 17, marginHorizontal: 0 }]} bold>
                    الاكثر رواجًا
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({
                  pathname: '/(tabs)/(user)/allUnits',
                  params: {
                    sort: 'best_seller'
                  }
                })}>
                  <Text style={{
                    fontSize: 14,
                    color: '#EE50FF',
                    marginBottom: 10
                  }} bold>عرض الكل</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                  homeData.best_seller?.map(item => (
                    <PropertyCard
                      key={item.id}
                      id={item.id}
                      city={item.city.name}
                      discountDate={item.sales.length ? item.sales[0].from + ' - ' + item.sales[item.sales.length - 1]?.to : ''}
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
                      toggleWishlist={() => { dispatch(addToWishlist(item.id)); dispatch(fetchWishlist()) }}
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
          (homeData && homeData.topRated && homeData.topRated.length) ? (
            <View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Image source={require('@/assets/images/stars.png')} style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                  }} />
                  <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 17, marginHorizontal: 0 }]} bold>
                    الأعلى تقييم
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({
                  pathname: '/(tabs)/(user)/allUnits',
                  params: {
                    sort: 'top_rated'
                  }
                })}>
                  <Text style={{
                    fontSize: 14,
                    color: '#EE50FF',
                    marginBottom: 10
                  }} bold>عرض الكل</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topRatedContainer}>
                {homeData.topRated.map((item) => (
                  <TouchableOpacity key={item.id} onPress={() => {
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
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                          <Text style={styles.topRatedPrice} bold>
                            {item.min_price} - {item.max_price} جنيه
                          </Text>
                          <Text style={[styles.topRatedPrice, { color: '#222' }]}>
                            / ليلة
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.topRatedLocation}>
                        {(item.type == 'unit' ? item.compound.name : item.hotel.name) + ' - ' + item.city?.name}
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