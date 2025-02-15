import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from './Text';
import { router } from 'expo-router';
import LogoutModal from './LogoutModal';
import DeleteAccountModal from './DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { clearCredentials } from '@/redux/auth/authSlice';
import { reloadAppAsync } from "expo";
import { toggleUserType } from '@/redux/settingSlice';
type RootStackParamList = {
  EditProfile: undefined;
  About: undefined;
  UsagePolicy: undefined;
  Complaint: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onPress, color = '#000' }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemRight}>
        <View style={{width: 32, height: 32, borderRadius: 10, backgroundColor: color, justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesome name={icon as any} size={18} color={'#fff'} />
        </View>
      <Text style={[styles.menuItemText, { color }]} medium>{title}</Text>
    </View>
    <View style={styles.menuItemLeft}>
      <Ionicons name="chevron-back" size={24} color="#666" />
    </View>
  </TouchableOpacity>
);

export default function MoreComponent() {
  const navigation = useNavigation<NavigationProp>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isAuthentication = useSelector((state: RootState) => state.auth.isAuthentication)
  const userType = useSelector((state: RootState) => state.settings.userType)

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const onLogout = () => {
    setLogoutModalVisible(false);
    dispatch(clearCredentials())
    setTimeout(() => {
      reloadAppAsync();
    }, 500);
  };

  const onDelete = () => {
    setDeleteModalVisible(false);
    console.log('Account deleted');
    // Add your delete account logic here
  };

  const handleAddUnit = () => {
    if (isAuthentication && userType == 'user')
    dispatch(toggleUserType());
    router.push('/(tabs)/(owner)/addUnit')
  }

  const handleReservation = () => {
    if (isAuthentication && userType == 'owner')
    dispatch(toggleUserType());
    router.push('/(tabs)/(user)/home')
  }

  return (
    <View style={styles.container}>
      {
        isAuthentication && (
          <MenuItem
            title="تعديل حسابي"
            icon="user"
            onPress={() => router.push('/(tabs)/profile')}
          />
        )
      }
      <MenuItem
        title="عن التطبيق"
        icon="info-circle"
        onPress={() => navigation.navigate('About')}
      />
      <MenuItem
        title="سياسة استخدام"
        icon="file-text"
        onPress={() => navigation.navigate('UsagePolicy')}
      />
      <MenuItem
        title="تقديم شكوى"
        icon="clipboard"
        onPress={() => navigation.navigate('Complaint')}
      />
      {
        userType == 'user' ? (
          <MenuItem
            title="اضف وحدتك الان"
            icon="calendar-plus-o"
            onPress={() => handleAddUnit()}
          />
        ) : (
          <MenuItem
            title="احجز اقاماتك الان"
            icon="calendar-plus-o"
            onPress={() => handleReservation()}
          />
        )
      }
      {
        isAuthentication && (
          <MenuItem
            title="تسجيل خروج"
            icon="arrow-right"
            onPress={handleLogout}
          />
        )
      }
      {
        isAuthentication && (
          <MenuItem
            title="حذف حساب"
            icon="trash"
            onPress={handleDeleteAccount}
            color="#dc3545"
          />
        )
      }
      {
        !isAuthentication && (
          <MenuItem
            title="انشاء حساب"
            icon="user-plus"
            onPress={() => router.push('/(tabs)/register')}
          />
        )
      }
      {
        !isAuthentication && (
          <MenuItem
            title="تسجيل الدخول"
            icon="arrow-left"
            onPress={() => router.push('/(tabs)/login')}
          />
        )
      }
      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onLogout={onLogout}
      />
      
      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={onDelete}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    direction: 'rtl'
  },
  menuItem: {
    flexDirection: 'row',
    direction: 'rtl',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemLeft: {
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginRight: 8,
    textAlign: 'right',
    fontWeight: '500',
  },
});