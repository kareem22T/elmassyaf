import React, { useState } from "react"
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  useWindowDimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import Text from "@/components/Text"
import { Redirect, router } from "expo-router"
import { responsive } from "@/globals/globals"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { setFirstTime } from "@/redux/settingSlice"

const OnBoarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0)
  const fadeAnim = useState(new Animated.Value(1))[0]
  const { width, height } = useWindowDimensions()
  const dispatch = useDispatch<AppDispatch>()
  const {settings} = useSelector((state: RootState) => state)

  const screens = [
    { image: require("@/assets/images/onBoarding1.jpeg"), active: 2 },
    { image: require("@/assets/images/onBoarding2.jpeg"), active: 1 },
    { image: require("@/assets/images/onBoarding3.jpeg"), active: 0 },
  ]

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }

  const nextScreen = () => {
    if (currentScreen < 2) {
      fadeOut()
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1)
        fadeIn()
      }, 200)
    } else {
      dispatch(setFirstTime())
      router.push("/(tabs)/(user)/home")
    }
  }

  const skipToHome = () => {
    dispatch(setFirstTime())
    router.push("/(tabs)/(user)/home")
  }

  const getStyles = (width: number, height: number) =>
    StyleSheet.create({
      container: {
        flex: 1,
        width: width,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        direction: "ltr",
      },
      cardWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        paddingVertical: responsive(width, 20, 40, 56),
        paddingHorizontal: responsive(width, 16, 32, 120),
      },
      card: {
        width: "100%",
        borderRadius: responsive(width, 40, 48, 48),
        paddingHorizontal: 22,
        paddingVertical: 40,
      },
      largeText: {
        fontSize: responsive(width, 16, 18, 22),
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight: responsive(width, 24, 26, 38),
        marginBottom: 18,
      },
      smallText: {
        fontSize: responsive(width, 14, 14, 18),
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight: responsive(width, 20, 22, 28),
      },
      paginationWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 4,
        marginTop: 48,
      },
      paginationBullet: {
        width: 24,
        height: 6,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 8,
      },
      paginationBulletActive: {
        width: 24,
        height: 6,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
      },
      navigationWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        gap: 18,
      },
      skipText: {
        fontSize: responsive(width, 14, 16, 22),
        color: "#FFFFFF",
      },
      nextText: {
        fontSize: responsive(width, 14, 16, 22),
        color: "#FFFFFF",
      },
      nextWrapper: {
        backgroundColor: "#FFFFFF",
        width: 62,
        height: 62,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 62,
      },
      navBtn: {
        flexDirection: "row",
        minWidth: responsive(width, 70, 70, 120),
        gap: 8,
        justifyContent: "space-between",
      },
      nextBtn: {
        padding: 16,
        borderRadius: 48,
        borderWidth: 2,
        borderRightColor: "#EE50FFB0",
        borderTopColor: "#EE50FFB0",
        borderLeftColor: "rgba(255, 255, 255, .4)",
        borderBottomColor: "rgba(255, 255, 255, .4)",
      },
    })

  const styles = getStyles(width, height)

  if (!settings.isFirstTime)
    return (<Redirect href={'/(tabs)/(user)/home'} />);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground style={styles.container} source={screens[currentScreen].image}>
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={["rgba(238, 80, 255, 0.4)", "rgba(61, 1, 67, 0.4)"]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Text style={styles.largeText} bold>
              اضافة بيانات وهمية للتعريف عن التطبيق بأي صيغة مراد تعريف التطبيق الخاص بها
            </Text>
            <Text style={styles.smallText} medium>
              اضافة بيانات وهمية للتعريف عن التطبيق بأي صيغة مراد تعريف التطبيق الخاص بها
            </Text>
            <View style={styles.paginationWrapper}>
              {[0, 1, 2].map((index) => (
                <View
                  key={index}
                  style={
                    index === screens[currentScreen].active ? styles.paginationBulletActive : styles.paginationBullet
                  }
                />
              ))}
            </View>
            <View style={styles.navigationWrapper}>
              <TouchableOpacity style={styles.navBtn} onPress={skipToHome}>
                <Text style={styles.skipText} bold>
                  تخطي
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={nextScreen}>
                <View style={styles.nextWrapper}>
                  <Feather name="arrow-right" size={24} color="#262626" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={nextScreen}>
                <Text style={styles.nextText} bold>
                  التالي
                </Text>
                <Feather name="arrow-right" color={"#ffffff"} size={responsive(width, 24, 24, 40)} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </Animated.View>
  )
}

export default OnBoarding

