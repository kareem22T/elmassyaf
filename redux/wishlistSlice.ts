import { api } from '@/API';
import { API_URL } from '@/globals/globals';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Toast from 'react-native-toast-message';

// Define the types for the wishlist items and the API responses
interface WishlistItem {
  id: number;
  user_id: number;
  unit_id: number;
  created_at: string;
  updated_at: string;
  unit: {
    id: number;
    code: string;
    owner_id: number;
    ownership_documents: null;
    type: string;
    name: string;
    rate: null;
    unit_type_id: number;
    city_id: number;
    compound_id: number;
    hotel_id: null;
    status: string;
    address: string;
    lat: string;
    lng: string;
    unit_number: string;
    floors_count: number;
    elevator: number;
    area: number;
    distance_unit_beach: string;
    beach_unit_transportation: string;
    distance_unit_pool: string;
    pool_unit_transportation: string;
    room_count: number;
    toilet_count: number;
    description: string;
    reservation_roles: string;
    reservation_type: string;
    price: string;
    insurance_amount: string;
    max_individuals: number;
    youth_only: number;
    min_reservation_days: number;
    deposit: string;
    upon_arival_price: string;
    weekend_prices: number;
    min_weekend_period: null;
    weekend_price: string;
    created_at: string;
    updated_at: string;
    min_price: number;
    max_price: number;
    in_wishlist: boolean;
    unavailable_dates: Array<{
      id: number;
      unit_id: number;
      from: string;
      to: string;
      created_at: string;
      updated_at: string;
    }>;
    images: Array<{
      id: number;
      unit_id: number;
      image: string;
      created_at: string;
      updated_at: string;
    }>;
    available_dates: Array<{
      id: number;
      unit_id: number;
      from: string;
      to: string;
      created_at: string;
      updated_at: string;
    }>;
  };
}

interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
}

interface AddToWishlistResponse {
  success: boolean;
  message: string;
  wishlist: {
    user_id: number;
    unit_id: number;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

interface RemoveFromWishlistResponse {
  success: boolean;
  message: string;
}

// Define the initial state
interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch the wishlist
export const fetchWishlist = createAsyncThunk<WishlistResponse, void>(
  'wishlist/fetchWishlist',
  async () => {
    const response = await api.get<WishlistResponse>(`${API_URL}/api/user/wishlist`);
    return response.data;
  }
);

// Async thunk to add an item to the wishlist
export const addToWishlist = createAsyncThunk<AddToWishlistResponse, number>(
  'wishlist/addToWishlist',
  async (unitId) => {
    const response = await api.post<AddToWishlistResponse>(`${API_URL}/api/user/wishlist`, { unit_id: unitId });
    if (response.data.success)
      Toast.show({
        type: 'success',
        text1: 'رسالة نجاح',
        text2: 'تم اضافة الوحدة الي المفضلة بنجاح',
        position: 'top',
        visibilityTime: 3000,
      })
    else 
      Toast.show({
        type: 'success',
        text1: 'رسالة نجاح',
        text2: 'تم حذف الوحدة من المفضلة ',
        position: 'top',
        visibilityTime: 3000,
      })

    return response.data;
  }
);

// Async thunk to remove an item from the wishlist
export const removeFromWishlist = createAsyncThunk<RemoveFromWishlistResponse, number>(
  'wishlist/removeFromWishlist',
  async (unitId) => {
    const response = await api.delete<RemoveFromWishlistResponse>(`${API_URL}/api/user/wishlist/${unitId}`);
    return response.data;
  }
);

// Create the slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistResponse>) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<AddToWishlistResponse>) => {
        state.loading = false;
        // You can update the state as needed, e.g., add the new item to the wishlist
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to wishlist';
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<RemoveFromWishlistResponse>) => {
        state.loading = false;
        // You can update the state as needed, e.g., remove the item from the wishlist
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from wishlist';
      });
  },
});

export default wishlistSlice.reducer;