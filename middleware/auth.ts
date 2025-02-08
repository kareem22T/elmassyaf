import { router } from "expo-router";

const routes = [
    '/home',
    '/wallet',
    '/myBookings',
    '/chats',
    '/chat',
    '/profile',
    '/addUnit',
    '/more',
    '/statistics',
    '/units',
    '/bookingDetails',
    '/notifications'
]

export default async function authMiddleware(pathname:string, type: string | undefined, isAuthentication: boolean, isVerified: boolean, isMounted: boolean) {
    if (!isMounted) return; // Ensure the component is mounted before navigation

    if (routes.includes(pathname)) {
        if (!isAuthentication) {
            router.replace('/(tabs)/login')
            return false;
        }
    
        if (!isVerified) {
            router.replace('/(tabs)/verify')
            return false;
        }
        return true; // If the user is authenticated and verified, continue with the navigation
    }
}