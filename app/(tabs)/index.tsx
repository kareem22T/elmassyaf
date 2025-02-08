import Text from "@/components/Text";
import { AppDispatch, RootState } from "@/store";
import { Redirect } from "expo-router";
import { View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

const Main = () => {
  const isAuthentication = useSelector((state: RootState) => state.auth.isAuthentication);
  const isVerified = useSelector((state: RootState) => state.auth.isVerified);
  const user_type = useSelector((state: RootState) => state.auth.user?.type);
  const {settings} = useSelector((state: RootState) => state)

  return (<Redirect href="/(tabs)/(owner)/onBoarding" />)
}

export default Main;