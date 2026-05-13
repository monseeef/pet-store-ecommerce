import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "@/services/api";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  userId: localStorage.getItem("userId") || null,
  auth: null,
  isLoading: false,
  isError: null,
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/profile");
    return response.data.data;
  } catch (error) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    return rejectWithValue(getApiError(error));
  }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", data);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", response.data.userId);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/logout");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/forgotPassword", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const passwordReset = createAsyncThunk("auth/passwordReset", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put(`/auth/passwordReset/${data.token}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.userId = action.payload?._id || state.userId;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.auth = null;
        state.isAuthenticated = false;
        state.userId = null;
        state.isError = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload.user;
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.auth = null;
        state.isAuthenticated = false;
        state.userId = null;
      });
  },
});

export const selectUserId = (state) => state.auth.userId;
export const selectAuth = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.auth;
export const selectLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.isError;

export default authSlice.reducer;
