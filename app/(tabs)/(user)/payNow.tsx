import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Platform, useWindowDimensions, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'lucide-react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { API_URL, responsive } from '@/globals/globals';
import Text from '@/components/Text';
import axios from 'axios';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface BookingDetailsProps {
  navigation?: any;
}

export const BookingDetailsScreen: React.FC<BookingDetailsProps> = () => {
    const {id, price, deposiit, start, end} = useRoute().params
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
        },
          dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
    gap: 10
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateBoxRed: {
    borderColor: '#FF4444',
  },
  dateBoxPink: {
    borderColor: '#EE50FF',
  },
  dateText: {
    marginLeft: 8,
    textAlign: 'right',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  unitName: {
    fontSize: 18,
    textAlign: 'right',
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666',
    textAlign: 'right',
  },
  detailValue: {
    textAlign: 'right',
  },
  uploadSection: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  uploadTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'right',
  },
  uploadButton: {
    backgroundColor: '#EE50FF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileName: {
    color: '#666',
  },
  fileIcon: {
    width: 24,
    height: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
  payButton: {
    backgroundColor: '#EE50FF',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
  },
            countContainer: {
                padding: 16,
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                marginTop: 16,
            },
            countTitle: {
                fontSize: 18,
                marginBottom: 16,
                textAlign: 'right',
            },
            countRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
            },
            countControls: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
            },
            countButton: {
                backgroundColor: '#EE50FF',
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
            },
            countText: {
                fontSize: 16,
                color: '#000',
            },
            countLabel: {
                fontSize: 16,
                color: '#666',
            },

        });

    const styles = getStyles(width, height)

  const [identityImages, setIdentityImages] = useState<string[]>([]);
      const [adultsCount, setAdultsCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);

const [uploading, setUploading] = useState(false);
    const updateCount = (type: 'adults' | 'children', increment: boolean, maxCount: number) => {
        if (type === 'adults') {
            const newCount = increment ? adultsCount + 1 : adultsCount - 1;
            if (newCount >= 1 && newCount <= maxCount) {
                setAdultsCount(newCount);
            }
        } else {
            const newCount = increment ? childrenCount + 1 : childrenCount - 1;
            if (newCount >= 0 && newCount <= 10) {
                setChildrenCount(newCount);
            }
        }
    };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('يجب السماح بالوصول إلى الصور لاختيار الهوية');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true, // Enable multiple images selection
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIdentityImages([...result.assets.map(asset => asset.uri)]);
    }
  };
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

    if (loading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#EE50FF" /></View>
  
  return (
    <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Feather name='chevron-right' color={'#000'} size={28} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} medium>تفاصيل الحجز</Text>
            <View style={{width: 32}}></View>
            </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{padding: 16}}>
        {/* Header */}

        {/* Date Selection */}
        <View style={styles.dateContainer}>
          <View style={[styles.dateBox, styles.dateBoxPink]}>
            <Calendar size={20} color="#FF4444" />
            <Text style={styles.dateText}>بداية : {start}</Text>
          </View>
          <View style={[styles.dateBox, styles.dateBoxRed]}>
            <Calendar size={20} color="#EE50FF" />
            <Text style={styles.dateText}>نهاية : {end}</Text>
          </View>
        </View>

        {/* Property Image */}
        <Image
            source={{ uri: (unit?.images.length > 0 ? unit?.images[0].image : 'https://placehold.co/600x400/000000/FFFFFF/png') }}
          style={styles.propertyImage}
        />

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.unitName}>{unit.name}</Text>
          <Text style={styles.price}>{unit.min_price + ' - ' + unit.max_price}</Text>
        </View>

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>{unit.type == 'unit' ? unit.compound.name : unit.hotel.name}</Text>
            <Text style={styles.detailLabel}>{unit.city?.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>{unit.elevator ? 'يتوافر اسنانسير' : 'لا يتوافر اسنانسير'}</Text>
            <Text style={styles.detailLabel}>رقم الطابق: {unit?.floors_count}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailValue} bold>المقدم: </Text>
            <Text style={styles.detailLabel} bold>{deposiit + ' جنيه مصري'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailValue} bold>اجمالي السعر: </Text>
            <Text style={styles.detailLabel} bold>{price + ' جنيه مصري'}</Text>
          </View>
        </View>

        {/* ID Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>صور الهويات</Text>
          <TouchableOpacity style={styles.uploadButton}  onPress={pickImages}>
            <Text style={styles.uploadButtonText}>رفع صورة الهوية</Text>
          </TouchableOpacity>
          {/* File List */}
            {identityImages && (
                identityImages.map((identityImage, index) => (

                <View key={index} style={styles.fileRow}>
                    <Text style={styles.fileName}>صورة {index + 1}</Text>
                    <AntDesign name="idcard" size={24} color="black" />
                </View>
                ))
            )}
        </View>

                <View style={styles.countContainer}>
                    <Text style={styles.countTitle}>عدد النزلاء</Text>
                    
                    {/* Adults Count */}
                    <View style={styles.countRow}>
                        <Text style={styles.countLabel}>البالغين</Text>
                        <View style={styles.countControls}>
                            <TouchableOpacity 
                                style={styles.countButton}
                                onPress={() => updateCount('adults', true, unit.max_individuals)}
                            >
                                <Text style={{color: '#fff'}}>+</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.countText}>{adultsCount}</Text>
                            
                            <TouchableOpacity 
                                style={[styles.countButton, {opacity: adultsCount === 1 ? 0.5 : 1}]}
                                onPress={() => updateCount('adults', false, unit.max_individuals)}
                                disabled={adultsCount === 1}
                            >
                                <Text style={{color: '#fff'}}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Children Count */}
                    <View style={styles.countRow}>
                        <Text style={styles.countLabel}>الأطفال</Text>
                        <View style={styles.countControls}>
                            <TouchableOpacity 
                                style={styles.countButton}
                                onPress={() => updateCount('children', true, unit.max_individuals)}
                            >
                                <Text style={{color: '#fff'}}>+</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.countText}>{childrenCount}</Text>
                            
                            <TouchableOpacity 
                                style={[styles.countButton, {opacity: childrenCount === 0 ? 0.5 : 1}]}
                                onPress={() => updateCount('children', false, unit.max_individuals)}
                                disabled={childrenCount === 0}
                            >
                                <Text style={{color: '#fff'}}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

      </ScrollView>
        {/* Book Button */}
        <View style={{
            flexDirection: 'row',
            gap: 16,
            padding: 16,
        }}>
            <Pressable style={styles.bookButton} onPress={() => {
                router.push({
                    pathname: '/(tabs)/(user)/confirmPayment',
                    params: {
                        id: id,
                    },
                })
            }}>
            <Text style={styles.bookButtonText} bold>دفع المقدم</Text>
            </Pressable>
            <Pressable style={[styles.bookButton, {
                backgroundColor: '#E24A4A',
                borderColor: '#E24A4A',
            }]}>
            <Text style={[styles.bookButtonText, {color: '#fff'}]} bold>حذف الحجز</Text>
            </Pressable>
        </View>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;