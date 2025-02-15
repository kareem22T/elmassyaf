import { router } from "expo-router";

const routes = [
    '/wallet',
    '/myBookings',
    '/chats',
    '/chat',
    '/profile',
    '/addUnit',
    '/statistics',
    '/myUnits',
    '/bookingDetails',
    '/notifications',
    '/wishlist',
    '/payNow',
    '/reservation',
]

export default async function authMiddleware(pathname:string, type: string | undefined, isAuthentication: boolean, isVerified: boolean, isMounted: boolean) {
    if (!isMounted) return; // Ensure the component is mounted before navigation

    if (routes.includes(pathname)) {
        if (!isAuthentication) {
            router.replace('/(tabs)/loginFirst')
            return false;
        }
    
        if (!isVerified) {
            router.replace('/(tabs)/verify')
            return false;
        }
        return true; // If the user is authenticated and verified, continue with the navigation
    }
}