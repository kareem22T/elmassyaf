import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Text from '@/components/Text';
import { router } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL } from '@/globals/globals';
import { api } from '@/API';
import { setVerification } from '@/redux/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { ScrollView } from 'react-native';


export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    requestOtp();
  }, []);

  const requestOtp = async () => {
    try {
      const response = await api.get(`${API_URL}/api/account/ask-code`);
      console.log('OTP Request Response:', response.data); // تسجيل الاستجابة في الكونسول
      Toast.show({ type: 'success', text1: 'تم إرسال رمز OTP بنجاح عبر بريدك الالكتروني' });
    } catch (error) {
      console.log('OTP Request Error:', error.response?.data || error.message); // تسجيل الخطأ
      Toast.show({ type: 'error', text1: 'فشل في إرسال رمز OTP' });
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      Toast.show({ type: 'error', text1: 'الرجاء إدخال رمز OTP كامل' });
      return;
    }

    setLoading(true);
    try {
      await api.post(`${API_URL}/api/account/verify`, { code: otpCode });
      Toast.show({ type: 'success', text1: 'تم التحقق بنجاح' });
      dispatch(setVerification(true)) 
      router.replace('/(tabs)/(owner)/home');
    } catch (error) {     
       
      Toast.show({ type: 'error', text1: error.response.data.message ||  'رمز OTP غير صحيح' });
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.title} bold>أدخل رمز المصادقة</Text>
            <Text style={styles.subtitle}>أدخل الرقم المكون من 4 أرقام الذي أرسلناه عبر البريد الالكتروني</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>لم تستلم رمز OTP ؟</Text>
              <Pressable onPress={requestOtp} disabled={loading}>
                <Text style={styles.resendLink}>أعد إرسال</Text>
              </Pressable>
            </View>
            <Pressable style={styles.submitButton} onPress={verifyOtp} disabled={loading}>
              <Text style={styles.submitButtonText}>{loading ? 'جاري التحقق...' : 'تم'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  headerText: { fontSize: 20, color: '#EE50FF', textAlign: 'right', marginBottom: 40 },
  formContainer: { alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', direction: 'ltr', gap: 10, marginBottom: 40 },
  otpInput: { width: 50, height: 50, borderBottomWidth: 2, borderBottomColor: '#ccc', fontSize: 24, direction: 'ltr', fontWeight: '500' },
  resendContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 40 },
  resendText: { fontSize: 16, color: '#666' },
  resendLink: { fontSize: 16, color: '#EE50FF' },
  submitButton: { backgroundColor: '#EE50FF', width: '100%', padding: 12, borderRadius: 14, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
