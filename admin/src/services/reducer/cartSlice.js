import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api";

// Thunks for async operations
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await api.get("/cart");
    return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }) => {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
});

export const updateCart = createAsyncThunk('cart/updateCart', async ({ items }) => {
    const response = await api.put("/cart", { items });
    return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId }) => {
    const response = await api.delete(`/cart/me/${productId}`);
    return response.data;
});

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
    const response = await api.delete("/cart");
    return response.data;
  });

export const decreaseQuantity = createAsyncThunk('cart/decreaseQuantity', async ({ productId }) => {
const response = await api.put("/cart/me/decrease", { productId });
return response.data;
});

export const increaseQuantity = createAsyncThunk('cart/increaseQuantity', async ({ productId }) => {
const response = await api.put("/cart/me/increase", { productId });
return response.data;
});
// Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        bill: 0,
        status: 'idle',
        error: null,
    },
    reducers: {
        // clearCart: (state) => {
        //     state.items = [];
        //     state.bill = 0;
        // },
        // decreaseQuantity(state, action) {
        //     const { productId } = action.payload;
        //     const existingItem = state.items.find((item) => item.product._id === productId);
        //     if (existingItem && existingItem.quantity > 1) {
        //       existingItem.quantity--;
        //     }
        //   },
        //   increaseQuantity(state, action) {
        //     const { productId } = action.payload;
        //     const existingItem = state.items.find((item) => item.product._id === productId);
        //     if (existingItem) {
        //       existingItem.quantity++;
        //     }
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.bill = action.payload.bill;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.bill = action.payload.bill;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.bill = action.payload.bill;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.bill = action.payload.bill;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.bill = 0;
            })
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.bill = action.payload.bill;
            })
            .addCase(increaseQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.bill = action.payload.bill;
            });
    },
});

// export const { clearCart, decreaseQuantity, increaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
