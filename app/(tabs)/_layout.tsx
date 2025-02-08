import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname, Slot } from 'expo-router';
import Text from '@/components/Text';
import Toast from "react-native-toast-message";
import authMiddleware from '@/middleware/auth';
import guestMiddleware from '@/middleware/guest';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnits } from '@/redux/unitSlice';
import OwnerTaskBar from '@/components/OwnerTaskBar';
import UserTaskBar from '@/components/UserTaskBar';

const TabLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthentication = useSelector((state: RootState) => state.auth.isAuthentication);
  const isVerified = useSelector((state: RootState) => state.auth.isVerified);
  const type = useSelector((state: RootState) => state.auth.user?.type);
  const token = useSelector((state: RootState) => state.auth.token);  
  const dispatch = useDispatch<AppDispatch>();
  const isActive = (path: string) => pathname == path;


  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Track mount status

  useEffect(() => {
    setIsMounted(true); // Mark as mounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      authMiddleware(pathname, type, isAuthentication, isVerified, isMounted);
      guestMiddleware(pathname, isAuthentication, type, isMounted);
    }
  }, [pathname, isMounted]);

  useEffect(() => {
    const checkAuth = async () => {
      await authMiddleware(pathname, type, isAuthentication, isVerified, isMounted);
      await guestMiddleware(pathname, isAuthentication, type, isMounted);
      setLoading(false); // Mark middleware as complete
    };
    
    if (isMounted) 
    checkAuth();
  }, [pathname, isMounted]);  

  useEffect(() => {
    if (isAuthentication && type == 'owner')
      dispatch(fetchUnits())
  }, [isAuthentication])

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EE50FF" />
      </View>
    );
  }

  if (isActive('/onBoarding') || isActive('/login') || isActive('/forgotPassword') || isActive('/verify') || isActive('/resetPassword') || isActive('/register') || isActive('/notifications') || isActive('/bookingDetails') || isActive('/chat') || isActive('/units') || isActive('/unitDetails') || isActive('/confirmPayment') || isActive('/payNow')) {
    return (
      <>
        <Slot />
        <Toast />
      </>
    );
  } 

  return (
    <View style={[styles.container, isActive('/notifications') && { backgroundColor: '#fff', flex: 1 }]}>
      <Slot />
      {
        type == 'owner' && (
          <OwnerTaskBar />
        )
      }
      {
        type == 'user' && (
          <UserTaskBar />
        )
      }
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    zIndex: 9999999999999999,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    position: 'relative'
  },
  navText: {
    fontSize: 10,
    color: '#96A0B5',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 10,
    color: '#EE50FF',
    marginTop: 4,
  },
});

export default TabLayout;
