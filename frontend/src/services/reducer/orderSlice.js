import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "@/services/api";

export const postOrder = createAsyncThunk("order/postOrder", async ({ products }, { rejectWithValue }) => {
  try {
    const response = await api.post("/orders", { products });
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    isLoading: false,
    isError: null,
    checkoutUrl: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.checkoutUrl = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checkoutUrl = action.payload?.url || null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export default orderSlice.reducer;
