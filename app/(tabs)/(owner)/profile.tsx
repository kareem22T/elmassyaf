import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  I18nManager,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Text from '@/components/Text';
import { responsive } from '@/globals/globals';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function ProfileEditScreen() {
    const [name, setName] = useState('عمرو العمداني');
    const [email, setEmail] = useState('osamdiab@gmail.com');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('AE');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const { width, height } = useWindowDimensions()
    const getStyles = (width: number, height: number) =>
        StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
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
        backButton: {
            padding: 8,
        },
        profileImageContainer: {
            alignItems: 'center',
            marginVertical: 24,
        },
        profileImageBorder: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: '#E847FF',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        profileImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#F5F5F5',
            overflow: 'hidden',
        },
        avatarImage: {
            width: '100%',
            height: '100%',
        },
        editButton: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#E847FF',
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        editIcon: {
            width: 16,
            height: 16,
            tintColor: '#fff',
        },
        form: {
            paddingHorizontal: 16,
            gap: 16,
        },
        inputContainer: {
            gap: 8,
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'right',
        },
        input: {
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            textAlign: 'right',
            fontFamily: 'NotoKufiArabic_400Regular'
        },
        phoneInputContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        countryPicker: {
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            padding: 12,
            justifyContent: 'center',
        },
        phoneInput: {
            flex: 1,
        },
        continueButton: {
            backgroundColor: '#E847FF',
            marginHorizontal: 16,
            marginVertical: 32,
            padding: 16,
            borderRadius: 8,
        },
        continueButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
        },
        });

    const styles = getStyles(width, height)
    return (
        <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
            <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Feather name='arrow-right' color={'#000'} size={28} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} medium>تعديل الحساب</Text>
            <View style={{width: 32}}></View>
            </View>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
            <View style={styles.profileImageBorder}>
            <View style={styles.profileImage}>
                <Image
                source={require('@/assets/images/man.jpg')}
                style={styles.avatarImage}
                />
            </View>
            <TouchableOpacity style={styles.editButton}>
                <Feather name="edit" size={16} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
            <Text style={styles.label}>اسم المالك</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل اسمك"
                placeholderTextColor="#999"
            />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الالكتروني</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor="#999"
                keyboardType="email-address"
            />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
            <Text style={styles.label}>رقم الهاتف</Text>
                <TextInput
                style={[styles.input]}
                value={phone}
                onChangeText={setPhone}
                placeholder="أدخل رقم هاتفك"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                />
            </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>حفظ</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
}

