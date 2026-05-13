import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../api";

const initialState = {
  product: [],
  categories: [],
  isLoading: false,
  isError: null,
  productDetails: null,
  count: 0,
  totalAmount: 0,
  ordersCount: 0,
  totalPages: 1,
  search: "",
  filters: {},
  sort: "",
};
export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async ({ page, search, filters, sort }, { rejectWithValue }) => {
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
export const fetchProductAdmin = createAsyncThunk(
  'products/fetchProductAdmin',
  async ({ page, limit, search, petCategory }) => {
    try {
      const response = await api.get("/products/admin", {
        params: {
          page,
          limit,
          search,
          petCategory, // Include petCategory parameter in the API request
        },
      });
      return response.data;
    } catch (error) {
      throw Error(getApiError(error));
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async ({ productId }) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  }
);
export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await api.get("/categories");
    return response.data.categories;
  }
);

// Count Product

export const CountProducts = createAsyncThunk(
  "product/CountProducts",
  async () => {
    const response = await api.get("/products/count");
    return response.data.count;

})

// Count Order

export const CountOrders = createAsyncThunk("product/CountOrders", async () => {
  const response = await api.get("/orders/count");
  return response.data;
});

//Count total Amount

export const CountTotalAmount = createAsyncThunk(
  "product/CountTotalAmount",
  async () => {
    const response = await api.get("/orders/totalAmount");
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter(state, action) {
      state.filters = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.data || [];
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(fetchProductAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProductAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.data || [];
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      // Count Product
      .addCase(CountProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(CountProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload;
      })
      .addCase(CountProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // Count Orders
      // Count Orders
      .addCase(CountOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(CountOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersCount = action.payload;
      })
      .addCase(CountOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // Count Total Amount
      .addCase(CountTotalAmount.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(CountTotalAmount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalAmount = action.payload;
      })
      .addCase(CountTotalAmount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      }) // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export const selectError = (state) => state.product.isError;
export const selectIsLoading = (state) => state.product.isLoading;
export const selectProduct = (state) => state.product;
export const selectProductDetails = (state) => state.product.productDetails;
export const selectCountProduct = (state) => state.product.count;
export const selectCountOrders = (state) => state.product.ordersCount;
export const selectTotalAmount = (state) => state.product.totalAmount;
export const selectTotalPages = (state) => state.product.totalPages;


export const { setSearch, setFilter, setSort } = productSlice.actions;
export default productSlice.reducer;
