'use client';

import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';

// Types
type MediaItem = {  
  uri: string;
  type: 'image' | 'video';
};

type Interval = {
  start: number | null;
  end: number | null;
};

interface ThirdStepInterface {
  images: MediaItem[];
  setImages: (images: MediaItem[]) => void;
  videos: MediaItem[];
  setVideos: (videos: MediaItem[]) => void;
  selectedIntervals: Interval[];
  setSelectedIntervals: (intervals: Interval[]) => void;
  formData: any;
  handleChange: (unitType: string, value: any) => void;
  selectedUnitType: string;
}

const ThirdStep: React.FC<ThirdStepInterface> = ({ 
  images, setImages, videos, setVideos, selectedIntervals, setSelectedIntervals, formData, handleChange, selectedUnitType
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tempInterval, setTempInterval] = useState<Interval>({ start: null, end: null });
  
  // Media picker functions
  const compressImage = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1080 } }], // Resize if needed
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    const compressedImages = await Promise.all(
      result.assets.map(async (asset) => {
        const compressedUri = await compressImage(asset.uri);
        return { uri: compressedUri, type: 'image' as const };
      })
    );

    setImages([...images, ...compressedImages]);
  }
};

const pickVideo = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsMultipleSelection: false,
    quality: 1,
  });

  if (!result.canceled) {
    const videoUri = result.assets[0].uri;
    const response = await fetch(videoUri);
    const blob = await response.blob();
    const fileSizeMB = blob.size / (1024 * 1024); // Convert bytes to MB

    if (fileSizeMB > 10) {
      Toast.show({
        type: 'error',
        text1: 'خطأ في التحميل',
        text2: 'حجم الفيديو يجب ألا يتجاوز 10 ميغابايت',
      });
      return;
    }

    setVideos([{ uri: videoUri, type: 'video' }]);
  }
};  // Generate calendar dates dynamically
  const generateCalendarDates = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const formatDate = (day: number) => `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  const selectDate = (date: number) => {
    if (tempInterval.start === null) {
      setTempInterval({ start: formatDate(date), end: null });
    } else if (tempInterval.end === null && date > parseInt(tempInterval.start.split('-')[2])) {
      setSelectedIntervals([...selectedIntervals, { start: tempInterval.start, end: formatDate(date) }]);
      setTempInterval({ start: null, end: null });
    } else {
      setTempInterval({ start: formatDate(date), end: null });
    }
  };

  const cancelInterval = (index: number) => {
    const updatedIntervals = selectedIntervals.filter((_, i) => i !== index);
    setSelectedIntervals(updatedIntervals);
  };

const getDateSelectionStatus = (date: number) => {
  const formattedDate = formatDate(date);

  for (let interval of selectedIntervals) {
    if (!interval.start || !interval.end) continue;

    if (formattedDate === interval.start) return 'start';
    if (formattedDate === interval.end) return 'end';

    if (formattedDate > interval.start && formattedDate < interval.end) return 'between';
  }

  return null;
};

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Images Section */}
      <Text style={styles.sectionTitle} medium>أرفع الصور الخاصه بالوحده</Text>
      <View style={styles.mediaGrid}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
          <Ionicons name="add" size={40} color="#EE50FF" />
        </TouchableOpacity>
        {images.map((image, index) => (
          <View key={index} style={styles.mediaPreview}>
            <Image source={{ uri: image.uri }} style={styles.mediaPreview} />
            <TouchableOpacity style={styles.removeButton} onPress={() => setImages(images.filter((_, i) => i !== index))}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Videos Section */}
      <Text style={styles.sectionTitle}>أرفع الفيديو الخاص بالوحده(إذاوجد)</Text>
      <View style={styles.mediaGrid}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickVideo}>
          <Ionicons name="videocam" size={40} color="#EE50FF" />
        </TouchableOpacity>
        {videos.map((video, index) => (
          <View key={index} style={styles.mediaPreview}>
            <Image source={{ uri: video.uri }} style={styles.mediaPreview} />
            <TouchableOpacity style={styles.removeButton} onPress={() => setVideos([])}>
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle} medium>حدد الفترات الزمنية المتاحة</Text>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={24} color="#EE50FF" />
        </TouchableOpacity>
        <Text>{`${currentYear} / ${currentMonth + 1}`}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={24} color="#EE50FF" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarDates}>
        {generateCalendarDates().map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.calendarDate,
              getDateSelectionStatus(date) === 'start' ? styles.startDate : {},
              getDateSelectionStatus(date) === 'end' ? styles.endDate : {},
              getDateSelectionStatus(date) === 'between' ? styles.betweenDate : {},
            ]}
            onPress={() => selectDate(date)}
          >
            <Text
              style={[
                styles.calendarDateText,
                getDateSelectionStatus(date) === 'start' ? {color: '#fff'} : {},
                getDateSelectionStatus(date) === 'end' ? {color: '#fff'} : {},
                getDateSelectionStatus(date) === 'between' ? {color: '#fff'} : {},
              ]}
            >
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedIntervals.map((interval, index) => (
        <View key={index} style={styles.intervalContainer}>
          <Text>{`من ${interval.start}/${currentMonth + 1} إلى ${interval.end}/${currentMonth + 1}`}</Text>
          <TouchableOpacity onPress={() => cancelInterval(index)}>
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}

            <Text style={styles.sectionTitle} medium>
              وصف الوحدة
            </Text>
            <TextInput
                style={styles.rulesInput}
                multiline
                placeholder="اكتب وصف الوحدة..."
                value={formData.discription}
                onChangeText={(value) => handleChange('discription', value)}
                textAlign="right"
            />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'right',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  mediaButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#EE50FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'transparent',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    direction: 'ltr'
  },
  calendarDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 16,
    direction: 'ltr'
  },
  calendarDate: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    margin: 2,
  },
  startDate: {
    backgroundColor: '#EE50FF',
    borderColor: '#EE50FF',
    borderRadius: 50
  },
      rulesInput: {
        height: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 8,
        paddingVertical: 12,
        textAlignVertical: 'top',
        fontFamily: 'NotoKufiArabic_400Regular'
    },
  endDate: {
    borderColor: '#EE50FF',
    backgroundColor: '#EE50FF',
    borderRadius: 50
  },
  betweenDate: {
    backgroundColor: '#BFBFBF',
    borderColor: '#BFBFBF'
  },
  calendarDateText: {
    fontSize: 12,
  },
  intervalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default ThirdStep;
