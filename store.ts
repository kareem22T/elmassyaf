import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import authReducer from './redux/auth/authSlice';
import chateReducer from './redux/chatSlice';
import notificationReducer from './redux/notificationsSlice';
import bookingReducer from './redux/bookingSlice';
import settingReducer from './redux/settingSlice';
import unitReducer from './redux/unitSlice';
import wishlistReducer from './redux/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chateReducer,
  notifications: notificationReducer,
  bookings: bookingReducer,
  settings: settingReducer,
  units: unitReducer,
  wishlist: wishlistReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'], // Persist only the auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
export default store;
