// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../api";

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  userId: localStorage.getItem('userId') || null,
  role: localStorage.getItem('role') === 'true',
  auth: null,
  isLoading: false,
  isError: null,
  admin: localStorage.getItem('role') === 'true',
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/profile");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", data);

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('role', String(Boolean(response.data.role)));

    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
  const response = await api.get("/auth/logout");
  return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  } finally {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  }
});

export const forgotPassword = createAsyncThunk ("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/forgotPassword", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }

})

export const passwordReset = createAsyncThunk ("auth/passwordReset", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put(`/auth/passwordReset/${data.token}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
})

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", data);
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
      //Login auth
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload.success) {
          state.auth = action.payload.user;
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
          state.role = Boolean(action.payload.role);
          state.admin = Boolean(action.payload.role);
        }
        else {
          state.isError = action.payload
        }
        
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })


      //Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.auth = null;
        state.isAuthenticated = false;
        state.userId = null;
        state.role = false;
        state.admin = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.auth = null;
        state.isAuthenticated = false;
        state.userId = null;
        state.role = false;
        state.admin = false;
      })
      //Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      //Forgot Password
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
      })

      //Password Reset
      .addCase(passwordReset.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(passwordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
      })
      .addCase(passwordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      //Profile
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.userId = action.payload?._id || state.userId;
        state.role = Boolean(action.payload?.isAdmin);
        state.admin = Boolean(action.payload?.isAdmin);
        if (action.payload) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', action.payload._id);
          localStorage.setItem('role', String(Boolean(action.payload.isAdmin)));
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.auth = null;
        state.isAuthenticated = false;
        state.userId = null;
        state.role = false;
        state.admin = false;
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
      });
  },
});

export const authActions = {
  fetchUser,
  login,
  logout,
  register,
  forgotPassword,
  passwordReset,
};

export const selectUser = (state) => state.auth.auth;
export const selectLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.isError;
export const selectAuth = (state) => state.auth.isAuthenticated;
export const selectUserId = (state) => state.auth.userId;

export default authSlice.reducer;
