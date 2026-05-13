import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "@/services/api";

const initialState = {
  product: [],
  categories: [],
  isLoading: false,
  loading: false,
  isError: null,
  error: null,
  productDetails: null,
  totalPages: 1,
  search: "",
  filters: {},
  sort: "",
};

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async ({ page = 1, search = "", filters = {}, sort = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", {
        params: {
          page,
          limit: 8,
          search,
          sort,
          filters: JSON.stringify(filters),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const fetchProductById = createAsyncThunk("product/fetchProductById", async ({ productId }, { rejectWithValue }) => {
  try {
    if (!productId) {
      return rejectWithValue("Product id is required");
    }
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const fetchCategories = createAsyncThunk("product/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/categories");
    return response.data.categories;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.isError = null;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loading = false;
        state.product = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.loading = false;
        state.isError = action.payload;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetails = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
      });
  },
});

export const { setSearch, setFilter, setSort } = productSlice.actions;
export default productSlice.reducer;
