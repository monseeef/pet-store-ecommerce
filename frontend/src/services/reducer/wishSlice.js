import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "@/services/api";

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/wishes");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async ({ productId }, { rejectWithValue }) => {
  try {
    await api.post(`/wishes/${productId}`);
    const response = await api.get("/wishes");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async ({ productId }, { rejectWithValue }) => {
  try {
    await api.delete(`/wishes/${productId}`);
    const response = await api.get("/wishes");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.products || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      });
  },
});

export default wishlistSlice.reducer;
