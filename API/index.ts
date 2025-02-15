import axios from 'axios';
import { setCredentials, clearCredentials } from './../redux/auth/authSlice';
import { Store } from '@reduxjs/toolkit';
import { API_URL } from '@/globals/globals';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const api = axios.create({
  baseURL: API_URL, // Replace with your API base URL
  withCredentials: false, // Include cookies with requests if needed
    headers: {
    'X-Locale': 'ar', // Set locale to Arabic
  },
});

const setupInterceptors = (store: Store) => {
  api.interceptors.request.use(
    (config) => {
      const state = store.getState(); // Access the current state directly from the store
      const token = state.auth.token; // Get the token from the state
      config.headers['X-Locale'] = 'ar'; // Ensure the locale header is always set
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log('Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });

      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
      return response;
    },
    async (error) => {
      console.error('Response Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        store.dispatch(clearCredentials()); // Dispatch the action to clear credentials
        Toast.show({
          type: 'error',
          text1: 'رسالة خطا',
          text2: 'يجب عليك تسجيل الدخول اولا',
        })
      }

      return Promise.reject(error);
    }
  );
};

export { api, setupInterceptors };
