import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  I18nManager,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomRadio } from '@/components/CustomRadio';
import { Stepper } from '@/components/Stepper';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Text from '@/components/Text';
import { API_URL, responsive } from '@/globals/globals';
import FirstStep from '@/components/AddUnit/FirstStep';
import SecondStep from '@/components/AddUnit/SecondStep';
import ThirdStep from '@/components/AddUnit/ThirdStep';
import FourthStep from '@/components/AddUnit/FourthStep';
import FifthStep from '@/components/AddUnit/FifthStep';
import axios from 'axios';
import { api } from '@/API';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addUnit, fetchUnitById, updateUnit } from '@/redux/unitSlice';
import { Alert } from 'react-native';
import SuccessScreen from '@/components/success';
import { useRoute } from '@react-navigation/native';
interface Location {
  longitude: number | null;
  latitude: number | null;
  address: string;
}

// Enable RTL layout
I18nManager.forceRTL(true);

const steps = [
  { number: 1, title: 'نوع\n الوحدة' },
  { number: 2, title: 'تفاصيل الوحدة' },
  { number: 3, title: 'الحجز وصور الوحدة' },
  { number: 4, title: 'شروط الحجز و الدفع' },
  { number: 5, title: 'العروض و الخيارات' },
];
interface CheckboxItem {
  id: string
  text: string
  checked: boolean
}
interface Bed {
    width: number
}
interface Room {
  id: number;
  bedsNumber: number;
  beds: Bed[];
  features: CheckboxItem[];
}

type MediaItem = {  
  uri: string;
  type: 'image' | 'video';
};
type Interval = {
  start: number | null;
  end: number | null;
};

export default function EditUnitScreen() {
    const {id} = useRoute().params
  const [componentReady, setComponentReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUnitType, setSelectedUnitType] = useState('unit');
  const [unitAccessories, setUnitAccessories] = useState<CheckboxItem[]>([])

  const [receptions, setReception] = useState<CheckboxItem[]>([])
  const [kitchenItems, setKitchenItems] = useState<CheckboxItem[]>([])
  const [roomsItems, setRoomsItems] = useState<CheckboxItem[]>([])

  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [selectedIntervals, setSelectedIntervals] = useState<Interval[]>([]);
  const [cancellationPolicies, setCancellationPolicies] = useState([{ days: '', percentage: '' }]);
  const [additionalFees, setAdditionalFees] = useState([{ name: '', value: '', type: '' }]);
  const [longTermPolicies, setLongTermPolicies] = useState([{ days: '', percentage: '' }]);
  const [discounts, setDiscounts] = useState([{ value: "", startDate: "", endDate: "" }]);
  const [specialPrices, setSpecialPrices] = useState([{ price: "", startDate: "", endDate: "", minReservationPeriod: "" }]);
  const [initializedSections, setInitializedSections] = useState({
    accessories: false,
    reception: false,
    kitchen: false,
    rooms: false
  });

    const [selectedLocation, setSelectedLocation] = useState<Location>({
      address: '',
      latitude: null,
      longitude: null,
    });

    const [selectedCompound, setSelectedCompound] = useState()
  

  const [formData, setFormData] = useState({
    unitType: '',
    unitName: '',
    city: '',
    location: '',
    floor: '',
    roomNumber: '',
    unitNumber: '',
    hasElevator: '',
    area: '',
    distanceToActivity: '',
    wayBetweenUnitAndBeach: '',
    wayBetweenUnitAndPool: '',
    size: '',
    distanceBetweenUnitAndBeach: '',
    distanceBetweenUnitAndPool: '',
    roomsNumber: 1,
    bathroomsNumber: 1,
    address: '',
    latitude: '',
    longitude: '',
    discription: '',
    rules: '',
    reservation_type: '',
    youth_only: '',
    price: '',
    insurance_amount: '',
    max_individuals: '',
    min_reservation_days: '',
    deposit: '',
    upon_arival_price: '',
    does_there_weekend_prices: null,
    weekend_price: null,
  });

useEffect(() => {
  const fetchAccessories = async (type: string, setUnitAntities: (value: CheckboxItem[]) => void, section: keyof typeof initializedSections) => {
    // Skip if this section is already initialized
    if (initializedSections[section]) {
      return;
    }

    try {
      const url = `${API_URL}/api/owner/dropdown/amenities/${type}`;
      const response = await api.get(url);
      if (response.data.success) {
        setUnitAntities(response.data.data.map((item: any) => ({
          id: item.id.toString(),
          text: item.name,
          checked: false
        })));
        
        // Mark this section as initialized
        setInitializedSections(prev => ({
          ...prev,
          [section]: true
        }));
      }
    } catch (error) {
      console.error("Error fetching accessories:", error);
      Toast.show({
        type: 'error',
        text1: 'خطأ في تحميل الكماليات',
        text2: 'حدث خطأ أثناء جلب البيانات، حاول مرة أخرى',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  // Only fetch if not initialized
  if (!initializedSections.accessories) {
    fetchAccessories(selectedUnitType, setUnitAccessories, 'accessories');
  }
  if (!initializedSections.kitchen) {
    fetchAccessories('kitchen', setKitchenItems, 'kitchen');
  }
  if (!initializedSections.reception) {
    fetchAccessories('reception', setReception, 'reception');
  }
  if (!initializedSections.rooms) {
    fetchAccessories('room', setRoomsItems, 'rooms');
  }
}, [selectedUnitType, initializedSections]);

  useEffect(() => {
    console.log(formData);
  }, [formData])

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUnitTypeChange = (type: string) => {
    setSelectedUnitType(type);
  };

  const [rooms, setRooms] = useState<Room[]>([]);

// First, modify the rooms useEffect to handle feature initialization properly
useEffect(() => {
  // Only proceed if we have roomsItems loaded
  if (roomsItems.length === 0) {
    return;
  }

  if (rooms.length === 0) {
    // Initial room creation
    const newRooms = Array.from({ length: formData.roomsNumber }, (_, index) => ({
      id: index + 1,
      bedsNumber: 1,
      beds: [{ width: 0 }],
      features: [...roomsItems], // Create a new array copy of roomsItems
    }));
    setRooms(newRooms);
  } else if (rooms.length !== formData.roomsNumber) {
    // Adjust number of rooms while preserving existing data
    if (rooms.length < formData.roomsNumber) {
      // Add new rooms
      const additionalRooms = Array.from(
        { length: formData.roomsNumber - rooms.length },
        (_, index) => ({
          id: rooms.length + index + 1,
          bedsNumber: 1,
          beds: [{ width: 0 }],
          features: [...roomsItems], // Create a new array copy of roomsItems
        })
      );
      setRooms([...rooms, ...additionalRooms]);
    } else {
      // Remove excess rooms
      setRooms(rooms.slice(0, formData.roomsNumber));
    }
  } else {
    // Update existing rooms' features if they don't have any
    const updatedRooms = rooms.map(room => {
      if (!room.features || room.features.length === 0) {
        return {
          ...room,
          features: [...roomsItems], // Add features if missing
        };
      }
      return room;
    });
    
    // Only update if there were changes
    if (JSON.stringify(updatedRooms) !== JSON.stringify(rooms)) {
      setRooms(updatedRooms);
    }
  }
}, [formData.roomsNumber, roomsItems]); // Add roomsItems as a dependency

// Add a useEffect to update room features when roomsItems are loaded
useEffect(() => {
  if (roomsItems.length > 0 && rooms.length > 0) {
    // Check if any room is missing features
    const needsUpdate = rooms.some(room => !room.features || room.features.length === 0);
    
    if (needsUpdate) {
      const updatedRooms = rooms.map(room => ({
        ...room,
        features: room.features?.length ? room.features : [...roomsItems],
      }));
      setRooms(updatedRooms);
    }
  }
}, [roomsItems]); // This will run when roomsItems are loaded
// Add a reset function if needed
const resetAllData = () => {
  setInitializedSections({
    accessories: false,
    reception: false,
    kitchen: false,
    rooms: false
  });
  setUnitAccessories([]);
  setReception([]);
  setKitchenItems([]);
  setRoomsItems([]);
  setRooms([]);
};
const updateRoom = (roomId: number, field: keyof Room | 'bedWidth', value: any, bedIndex?: number) => {
    setRooms(prevRooms =>
        prevRooms.map(room => {
            if (room.id === roomId) {
                let updatedRoom = { ...room };

                if (field === 'bedsNumber') {
                    // Adjust beds array when bedsNumber changes
                    const updatedBeds = Array.from({ length: value }, (_, index) => ({
                        width: room.beds[index]?.width || 100, // Preserve width if exists, default to 100
                    }));
                    updatedRoom.beds = updatedBeds;
                } else if (field === 'bedWidth' && bedIndex !== undefined) {
                    // Update the width of the specific bed
                    updatedRoom.beds = room.beds.map((bed, index) => 
                        index === bedIndex ? { ...bed, width: value } : bed
                    );
                } else {
                    (updatedRoom as any)[field] = value; // Handle other fields
                }

                return updatedRoom;
            }
            return room;
        })
    );
};

const validateForm = () => {
  const unitLabel = selectedUnitType === 'unit' ? 'الوحدة' : 'الغرفة';

  if (!formData['unitName']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل اسم الوحدة`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (!formData['unitType']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختار نوع الوحدة`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (!formData['city']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختار المدينة`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (!formData['location']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: selectedUnitType == 'unit' ? `اختار المجمع السكني` : 'اختار الفندق',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  
  if (selectedUnitType == 'unit' && (!formData['address'] || !formData['latitude'] || !formData['longitude'])) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: 'اختر الموقع على الخريطة',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (selectedUnitType == 'unit' && (!formData['unitNumber'])) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: 'حدد رقم الشاليه',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if ((!formData['floor'])) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: 'حدد رقم الطابق',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (selectedUnitType == 'hotel' && (!formData['roomNumber'])) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: 'حدد رقم الغرفة',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (formData['hasElevator'] == '') {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: 'حدد اذا كان هنالك اسانسير',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (selectedUnitType == 'unit' && (!formData['size'])) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: 'حدد مساحة الشاليه',
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (!formData['distanceBetweenUnitAndBeach']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `حدد المسافة بين الشاطئ و ${unitLabel} (بالدقيقة)`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['wayBetweenUnitAndBeach']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر طريقة تحديد المسافة بين الشاطئ و ${unitLabel}`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['distanceBetweenUnitAndPool']) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `حدد المسافة بين حمام السباحة و ${unitLabel} (بالدقيقة)`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['wayBetweenUnitAndPool']) {

    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر طريقة تحديد المسافة بين حمام السباحة و ${unitLabel}`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }


  if (unitAccessories.filter(item => item.checked == true).length == 0 && currentStep >= 2) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر كماليات ${unitLabel}`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['roomsNumber'] && currentStep >= 1) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `حدد عدد الغرف`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (currentStep >= 2) {
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];

      if (!room.bedsNumber || room.bedsNumber < 1) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `اختر عدد الأسرة للغرفة ${i + 1}`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }

      for (let j = 0; j < room.beds.length; j++) {
        const bed = room.beds[j];

        if (!room.beds[j].width || room.beds[j].width <= 0 || room.beds[j].width == '') {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل عرض السرير ${j + 1} للغرفة ${i + 1}`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
        }
      }
      if (room.features.filter(item => item.checked == true).length == 0 && currentStep >= 1) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `اختر كماليات الغرفة ${i + 1}`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }

    }
  }

  if (!formData['bathroomsNumber'] && currentStep >=2) {
      Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `حدد عدد الحمامات`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (selectedUnitType == 'unit' && receptions.filter(item => item.checked == true).length == 0 && currentStep >= 2) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر كماليات الريسيبشن`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (selectedUnitType == 'unit' && kitchenItems.filter(item => item.checked == true).length == 0 && currentStep >= 2) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر كماليات المطبخ`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (images.length == 0 && currentStep >= 3) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر صور ${unitLabel}`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (selectedIntervals.length == 0 && currentStep >= 3) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر الفترات التاحة للحجز`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['discription'] && currentStep >= 3) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل وصف ${unitLabel}`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['rules'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل شروط وقواعد الحجز`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['reservation_type'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `اختر طريقة الحجز`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['price'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل سعر الوحدة`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  if (!formData['insurance_amount'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل مبلغ التامين`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['max_individuals'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل اقصى عدد الافراد البالغين`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['min_reservation_days'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل اقل فترة للحجز`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (currentStep >= 4) {
    cancellationPolicies.forEach((policy, index) => {
      if (!policy.days) {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل الشرط الاول ${index + 1} من ساسة الالغاء`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
      }
      if (!policy.percentage) {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل الشرط الثاني ${index + 1} من ساسة الالغاء`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
      }
    })
    additionalFees.forEach((fee, index) => {
      if (!fee.name) {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل نوع الرسوم ${index + 1}`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
      }
      if (!fee.value) {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل قيمة الرسوم ${index + 1}`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
      }
    })
    longTermPolicies.forEach((term, index) => {
      if (!term.days) {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل عدد ايام حجز اكثر للسياسة ${index + 1}`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
      }
      if (!term.percentage) {
          Toast.show({
            type: 'error',
            text1: 'خطأ في البيانات',
            text2: `ادخل نسبة الخصم للسياسة للسياسة ${index + 1}`,
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
      }
    })
  }

  if (!formData['deposit'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل نسبة المقدم`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (!formData['upon_arival_price'] && currentStep >= 4) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل نسبة الدفع عند الوصول`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  if (currentStep >= 5) {
    discounts.forEach((discount) => {
      if (!discount.startDate || !discount.endDate) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `ادخل تاريخ بداية الخصم ${discount.startDate} وتاريخ الانتهاء`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }
      if (!discount.value) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `ادخل قيمة الخصم ${discount.value}`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }
    })
    specialPrices.forEach((discount) => {
      if (!discount.startDate || !discount.endDate) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `ادخل تاريخ بداية الفترة الخاصة ${discount.startDate} وتاريخ الانتهاء`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }
      if (!discount.price) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `ادخل سعر الفترة الخاصة ${discount.price}`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }
      if (!discount.minReservationPeriod) {
        Toast.show({
          type: 'error',
          text1: 'خطأ في البيانات',
          text2: `ادخل اقل مدة حجز لفترة خاصة ${discount.price}`,
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }
    })
  }

    if (!formData['does_there_weekend_prices'] && !formData['weekend_price'] && currentStep >= 5) {
    Toast.show({
      type: 'error',
      text1: 'خطأ في البيانات',
      text2: `ادخل سعر الويك اند`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }

  return true;
};

const dispatch = useDispatch<AppDispatch>()
const loading = useSelector((state: RootState) => state.units.loading);  
const error = useSelector((state: RootState) => state.units.error);  
const [modalVisible, setModalVisible] = React.useState(false);

const handleSubmit = () => {
  if (validateForm()) {
    const Form = new FormData();

    Form.append("id", id);
    Form.append("type", selectedUnitType);
    Form.append("name", formData.unitName);
    Form.append("city_id", formData.city);
    Form.append("unit_type_id", formData.unitType);

    if (selectedUnitType === "unit") {
      Form.append("compound_id", formData.location);
      Form.append("address", formData.address);
      Form.append("lat", formData.latitude);
      Form.append("lng", formData.longitude);
      Form.append("unit_number", formData.unitNumber);
      Form.append("floors_count", formData.floor);
      Form.append("area", formData.size);
    } else {
      Form.append("hotel_id", formData.location);
      Form.append("unit_number", formData.roomNumber);
      Form.append("floors_count", formData.floor);
    }

    Form.append("elevator", formData.hasElevator);
    Form.append("distance_unit_beach", formData.distanceBetweenUnitAndBeach);
    Form.append("distance_unit_pool", formData.distanceBetweenUnitAndPool);
    Form.append("beach_unit_transportation", formData.wayBetweenUnitAndBeach);
    Form.append("pool_unit_transportation", formData.wayBetweenUnitAndPool);
    Form.append("room_count", formData.roomsNumber);

    // Append checked accessories, kitchen items, and reception items as arrays of IDs
    const checkedAccessories = unitAccessories
      .filter((item) => item.checked)
      .map((item) => item.id);
    checkedAccessories.forEach((id, index) => {
      Form.append(`amenities[${index}]`, id);
    });

    const checkedKitchenItems = kitchenItems
      .filter((item) => item.checked)
      .map((item) => item.id);
    checkedKitchenItems.forEach((id, index) => {
      Form.append(`kitchen[${index}]`, id);
    });

    const checkedReceptionItems = receptions
      .filter((item) => item.checked)
      .map((item) => item.id);
    checkedReceptionItems.forEach((id, index) => {
      Form.append(`reception[${index}]`, id);
    });

    // Append rooms as objects in the format room[1][title]
    rooms.forEach((room, roomIndex) => {
      Form.append(`room[${roomIndex + 1}][bed_count]`, room.bedsNumber);

      // Append beds in each room
      let bed_sizes = []
      room.beds.forEach((bed, bedIndex) => {
        bed_sizes.push(bed.width);
      });

      bed_sizes.forEach((bed, bedIndex) => {
        Form.append(`room[${roomIndex + 1}][bed_sizes][${bedIndex}]`, bed);
      });

      // Append checked features in the room
      const checkedFeatures = room.features
        .filter((feature) => feature.checked)
        .map((feature) => feature.id);
      checkedFeatures.forEach((id, index) => {
        Form.append(`room[${roomIndex + 1}][amenities][${index}]`, id);
      });
    });

    // Append bathrooms number
    Form.append("toilet_count", formData.bathroomsNumber);

    images.forEach((image, index) => {
      Form.append(`images[${index}]`, {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
      });
    })
    videos.forEach((video, index) => {
      Form.append(`videos[${index}]`, {
        uri: video.uri,
        type: 'video/mp4', // Adjust based on actual video format
        name: 'video.mp4', // Ensure correct file extension
      });
    });

    selectedIntervals.forEach((interval, index) => {
      Form.append(`available_dates[${index}][from]`, interval?.start);
      Form.append(`available_dates[${index}][to]`, interval.end);
    })

    Form.append('description', formData['discription'])
    Form.append('reservation_roles', formData['rules'])
    Form.append('reservation_type', formData['reservation_type'])
    Form.append('price', formData['price'])
    Form.append('insurance_amount', formData['insurance_amount'])
    Form.append('max_individuals', formData['max_individuals'])
    if (formData['youth_only'])
      Form.append('youth_only', 1)
    else
      Form.append('youth_only', 0)

    Form.append("min_reservation_days", formData.min_reservation_days);
    
    cancellationPolicies.forEach((policy, index) => {
      Form.append(`cancel_policies[${index}][days]`, policy.days);
      Form.append(`cancel_policies[${index}][penalty]`, policy.percentage);
    })
    
    additionalFees.forEach((fee, index) => {
      Form.append(`additional_fees[${index}][fees]`, fee.name);
      Form.append(`additional_fees[${index}][amount]`, fee.value);
    })
    
    Form.append("deposit", formData.deposit);
    Form.append("upon_arival_price", formData.upon_arival_price);

    longTermPolicies.forEach((term, index) => {
      Form.append(`long_term_reservations[${index}][more_than_days]`, term.days);
      Form.append(`long_term_reservations[${index}][sale_percentage]`, term.percentage);
    })

    discounts.forEach((discount, index) => {
      Form.append(`sales[${index}][from]`, discount.startDate);
      Form.append(`sales[${index}][to]`, discount.endDate);
      Form.append(`sales[${index}][sale_percentage]`, discount.value);
    })

    specialPrices.forEach((discount, index) => {
      Form.append(`special_reservation_times[${index}][from]`, discount.startDate);
      Form.append(`special_reservation_times[${index}][to]`, discount.endDate);
      Form.append(`special_reservation_times[${index}][price]`, discount.price);
      Form.append(`special_reservation_times[${index}][min_reservation_period]`, discount.minReservationPeriod);
    })

    if (formData['weekend_price'])
      Form.append("weekend_price", formData['weekend_price']);

    Form.append("weekend_prices", formData['weekend_price'] ? 1 : 0);
    

    if (currentStep == 5) {
      dispatch(updateUnit({id: id, formData: Form}))
      if (!loading)
        if (error) {
          Alert.alert('حدث خطا ما', error);
        } else {
          setTimeout(() => {
            setModalVisible(true)
          }, 1000);
        }
    } else {
      setCurrentStep(currentStep + 1);
    }
  }
};
  const { width, height } = useWindowDimensions();
  const getStyles = (width: number, height: number) =>
  StyleSheet.create({
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#28a745', // Green for confirmation
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 1
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red for cancel
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 1

  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

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
        marginBottom: 16,
      },
      headerTitle: {
        fontSize: responsive(width, 16, 18, 24),
        color: '#000',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
      },
      content: {
        padding: 16,
      },
      unitTypeButtons: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F4F4F4',
        gap: 12,
        marginBottom: 24,
      },
      unitTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      activeUnitType: {
        backgroundColor: '#EE50FF',
        borderColor: '#EE50FF',
      },
      unitTypeButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
      },
      inputContainer: {
        marginBottom: 16,
      },
      label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
      },
      input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'right',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: 'NotoKufiArabic_400Regular',
      },
      mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        gap: 8,
      },
      mapButtonText: {
        fontSize: 16,
        color: '#666',
        flex: 1,
      },
      row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
      },
      halfWidth: {
        flex: 1,
      },
      footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      submitButton: {
        backgroundColor: '#EE50FF',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1
      },
      submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
      },
      roomCard: {
        padding: 12,
        backgroundColor: '#FCFCFC',
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderRadius: 12,
        marginBottom: 16,
      },
      roomCardTitle: {
        fontSize: 16,
        color: '#010101',
      },
      roomCardRow: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      roomCardRowItem: {
        flex: 1
      },
      roomCardRowItemText: {
        fontSize: 16,
        color: '#222',
      },
      line: {
        backgroundColor: '#C4C4C4',
        height: 1,
        marginBottom: 16,
        width: '100%'
      }
    });

  const styles = getStyles(width, height);

    const unit = useSelector((state: RootState) => state.units.unit);
  
    useEffect(() => {        
        if (initializedSections.accessories && initializedSections.kitchen && initializedSections.reception && initializedSections.rooms) {
            dispatch(fetchUnitById(id))
            
            setComponentReady(true);
        }
    }, [initializedSections, dispatch]);
    function formatRooms(rooms, allFeatures) {
        return rooms.map(room => ({
            id: room.id,
            bedsNumber: room.bed_count,
            beds: room.bed_sizes.map(size => ({ width: size })),
            features: allFeatures.map(feature => ({
                id: feature.id,
                text: feature.text,
                checked: room.amenities.find(item => item.id == feature.id) ? true : false
            }))
        }));
    }
    useEffect(() => {
        if (unit) {
            setSelectedUnitType(unit.type)
            handleChange('unitType', unit.unit_type_id)
            handleChange('unitName', unit.name)
            handleChange('city', unit.city_id)
            handleChange('location', unit.hotel_id || unit.compound_id)
            handleChange('latitude', unit.lat)
            handleChange('longitude', unit.lng)
            handleChange('address', unit.address)
            setSelectedLocation({
                address: unit.address,
                latitude: parseFloat(unit.lat),
                longitude: parseFloat(unit.lng),
            })
            if (unit.compound)
                setSelectedCompound({
                    ...unit.compound,
                    coordinates: unit.compound.coordinates.map(coord => ({
                        lng: parseFloat(coord.lng),
                        lat: parseFloat(coord.lat)
                    }))
                });

            handleChange('unitNumber', unit.unit_number)
            handleChange('floor', String(unit.floors_count))
            handleChange('roomNumber', unit.unit_number)
            handleChange('hasElevator', unit.elevator)
            handleChange('size', String(unit.area))
            handleChange('distanceBetweenUnitAndBeach', unit.distance_unit_beach)
            handleChange('wayBetweenUnitAndBeach', unit.beach_unit_transportation)
            handleChange('distanceBetweenUnitAndPool', unit.distance_unit_pool)
            handleChange('wayBetweenUnitAndPool', unit.pool_unit_transportation)

                
            // Update `checked` property in `receptions`
            const newReceptions = receptions.map(reception => ({
                ...reception,
                checked: unit.reception_amenities.find(item => item.id == reception.id) ? true : false // Check if ID exists
            }));
            setReception(newReceptions);

            const kitchenAmenityIds = new Set(unit.kitchen_amenities.map(item => item.id.toString()));

            // Update `checked` property in `receptions`
            const newKitchen = kitchenItems.map(item => ({
                ...item,
                checked: kitchenAmenityIds.has(item.id) // Check if ID exists
            }));
            setKitchenItems(newKitchen);


            // Update `checked` property in `receptions`
            const newUnitAmenities = unitAccessories.map(item => ({
                ...item,
                checked: unit.unit_amenities.find(x => x.id == item.id) ? true : false // Check if ID exists
            }));
            setUnitAccessories(newUnitAmenities);
            
            setRooms(formatRooms(unit.rooms, roomsItems))

            setImages(
                unit.images.map(image => ({
                    uri: image.image,
                    type: 'image'
                }))
            )

            setVideos(
                unit.videos.map(video => ({
                    uri: video.video,
                    type: 'video'
                }))
            )

            setSelectedIntervals(
                unit.available_dates.map(interval => ({
                    start: interval.from,
                    end: interval.to,
                }))
            )

            handleChange('description', unit.description)
            handleChange('rules', unit.reservation_roles)
            handleChange('reservation_type', unit.reservation_type)
            handleChange('price', unit.price)
            handleChange('insurance_amount', unit.insurance_amount)
            handleChange('max_individuals', String(unit.max_individuals))
            handleChange('youth_only', unit.youth_only)
            handleChange('min_reservation_days', String(unit.min_reservation_days))
            handleChange('deposit', String(unit.deposit))
            handleChange('upon_arival_price', String(unit.upon_arival_price))
            handleChange('weekend_price', unit.weekend_price)
            handleChange('does_there_weekend_prices', unit.weekend_price ? '1' : '0')

            let newCancellPolicy = unit.cancel_policies.map(policy => {
                return {
                    days: policy.days,
                    percentage: policy.penalty
                }
            })
            setCancellationPolicies(newCancellPolicy);
            
            let storedAdditionalFees = unit.additional_fees.map(fee => {
                return {
                    name: fee.fees,
                    value: fee.amount
                }
            })

            setAdditionalFees(storedAdditionalFees)

            let storedLongTermReservations = unit.long_term_reservations.map(term => {
                return {
                    days: String(term.more_than_days),
                    percentage: term.sale_percentage
                }
            })

            setLongTermPolicies(storedLongTermReservations)

            let storedDiscounts = unit.sales.map(discount => {
                return {
                    startDate: discount.from,
                    endDate: discount.to,
                    value: discount.sale_percentage,
                }
            })

            setDiscounts(storedDiscounts)

            let storedSpecialReservations = unit.special_reservation_times.map(discount => {
                return {
                    startDate: discount.from,
                    endDate: discount.to,
                    price: discount.price,
                    minReservationPeriod: String(discount.min_reservation_period),
                }
            })

            setSpecialPrices(storedSpecialReservations)
        }
    }, [unit]);

  if (!componentReady) {
    return <View style={{flex: 1}}><ActivityIndicator size="large" color="#EE50FF" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name='arrow-right' color={'#000'} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} medium>تعديل بيانات الوحدة</Text>
          <View style={{ width: 32 }}></View>
        </View>

        <Stepper steps={steps} currentStep={currentStep} />
        {
          loading ? (
            <ActivityIndicator size="large" color="#EE50FF" />
          ) : (
            <ScrollView style={styles.scrollView}>
              {
                currentStep === 1 && (
                  <FirstStep
                    formData={formData}
                    handleChange={handleChange}
                    styles={styles}
                    selectedUnitType={selectedUnitType}
                    handleUnitTypeChange={handleUnitTypeChange}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    selectedCompound={selectedCompound}
                    setSelectedCompound={setSelectedCompound}
                  />
                )
              }

              {
                currentStep === 2 && (
                  <SecondStep
                    formData={formData}
                    handleChange={handleChange}
                    styles={styles}
                    selectedUnitType={selectedUnitType}
                    setUnitAccessories={setUnitAccessories}
                    unitAccessories={unitAccessories}
                    roomsItems={roomsItems}
                    receptions={receptions}
                    setReception={setReception}
                    kitchenItems={kitchenItems}
                    setKitchenItems={setKitchenItems}
                    rooms={rooms}
                    updateRoom={updateRoom}
                  />
                )
              }

              {
                currentStep === 3 && (
                  <ThirdStep
                    formData={formData}
                    handleChange={handleChange}
                    selectedUnitType={selectedUnitType}
                    images={images}
                    setImages={setImages}
                    videos={videos}
                    setVideos={setVideos}
                    selectedIntervals={selectedIntervals}
                    setSelectedIntervals={setSelectedIntervals}
                  />
                )
              }

              {
                currentStep === 4 && (
                  <FourthStep 
                    formData={formData}
                    handleChange={handleChange}
                    cancellationPolicies={cancellationPolicies}
                    setCancellationPolicies={setCancellationPolicies}
                    additionalFees={additionalFees}
                    setAdditionalFees={setAdditionalFees}
                    longTermPolicies={longTermPolicies}
                    setLongTermPolicies={setLongTermPolicies}
                  />
                )
              }

              {
                currentStep === 5 && (
                  <FifthStep 
                    formData={formData}
                    handleChange={handleChange}
                    discounts={discounts}
                    setDiscounts={setDiscounts}
                    specialPrices={specialPrices}
                    setSpecialPrices={setSpecialPrices}
                  />
                )
              }

              <View style={[styles.content, {flexDirection: 'row', gap: 16}]}>
                {
                  currentStep > 1 && (
                  <TouchableOpacity style={[styles.submitButton, {backgroundColor: '#222'}]} onPress={() => setCurrentStep(currentStep - 1)}>
                    <Text style={styles.submitButtonText} medium>رجوع</Text>
                  </TouchableOpacity>
                  )
                }
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                      <Text style={styles.submitButtonText} medium>{currentStep == 5 ? "حفظ" : 'متابعة'}</Text>
                    </TouchableOpacity>
              </View>
            </ScrollView>
          )
        }
        {
          !loading && !error && (
            <SuccessScreen title={'تم تعديل بياناتك بنجاح'} sub_title={''} visible={modalVisible} onClose={() => router.replace('/(tabs)/(owner)/home')} />
          )
        }
      </SafeAreaView>
  );
}