import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Text from './Text';
import { router } from 'expo-router';

const NoRequests = () => {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.imageContainer}>
        {/* Placeholder for an illustration */}
        <Image
          source={require('@/assets/images/noRequests.png')} // Replace with your image URL or asset
          style={styles.image}
        />
      </View>
      {/* Text */}
      <Text bold style={styles.title}>لا توجد طلبات مخصصة بعد</Text>
      <Text style={styles.subtitle}>
        عندما يقدم العملاء طلباتهم، ستظهر هنا.
      </Text>
      {/* Button */}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.button}>
        <Text style={styles.buttonText}>تحديث الصفحة</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7e7e7e',
  },
  button: {
    backgroundColor: '#FF543D',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NoRequests;
