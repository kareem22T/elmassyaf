import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { api } from '@/API';
import Text from '@/components/Text';

const API_BASE_URL = 'https://elmassyaf.ykdev.online/api';

export default function ProfileEditScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/profile`);
      if (response.data.success) {
        const userData = response.data.data;
        setName(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone_number);
        setImage(userData.image);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Toast.show({ type: 'error', text1: 'خطأ', text2: 'فشل في جلب بيانات المستخدم' });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);

      if (image && !image.startsWith('http')) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
          uri: image,
          name: filename,
          type,
        });
      }

      const response = await api.post(`${API_BASE_URL}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        Toast.show({ type: 'success', text1: 'نجاح', text2: 'تم تحديث الملف الشخصي بنجاح' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show({ type: 'error', text1: 'خطأ', text2: error.response.data.message || 'فشل في تحديث الملف الشخصي' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {
        loading && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, backgroundColor: "#fff", width: '100%', height: '100%', zIndex: 222 }}><ActivityIndicator size="large" color="#EE50FF" /></View>
        )
      }
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Feather name='arrow-right' color={'#000'} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} medium>تعديل الحساب</Text>
        <View style={{ width: 32 }}></View>
      </View>

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageBorder}>
          <View style={styles.profileImage}>
            <Image source={image ? { uri: image } : require('@/assets/images/default-avatar-icon-of-social-media-user-vector.jpg')} style={styles.avatarImage} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>اسم المالك</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>البريد الالكتروني</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType='email-address' />
        </View>

      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.continueButton} onPress={updateProfile}>
        <Text style={styles.continueButtonText}>حفظ</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, color: '#000' },
  profileImageContainer: { alignItems: 'center', marginVertical: 24 },
  profileImageBorder: { width: 120, height: 120, borderRadius: 120, borderWidth: 2, borderColor: '#E847FF', justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 110, height: 110, borderRadius: 100, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  form: { paddingHorizontal: 16, gap: 16 },
  inputContainer: { gap: 8 },
  label: { fontSize: 16, fontWeight: '500', textAlign: 'right' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, fontSize: 16, textAlign: 'right' },
  continueButton: { backgroundColor: '#E847FF', margin: 16, padding: 16, borderRadius: 8 },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }
});
