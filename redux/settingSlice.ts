import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SettingsState {
  isFirstTime: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  isFirstTime: true,
  loading: false,
  error: null,
};


const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setFirstTime(state, action) {
      state.isFirstTime = action.payload;
    }
  },
});

export const { setFirstTime } = settingsSlice.actions;
export default settingsSlice.reducer;
