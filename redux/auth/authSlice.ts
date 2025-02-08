// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  type: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthentication: boolean;
  isVerified: boolean; // Add isVerified
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthentication: false,
  isVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        isVerified?: boolean; // Optional property
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthentication = true;
      state.isVerified = action.payload.isVerified || false; // Default to false if not provided
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthentication = false;
      state.isVerified = false;
    },
    setVerification: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setVerification } = authSlice.actions;
export default authSlice.reducer;