import Text from "@/components/Text"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native"

const loginFirst = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <TouchableOpacity style={{
                position: 'absolute',
                top: 48,
                left: 16,
                padding: 12,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 8,
            }} onPress={() => {
                router.back();
            }}>
                <Feather name="arrow-right" size={24} color={"#222"} />
            </TouchableOpacity>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16
            }}>
                <Image source={require('@/assets/images/login-avatar.png')} style={{
                    width: 200,
                    height: 200,
                    resizeMode: 'contain'
                }} />
                <Text style={{ fontSize: 20, marginBottom: 20 }} bold>يجب عليك تسجيل الدخول </Text>
                <TouchableOpacity style={{ backgroundColor: '#EE50FF', padding: 16, borderRadius: 8, width: 200, alignItems: 'center', justifyContent: 'center' }} onPress={() => router.push('/login')}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>تسجيل الدخول</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default loginFirst;