import { api } from "@/API";
import { API_URL } from "@/globals/globals";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Toast from "react-native-toast-message";

const UNIT_API_URL = API_URL + '/api/owner/units'

// Define the Unit type
interface Unit {
  id?: number;
  type: string;
  city_id: string;
  unit_type_id: string;
  [key: string]: any; // Allow dynamic properties
}

interface UnitsState {
  units: Unit[];
  unit: Unit | null;
  loading: boolean;
  error: string | null;
}

const initialState: UnitsState = {
  units: [],
  unit: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUnits = createAsyncThunk("units/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(UNIT_API_URL);
    
    return response.data.units;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

export const fetchUnitById = createAsyncThunk("units/fetchById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.get(`${UNIT_API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

export const addUnit = createAsyncThunk("units/add", async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await api.post(UNIT_API_URL  + '/store', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

export const updateUnit = createAsyncThunk("units/update", async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
  try {
    const response = await api.post(`${UNIT_API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

export const deleteUnit = createAsyncThunk("units/delete", async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`${UNIT_API_URL}/${id}`);
    Toast.show({
      type: 'success',
      text1: 'رسالة نجاح',
      text2: `تم حذف الوحدة بنجاح`,
      position: 'top',
      visibilityTime: 3000,
    }
      
    )
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

// Slice
const unitSlice = createSlice({
  name: "units",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUnitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnitById.fulfilled, (state, action) => {
        state.loading = false;
        state.unit = action.payload;
      })
      .addCase(fetchUnitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUnit.fulfilled, (state, action) => {
          state.units.push(action.payload);
          state.loading = false;
      })
    .addCase(addUnit.pending, (state) => {
        state.loading = true;
      })
    .addCase(addUnit.rejected, (state) => {
        state.loading = false;
      })

    .addCase(updateUnit.pending, (state) => {
        state.loading = true;
      })
    .addCase(updateUnit.rejected, (state) => {
        state.loading = false;
      })

      .addCase(updateUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.units = state.units.map((unit) => (unit.id === action.payload.id ? action.payload : unit));
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.units = state.units.filter((unit) => unit.id !== action.payload);
      });
  },
});

export default unitSlice.reducer;
