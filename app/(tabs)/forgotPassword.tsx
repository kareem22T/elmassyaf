import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Pressable, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Text from '@/components/Text';
import { router } from 'expo-router';

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <StatusBar style="dark" />
        
        <View style={styles.content}>
          <Text style={styles.title} bold>هل نسيت كلمه السر</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.countryCode}>
              <Image 
                source={require('@/assets/images/Egypt (EG).png')}
                style={styles.flag}
              />
              <Text style={styles.countryCodeText}>+20</Text>
            </View>
            
            <View style={styles.phoneInput}>
              <TextInput
                style={styles.phoneInputText}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="ادخل رقم الهاتف"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                textAlign="right"
              />
            </View>
          </View>

          <Pressable style={styles.submitButton} onPress={() => {router.push('/(tabs)/verify')}}>
            <Text style={styles.submitButtonText}>ارسال الكود</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#A7A7A7'

  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7A7A7'
  },
  phoneInputText: {
    fontSize: 16,
    padding: 12,
    textAlign: 'right',
    color: '#000',
    fontFamily: 'NotoKufiArabic_400Regular',
  },
  submitButton: {
    backgroundColor: '#EE50FF',
    width: '100%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

