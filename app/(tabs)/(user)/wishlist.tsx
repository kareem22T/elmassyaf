import React, { useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { responsive } from '@/globals/globals';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addToWishlist, fetchWishlist } from '@/redux/wishlistSlice';

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

export default function WishlistScreen() {
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
      capacityText: {
        fontSize: 12,
        color: '#4B4F5C',
        marginBottom: 4,
      },
      dateText: {
        fontSize: 11,
        color: '#4B4F5C',
        marginBottom: 4,
      },
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
      },
      statCard: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flex: 1
      },
      cardWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        padding: 16,
        justifyContent: 'center',
        boxSizing: 'content-box',
      },
      statTitle: {
        fontSize: responsive(width, 14, 14, 18),
        textAlign: 'center',
        lineHeight: responsive(width, 20, 22, 35),
        color: '#fff'
      },
      statValue: {
        fontSize: responsive(width, 16, 16, 22),
        textAlign: 'center',
        lineHeight: 25,
        color: '#fff'
      },
      requestsButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        margin: 16,
        borderWidth: 1,
        borderColor: '#101010',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8
      },
      row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent:'space-between',
        alignItems: 'center',
      },
      requestsButtonText: {
        textAlign: 'center',
        fontSize: responsive(width, 13, 14, 18),
        width: responsive(width, 100, 100, 130),
      },
      bookingCard: {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: responsive(width, 500, 500, (width / 2 ) - 32),
        borderRadius: 12,
        padding: 12,
        shadowColor: '#8c8c8c',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: .8,
        shadowRadius: 8,
        elevation: 5,
      },
      bookingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        flex: 1,
        marginBottom: 16,
      },
      bookingInfo: {
        flex: 1,
      },
      propertyName: {
        fontSize: 13,
        color: '#4B4F5C',
        marginBottom: 4,
        flex: 1,
      },
      cityName: {
        fontSize: 13,
        color: '#4B4F5C',
        flex: 1,
        marginBottom: 4,
      },
      guestInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
      },
      unitInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      },
      dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
      },
      price: {
        fontSize: 16,
        color: '#EE50FF',
        flex: 1,
        textAlign: 'left',
      },
      actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
      },
      actionButton: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
      },
      acceptButton: {
        backgroundColor: '#EE50FF',
      },
      rejectButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FF0000',
      },
      acceptButtonText: {
        color: '#fff',
        fontSize: 14,
      },
      rejectButtonText: {
        color: '#FF0000',
        fontSize: 14,
      },
      bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingVertical: 8,
      },
      navItem: {
        alignItems: 'center',
      },
      navText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
      },
      activeNavItem: {
        color: '#EE50FF',
      },
      activeNavText: {
        color: '#EE50FF',
      },
      optionWrapper: {
        direction: 'rtl',
      },
      optionBtnActive: {
        borderWidth: 1,
        borderColor: '#EE50FF',
        backgroundColor: '#EE50FF',
        borderRadius: 8,
        padding: 4,
        paddingHorizontal: 12,
    },
    optionBtn: {
        borderWidth: 1,
        borderColor: '#C9C9C9',
        borderRadius: 8,
        padding: 4,
        paddingHorizontal: 12,
      },
      optionTextActive: {
        color: '#fff'
      },
        optionText: {
            color: '#B3B3B3'
        },
          card: {
            width: "100%",
            minWidth: 280,
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

    })

  const styles = getStyles(width, height)

  const dispatch = useDispatch<AppDispatch>()
  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const currentUdserId = useSelector((state: RootState) => state.auth.user?.id)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle} bold>المفضلة</Text>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(owner)/notifications')}}>
          <Image 
            source={require('@/assets/images/bell-notification.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View> 


      <ScrollView contentContainerStyle={{padding: 16}}>
        {
            (wishlist.length) ? (
                  wishlist?.map(item => (
                      <PropertyCard
                          key={item.unit.id}
                          id={item.unit.id}
                          city={item.unit.city?.name}
                          discountDate={item.unit.sales && item.unit.sales[0]?.from + ' - ' + item.unit.sales[item.unit.sales.length - 1]?.to}
                          image={item.unit.images?.length > 0 ? item.unit.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png'}
                          type={item.unit.type == 'unit' ? item.unit.compound?.name : item.unit.hotel?.name}
                          location={item.unit.name}
                          in_wishlist={item.unit.in_wishlist}
                          minDays={item.unit.min_reservation_days}
                          price={item.unit.min_price + ' - ' + item.unit.max_price}
                          rating={item.unit.rate || '0.00'}
                          baths={item.unit.toilet_count}
                          userId={currentUdserId}
                          ownerId={item.unit.owner_id}
                          toggleWishlist={() => {dispatch(addToWishlist(item.unit.id));dispatch(fetchWishlist())}}
                          styles={styles}
                      />
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
            )
        }

      </ScrollView>
    </SafeAreaView>
  );
}

