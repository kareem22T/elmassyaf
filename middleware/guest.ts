import { router } from "expo-router";

const routes = [
    '/login',
    '/register',
    '/onBoarding',
    '/forgotPassword',
    '/changePhone',
];

export default function guestMiddleware(pathname: string, isAuthentication: boolean, type: string | undefined, isMounted: boolean) {
    if (!isMounted) return; // Ensure the component is mounted before navigation

    if (routes.includes(pathname)) {
        if (isAuthentication) {
            if (type === 'owner')
                router.replace('/(tabs)/(owner)/home');
            else if (type === 'user')
                router.replace('/(tabs)/(user)/home');
            else
                return false;
        }
        return true; 
    }
}
