import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Text from '@/components/Text';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { API_URL, responsive } from '@/globals/globals';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setCredentials } from '@/redux/auth/authSlice';

const Register = () => {
  const [userType, setUserType] = useState<'user' | 'owner'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { width, height } = useWindowDimensions()

  const getStyles = (width: number, height: number) =>
    StyleSheet.create({
      container: {
        flex: 1,
        width: width,
        height: height,
        overflow: "hidden",
        direction: 'rtl'
      },
      background: {
        flex: 1,
      },
      gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: responsive(width, 16, 20, 40),
        paddingBottom: responsive(width, 56, 80, 56),
        alignItems: "center",
      },
      content: {
        width: '100%',
        alignItems: 'center',
      },
      welcomeText: {
        fontSize: 32,
        color: 'white',
        marginBottom: 22,
        textAlign: 'center',
      },
      emoji: {
        fontSize: 28,
      },
      profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        position: 'relative',
      },
      profileImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#EE50FF',
      },
      profileImagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#EE50FF',
        borderStyle: 'dashed',
      },
      editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#EE50FF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      subtitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
      },
      toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        width: '100%',
      },
      toggleButton: {
        flex: 1,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 10,
      },
      toggleButtonActive: {
        backgroundColor: 'white',
      },
      toggleText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
      },
      toggleTextActive: {
        color: '#EE50FF',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 8,
        paddingHorizontal: 16,
        gap: 4,
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#A7A7A7'
      },
      inputIcon: {
        marginLeft: 0,
      },
      input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: '#333',
        textAlign: 'right',
        fontFamily: 'NotoKufiArabic_500Medium'
      },
      termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 10,
        gap: 10
      },
      checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#EE50FF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
      termsText: {
        color: 'white',
        fontSize: 14,
      },
      termsLink: {
        color: '#EE50FF',
        textDecorationLine: 'underline',
      },
      registerButton: {
        backgroundColor: '#EE50FF',
        width: '100%',
        padding: responsive(width, 10, 15, 16),
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
      },
      registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
      },
      loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      loginText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
      },
      loginLink: {
        color: '#EE50FF',
        fontSize: 14,
        fontWeight: '500',
      },
      blurView: {
        padding: 16,
        width: '100%',
        borderRadius: responsive(width, 28, 36, 40),
        maxWidth: responsive(width, 500, 600, 600),
        overflow: 'hidden',
      }
    });

  const styles = getStyles(width, height)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  
  const validateForm = () => {

    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'ادخل الاسم كامل.',
      });
      return false;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'أدخل البريد الإلكتروني .',
      });
      return false;
    }

    if (!userType) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'اختر نوع الحساب .',
      });
      return false;
    }

    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'أدخل كلمة المرور.',
      });
      return false;
    }

    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
      });
      return false;
    }

    if (!confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'أكد كلمة المرور.',
      });
      return false;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'كلمتا المرور غير متطابقتين.',
      });
      return false;
    }

    return true;
  };

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', name);
      submitData.append('email', email);
      submitData.append('phone_number', phone);
      submitData.append('password', password);
      submitData.append('password_confirmation', confirmPassword);
      submitData.append('type', userType);

      if (image)
        submitData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'image.jpg',
        });


      const apiUrl = API_URL + '/api/account/register';
      const response = await axios.post(apiUrl, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status == 201) {
        const { token, user } = response.data.data;

        dispatch(setCredentials({
          token,
          user,
          isVerified: false
        }));

        Toast.show({
          type: 'success',
          text1: 'نجاح',
          text2: 'تم تسجيل الشركة بنجاح!',
        });

        router.replace('/(tabs)/verify');
      }
    } catch (error) {
      
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        Toast.show({
          type: 'error',
          text1: error.response.data.message || 'خطأ في الإدخال',
          text2: validationErrors[0],
        });
      } else {
        console.log(error)
        Toast.show({
          type: 'error',
          text1: 'خطأ',
          text2: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقًا.',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const [passwordVisible, setPasswordVisible] = useState(false);
const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('@/assets/images/onBoarding2.jpeg')}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={{minHeight: height}}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
            style={styles.gradient}
          >
            <BlurView intensity={50} tint="dark" style={styles.blurView}>
              <View style={styles.content}>
                <Text style={styles.welcomeText} bold>
                  {'مرحباً بك!'} <Text style={styles.emoji}>👋</Text>
                </Text>

                <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.profileImage} />
                  ) : (
                    <View>
                      <Image source={require('@/assets/images/default-avatar-icon-of-social-media-user-vector.jpg')} style={styles.profileImage} />
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <Feather name="edit-2" size={16} color="white" />
                  </View>
                </TouchableOpacity>

                <Text style={styles.subtitle}>تسجيل دخول بصفتي</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="الاسم"
                    placeholderTextColor="#666"
                    value={name}
                    onChangeText={setName}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="ادخل البريد الالكتروني"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="ادخل رقم الهاتف"
                    placeholderTextColor="#666"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="كلمة المرور"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Feather
                      name={passwordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="تأكيد كلمة المرور"
                    secureTextEntry={!confirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    <Feather
                      name={confirmPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.termsContainer}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                  >
                    {acceptTerms && <Ionicons name="checkmark" size={18} color="#EE50FF" />}
                  </TouchableOpacity>
                  <Text style={styles.termsText}>
                    أنا أوافق على{' '}
                    <Text style={styles.termsLink}>الشروط والأحكام</Text>
                    {' '}و{' '}
                    <Text style={styles.termsLink}>سياسة الخصوصية</Text>
                  </Text>
                </View>

                <TouchableOpacity style={styles.registerButton} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>انشاء حساب</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>لديك حساب بالفعل؟</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
                    <Text style={styles.loginLink}>سجل دخول</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </LinearGradient>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default Register;

