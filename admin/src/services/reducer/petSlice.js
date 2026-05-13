import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "../api";

const initialState = {
  value: [],
  status: "idle",
  error: null,
  totalPages: 0,
  currentPage: 1,
  limit: 5,
};
export const fetchPets = createAsyncThunk(
  "pets/fetchPets",
  async ({ currentPage, limit, search }, { rejectWithValue }) => {
    try {
      const response = await api.get("/pets", {
        params: { page: currentPage, limit, query: search },
      });
      const data = response.data;
      return {
        pets: Array.isArray(data.pets) ? data.pets : [],
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const addPet = createAsyncThunk(
  "pets/addPet",
  async (newPet, { rejectWithValue }) => {
    try {
      const response = await api.post("/pets", newPet);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const updatePet = createAsyncThunk(
  "pets/updatePet",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pets/${formData._id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const deletePet = createAsyncThunk(
  "pets/deletePet",
  async (petId, { rejectWithValue }) => {
    try {
      await api.delete(`/pets/${petId}`);
      return petId;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const petSlice = createSlice({
  name: "pets",
  initialState,
  // reducers: {
  //   addPetToList: (state, action) => {
  //     state.value.push(action.payload);
  //   },
  //   deletePet: (state, action) => {
  //     state.value = state.value.filter((pet) => pet._id !== action.payload);
  //   },
  // },
  extraReducers(builder) {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload.pets;
        state.totalPages = action.payload.totalPages; // Update total pages
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(addPet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.status = "succeeded";
        const addedPet = action.payload?.data || action.payload;
        if (addedPet?._id) {
          state.value.push(addedPet);
        }
      })
      .addCase(addPet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPet = action.payload?.data || action.payload;
        state.value = state.value.map((pet) =>
          pet._id === updatedPet?._id
            ? { ...pet, ...updatedPet }
            : pet
        );
      })

      .addCase(updatePet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deletePet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = state.value.filter((pet) => pet._id !== action.payload);
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default petSlice.reducer;
