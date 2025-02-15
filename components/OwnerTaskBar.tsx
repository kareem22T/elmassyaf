import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import Text from "./Text"
import { router, usePathname } from "expo-router"

const OwnerTaskBar = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname == path;

    return (
        <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(owner)/home')}>
            <Image source={isActive('/home') ? require('@/assets/images/home-icon-active.png') : require('@/assets/images/home-icon.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
            <Text style={isActive('/home') ? styles.navTextActive : styles.navText} bold>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(owner)/wallet')}>
            <Image source={isActive('/wallet') ? require('@/assets/images/wallet-icon-active.png') : require('@/assets/images/wallet-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/wallet') ? styles.navTextActive : styles.navText} bold>المحفظة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(owner)/myBookings')}>
            <Image source={isActive('/myBookings') ? require('@/assets/images/booking-icon-active.png') : require('@/assets/images/booking-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/myBookings') ? styles.navTextActive : styles.navText} bold>حجوزاتي</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/(owner)/chats')}>
            <Image source={isActive('/chats') ? require('@/assets/images/chat-icon-active.png') : require('@/assets/images/chat-icon.png')} style={{ alignSelf: 'center', width: 32, height: 30 }} />
            <Text style={isActive('/chats') ? styles.navTextActive : styles.navText} bold>المحادثات</Text>
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


export default OwnerTaskBar;