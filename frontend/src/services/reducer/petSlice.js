import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "@/services/api";

export const addPet = createAsyncThunk("pets/addPet", async (newPet, { rejectWithValue }) => {
  try {
    const response = await api.post("/pets", newPet);
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const petSlice = createSlice({
  name: "pets",
  initialState: {
    value: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.data) {
          state.value.push(action.payload.data);
        }
      })
      .addCase(addPet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default petSlice.reducer;
