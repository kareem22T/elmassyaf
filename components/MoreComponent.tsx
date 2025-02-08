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
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { clearCredentials } from '@/redux/auth/authSlice';

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

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const onLogout = () => {
    setLogoutModalVisible(false);
    dispatch(clearCredentials())
    router.replace('/(tabs)/login')
  };

  const onDelete = () => {
    setDeleteModalVisible(false);
    console.log('Account deleted');
    // Add your delete account logic here
  };

  return (
    <View style={styles.container}>
      <MenuItem
        title="تعديل حسابي"
        icon="user"
        onPress={() => router.push('/(tabs)/profile')}
      />
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
      <MenuItem
        title="تسجيل خروج"
        icon="arrow-right"
        onPress={handleLogout}
      />
      <MenuItem
        title="حذف حساب"
        icon="trash"
        onPress={handleDeleteAccount}
        color="#dc3545"
      />
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