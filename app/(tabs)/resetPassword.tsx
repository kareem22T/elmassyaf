import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Text from '@/components/Text';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <StatusBar style="dark" />
        
        <View style={styles.content}>
          <Text style={styles.title} bold>ادخال كلمه سر جديده</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="ادخل كلمه سر جديده"
              placeholderTextColor="#666"
              secureTextEntry
              textAlign="right"
            />
            
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="تأكيد كلمه سر الجديده"
              placeholderTextColor="#666"
              secureTextEntry
              textAlign="right"
            />
          </View>

          <Pressable style={styles.submitButton}>
            <Text style={styles.submitButtonText}>تم</Text>
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
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 13,
    fontSize: 16,
    width: '100%',
    color: '#000',
    borderWidth: 1,
    borderColor: '#A7A7A7',
    fontFamily: 'NotoKufiArabic_400Regular'
  },
  submitButton: {
    backgroundColor: '#EE50FF',
    width: '100%',
    padding: 12,
    borderRadius: 15,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

