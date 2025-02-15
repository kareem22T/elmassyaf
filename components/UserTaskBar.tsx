import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import Text from "./Text"
import { router, usePathname } from "expo-router"
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const UserTaskBar = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname == path;
    const chats = useSelector((state : RootState) => state.chat.chats)
    const currentUserId = useSelector((state : RootState) => state.auth.user?.id)

    return (
        <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(user)/home')}>
            <Image source={isActive('/home') ? require('@/assets/images/home-icon-active.png') : require('@/assets/images/home-icon.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
            <Text style={isActive('/home') ? styles.navTextActive : styles.navText} bold>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(user)/wishlist')}>
            <Image source={isActive('/wishlist') ? require('@/assets/images/heart-icon-active.png') : require('@/assets/images/heart-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/wishlist') ? styles.navTextActive : styles.navText} bold>المفضلة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(user)/reservation')}>
            <Image source={isActive('/reservation') ? require('@/assets/images/calendar-icon-active.png') : require('@/assets/images/calendar-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/reservation') ? styles.navTextActive : styles.navText} bold>حجوزاتي</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(owner)/chats')}>
            <Image source={isActive('/chats') ? require('@/assets/images/chat-icon-active.png') : require('@/assets/images/chat-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/chats') ? styles.navTextActive : styles.navText} bold>المحادثات</Text>
            {
              chats.filter(chat => chat.messages.filter(message => message.seen == 0).filter(message => message.sender_id != currentUserId).length > 0).length ? (
                <Text style={{
                width: chats.reduce((total, chat) => total + chat.unseen_by_employee, 0) > 99 ? 30 : 25,
                fontSize: 12,
                flexDirection: 'row',
                alignItems: 'center',
                lineHeight: chats.reduce((total, chat) => total + chat.unseen_by_employee, 0) > 99 ? 25 : 23,
                height: chats.reduce((total, chat) => total + chat.unseen_by_employee, 0) > 99 ? 30 : 25,
                color: '#fff',
                textAlign: 'center',
                backgroundColor: '#FF0000',
                borderRadius: 40,
                position: 'absolute',
                top: chats.reduce((total, chat) => total + chat.unseen_by_employee, 0) > 99 ? -10 : -8,
                right: chats.reduce((total, chat) => total + chat.unseen_by_employee, 0) > 99 ? -10 : -8,
              }}>
                {chats.filter(chat => chat.messages.filter(message => message.seen == 0).filter(message => message.sender_id != currentUserId).length > 0).length}
              </Text>
              ) : (
                <View></View>
              )
            }
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/more')}>
            <Image source={isActive('/more') ? require('@/assets/images/more-icon-active.png') : require('@/assets/images/more-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/more') ? styles.navTextActive : styles.navText} bold>المزيد</Text>
        </TouchableOpacity>
        </View>
    )
}

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


export default UserTaskBar;