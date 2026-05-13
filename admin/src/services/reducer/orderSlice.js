// orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const initialState = {
    orders: [],
    recentorders: [],
    mostPopularProduct: null,
    ordersAnalys : [],
    orderCount: 0,
    isLoading: false,
    isError: null,
}
export const GetOrders = createAsyncThunk("orders/getOrders", async () => {
    try {
        const response = await api.get("/orders/");
        return response.data;
    } catch (error) {
        throw error;
    }
});


export const ordersAnalys = createAsyncThunk("orders/analys", async () => {
    try {
        const response = await api.get("/orders/analys");
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const RecentOrders = createAsyncThunk("orders/getRecentOrders", async () => {
    try {
        const response = await api.get("/orders/RO");
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const mostPopularProduct = createAsyncThunk("orders/getPopularProducts", async () => {
    try {
        const response = await api.get("/products/populare");
        return response.data;
    } catch (error) {
        throw error;
    }
});
export const postOrder = createAsyncThunk('order/postOrder', async ({ products }) => {
    const payload = { products };

    try {
        const response = await api.post("/orders", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
});



export const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetOrders.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(GetOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = Array.isArray(action.payload.orders) ? action.payload.orders : [];
                state.orderCount = action.payload.orderCount || state.orders.length;
            })
            .addCase(GetOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.error.message; // Update with error message
            })
            .addCase(RecentOrders.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(RecentOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recentorders = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(RecentOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.error.message; // Update with error message
            })
            .addCase(mostPopularProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(mostPopularProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mostPopularProduct = action.payload;
            })
            .addCase(mostPopularProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.mostPopularProduct = null;
                state.isError = action.error.message; // Update with error message
            })
            .addCase(ordersAnalys.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(ordersAnalys.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ordersAnalys = action.payload;
            })
            .addCase(ordersAnalys.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.error.message; // Update with error message
            })
            .addCase(postOrder.fulfilled, (state, action) => {
                window.location.href = action.payload.url; // Redirect to Stripe checkout
            })
            .addCase(postOrder.rejected, (state, action) => {
                state.isError = action.error.message;
            });
    },
});



export default orderSlice.reducer;
