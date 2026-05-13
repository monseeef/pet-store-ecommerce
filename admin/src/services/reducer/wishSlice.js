import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api";

// Thunks for async operations
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async () => {
    const response = await api.get("/wishes");
    return response.data;
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ productId }) => {
    const response = await api.post(`/wishes/${productId}`);
    return response.data;
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({ productId }) => {
    const response = await api.delete(`/wishes/${productId}`);
    return response.data;
});

// Slice
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products || [];
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            });
    },
});

export default wishlistSlice.reducer;
