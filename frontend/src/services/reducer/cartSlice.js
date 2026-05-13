import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import api, { getApiError } from "@/services/api";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    await api.post("/cart", { productId, quantity });
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId }, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/me/${productId}`);
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    const response = await api.delete("/cart");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const decreaseQuantity = createAsyncThunk("cart/decreaseQuantity", async ({ productId }, { rejectWithValue }) => {
  try {
    await api.put("/cart/me/decrease", { productId });
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const increaseQuantity = createAsyncThunk("cart/increaseQuantity", async ({ productId }, { rejectWithValue }) => {
  try {
    await api.put("/cart/me/increase", { productId });
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const applyCart = (state, payload) => {
  state.items = payload?.items || [];
  state.bill = payload?.bill || 0;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    bill: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        applyCart(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(removeFromCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(decreaseQuantity.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(increaseQuantity.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(clearCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addMatcher(
        isAnyOf(
          addToCart.pending,
          removeFromCart.pending,
          decreaseQuantity.pending,
          increaseQuantity.pending,
          clearCart.pending
        ),
        (state) => {
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          addToCart.rejected,
          removeFromCart.rejected,
          decreaseQuantity.rejected,
          increaseQuantity.rejected,
          clearCart.rejected
        ),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;
