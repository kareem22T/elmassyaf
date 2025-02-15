import { api } from "@/API";
import { API_URL } from "@/globals/globals";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = API_URL + '/api';

// Fetch all chats
export const fetchChats = createAsyncThunk("chats/fetchChats", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_BASE_URL}/chats`);
        return response.data.chats;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Fetch messages for a specific chat
export const fetchMessages = createAsyncThunk("chats/fetchMessages", async (chatId: number, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_BASE_URL}/chats/${chatId}/messages`);
        return response.data.messages;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Send a message
export const sendMessage = createAsyncThunk("chats/sendMessage", async ({ message, receiver_id }: { message: string; receiver_id: number }, { rejectWithValue }) => {
    try {
        const response = await api.post(`${API_BASE_URL}/chats/send-message`, { message, receiver_id });
        
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Mark messages as seen
export const markMessagesAsSeen = createAsyncThunk("chats/markMessagesAsSeen", async (chatId: number, { rejectWithValue }) => {
    try {
        const response = await api.post(`${API_BASE_URL}/chats/${chatId}/seen-messages`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Delete a chat
export const deleteChat = createAsyncThunk("chats/deleteChat", async (chatId: number, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/chats/${chatId}`);
        return { chatId, message: response.data.message };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

interface ChatState {
    chats: any[];
    messages: any;
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chats: [],
    messages: [],
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {},
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
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messages = [];
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.chats = state.chats.filter((chat) => chat.id !== action.payload.chatId);
            });
    },
});

export default chatSlice.reducer;
