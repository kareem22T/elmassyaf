import { api } from '@/API';
import { API_URL } from '@/globals/globals';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the types for the chat and state
interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string;
    created_at: string;
    updated_at: string;
    is_phone_verified_for_web_registeration: number;
    verification_code: string | null;
    current_code_expired_at: string | null;
}

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
    password: string;
    is_phone_verified: number;
    remember_token: string | null;
    verification_code: string | null;
    current_code_expired_at: string | null;
    member_role: string;
    company_id: number;
}

interface Chat {
    id: number;
    user_id: number;
    employee_id: number;
    created_at: string;
    updated_at: string;
    unseen_by_user: number;
    unseen_by_employee: number;
    user: User;
    employee: Employee;
    latest_msg: string;
    latest_msg_date: string;
}


interface ChatState {
    chats: Chat[];
    loading: boolean;
    error: string | null;
    selectedChat: Chat | null; // Add selected chat property
    selectedChatToggeled: boolean; // Add selected chat property
}

// Initial state
const initialState: ChatState = {
    chats: [],
    loading: false,
    error: null,
    selectedChat: null,
    selectedChatToggeled: false,
};

// Async thunk to fetch chats
export const fetchChats = createAsyncThunk('chats/fetchChats', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL + '/api/chat?type=employee');
        return response.data.data as Chat[];
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
});
const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setUnseenByUser: (state, action: PayloadAction<{ chatId: number; unseenCount: number }>) => {
            const { chatId, unseenCount } = action.payload;
            const chat = state.chats.find((c) => c.id === chatId);
            if (chat) {
                chat.unseen_by_employee = unseenCount;
            }
        },
        setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
            state.selectedChat = action.payload; // Update the selected chat
        },
        clearSelectedChat: (state) => {
            state.selectedChat = null; // Clear the selected chat
        },
        setSelectedChatToggeled: (state) => {
            state.selectedChatToggeled = !state.selectedChatToggeled; // Clear the selected chat
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUnseenByUser, setSelectedChat, clearSelectedChat, setSelectedChatToggeled } = chatSlice.actions;
export default chatSlice.reducer;