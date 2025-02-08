import { api } from '@/API';
import { API_URL } from '@/globals/globals';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

type Booking = {
  id: number;
  user_id: number;
  offer_id: number;
  package_id: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  note: string;
  date: string;
  offer: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    company_id: number;
    images: string[];
    status: string;
    category_id: string;
    destination_id: number;
    is_suggested: number;
  };
  package: {
    id: number;
    offer_id: number;
    title: string;
    description: string;
    price: string;
    discounted_price: string;
    image_path: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    name: string;
    photo: string;
  };
};

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
  const response = await api.get(API_URL + '/api/company-bookings'); // Replace with actual endpoint
  return response.data.bookings;
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      });
  },
});

export default bookingsSlice.reducer;
