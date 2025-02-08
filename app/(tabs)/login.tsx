import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, TextInput, TouchableOpacity, SafeAreaView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import Text from '@/components/Text';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { responsive, API_URL } from '@/globals/globals';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setCredentials } from '@/redux/auth/authSlice';

const Login = () => {
  const [userType, setUserType] = useState<'user' | 'owner'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch<AppDispatch>();

  const validateForm = () => {
    if (!username) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'ادخل اسم المستخدم أو البريد الإلكتروني.',
      });
      return false;
    }

    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'ادخل كلمة المرور.',
      });
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const apiUrl = API_URL + '/api/account/login';
      const response = await axios.post(apiUrl, {
        identifier: username,
        password,
        type: userType,
      });

      if (response.data.success === true) {
        const { token, user } = response.data.data;

        dispatch(setCredentials({
          token,
          user,
          isVerified: user.email_verified_at !== null,
        }));

        Toast.show({
          type: 'success',
          text1: 'نجاح',
          text2: 'تم تسجيل الدخول بنجاح!',
        });

        if (user.type == 'owner')
          router.replace('/(tabs)/(owner)/home');
        else
          router.replace('/(tabs)/(user)/home');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Toast.show({
          type: 'error',
          text1: 'خطأ',
          text2: 'بيانات الاعتماد غير صحيحة.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'خطأ',
          text2: 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى لاحقًا.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
        gap: 4,
        borderRadius: 12,
        marginVertical: 8,
        paddingHorizontal: 16,
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
        textAlign: 'right',
        color: '#333',
        fontFamily: 'NotoKufiArabic_500Medium'
      },
      forgotPassword: {
        color: '#EE50FF',
        fontSize: 16,
        textAlign: 'right',
        width: '100%',
        marginTop: responsive(width, 6, 10, 16),
        marginBottom: responsive(width, 16, 20, 24),
      },
      loginButton: {
        backgroundColor: '#EE50FF',
        width: '100%',
        padding: responsive(width, 10, 15, 16),
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
      },
      loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
      },
      registerContainer: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
      },
      registerText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
      },
      registerLink: {
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

  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('@/assets/images/onBoarding2.jpeg')}
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
          style={styles.gradient}
        >
          <BlurView intensity={50} tint="dark" style={styles.blurView}>
            <View style={styles.content}>
              <Text style={styles.welcomeText} bold>
                {'مرحباً بك!'} <Text style={styles.emoji}>👋</Text>
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="الهاتف او الايميل"
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={setUsername}
                  textAlign="right"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="كلمة السر"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  textAlign="right"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Feather
                    name={passwordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => { router.push('/(tabs)/forgotPassword') }} style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
                <Text style={styles.forgotPassword}>هل نسيت كلمة السر ؟</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>تسجيل دخول</Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>ليس لديك حساب ؟</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/register')}>
                  <Text style={styles.registerLink}>سجل الآن</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default Login;