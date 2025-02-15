import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SettingsState {
  isFirstTime: boolean;
  userType: string;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  isFirstTime: true,
  userType: 'user',
  loading: false,
  error: null,
};


const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setFirstTime(state) {
      state.isFirstTime = false;
    },
    toggleUserType(state) {
      state.userType = state.userType == 'user' ? 'owner' : 'user';
    },
  },
});

export const { setFirstTime, toggleUserType } = settingsSlice.actions;
export default settingsSlice.reducer;
