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
import { 
  Pusher,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { fetchNotifications } from '@/redux/notificationsSlice';
import { fetchChats, fetchMessages } from '@/redux/chatSlice';
  function onSubscriptionSucceeded( data:any) {
    console.log(`onSubscriptionSucceeded:data: ${data}`);
  }
  function onSubscriptionError(channelName: string, message:string, e:any) {
    console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
  }


const TabLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthentication = useSelector((state: RootState) => state.auth.isAuthentication);
  const isVerified = useSelector((state: RootState) => state.auth.isVerified);
  const type = useSelector((state: RootState) => state.auth.user?.type);
  const id = useSelector((state: RootState) => state.auth.user?.id);  
  const auth = useSelector((state: RootState) => state.auth);  
  const {userType} = useSelector((state: RootState) => state.settings);  
  const dispatch = useDispatch<AppDispatch>();
  const isActive = (path: string) => pathname == path;  
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Track mount status
  const messages = useSelector((state : RootState) => state.chat.messages)

  useEffect(() => {
    setIsMounted(true); // Mark as mounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      authMiddleware(pathname, userType, isAuthentication, isVerified, isMounted);
      guestMiddleware(pathname, isAuthentication, userType, isMounted);
    }
  }, [pathname, isMounted]);

  useEffect(() => {
    const checkAuth = async () => {
      await authMiddleware(pathname, userType, isAuthentication, isVerified, isMounted);
      await guestMiddleware(pathname, isAuthentication, userType, isMounted);
      setLoading(false); // Mark middleware as complete
    };
    
    if (isMounted) 
    checkAuth();
  }, [pathname, isMounted]);  

  useEffect(() => {
    if (isAuthentication && userType == 'owner') {
      dispatch(fetchUnits())
    }
    if (isAuthentication)
      dispatch(fetchChats())
  }, [isAuthentication])


    useEffect(() => {
    const pusher = Pusher.getInstance();
    const connectPusher = async () => {
      await pusher.init({
        apiKey: "85d8aefb7b8d34dc9f17",
        cluster: "eu"
      });
      
      await pusher.connect();
      await pusher.subscribe({
        channelName: "channel_" + id,
        onEvent: (event: PusherEvent) => {
          console.log(`Event received: ${JSON.stringify(event)}`);
          
          const data = JSON.parse(event.data);
          
          if (event.eventName) {

            switch (event.eventName) {
              case 'chat':
                  if (data.message) {
                  Toast.show({
                      type: 'info',
                      text1: 'رسالة جديدة',
                      text2: data.message.message,
                      position: 'top',
                    });
                  }
    
                  dispatch(fetchChats());
                  dispatch(fetchMessages(messages[0].chat_id));
                break;
              case 'notification':
                  if (data.body) {
                  Toast.show({
                      type: 'info',
                      text1: data.title,
                      text2: data.body,
                      position: 'top',
                      visibilityTime: 3000
                    });
                  }
    
                  dispatch(fetchNotifications());
                  dispatch(fetchChats());
                  dispatch(fetchMessages(messages[0].chat_id));
                  break;
            
              case 'approved':
                Toast.show({
                  type: 'success',
                  text1: data.title,
                  text2: data.body,
                  position: 'top',
                  visibilityTime: 3000
                });

                dispatch(fetchNotifications());
                break;
            
              case 'Booking':
                Toast.show({
                  type: 'success',
                  text1: data.title,
                  text2: data.body,
                  position: 'top',
                  visibilityTime: 3000
                });

                dispatch(fetchNotifications());
                  break;
            
              default:
                break;
            }
          }

        },
        onSubscriptionSucceeded,
        onSubscriptionError,
      });
      }
      connectPusher()
  
        pusher.unsubscribe({channelName: "channel_" + id})
  }, [id])


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EE50FF" />
      </View>
    );
  }

  if (isActive('/onBoarding') || isActive('/login') || isActive('/forgotPassword') || isActive('/verify') || isActive('/resetPassword') || isActive('/register') || isActive('/notifications') || isActive('/bookingDetails') || isActive('/chat') || isActive('/units') || isActive('/unitDetails') || isActive('/loginFirst') || isActive('/confirmPayment') || isActive('/payNow') || isActive('/allUnits')) {
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
        userType == 'owner' && (
          <OwnerTaskBar />
        )
      }
      {
        userType == 'user' && (
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
