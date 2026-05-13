import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import api, { getApiError } from "../api";


const initialState = {
    totalPages: 0,
    currentPage: 1,
    allUsers: [],
    Users : [],
    isLoading: false,
    isError: null,
    CountUsers:0
}

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    const response = await api.get("/auth/profile");
    return response.data.data;
})

export const getAllUsers = createAsyncThunk("user/getALLUsers", async (data) => {
    const { currentPage, limit, searchTerm, sortBy, sortOrder } = data;
    const response = await api.get("/users", {
        params: { page: currentPage, limit, search: searchTerm, sortBy, sortOrder }
    });
    return response.data;
})




export const createUser = createAsyncThunk("user/createUser", async (data) => {
    try {
    const response = await api.post("/users/",data);

    return response.data;
    } catch (error) {
        return getApiError(error)
    }
})


export const updateUser = createAsyncThunk("user/updateUser", async (data) => {
    const response = await api.put(`/users/${data.id}`,data);
    return response.data;
})

export const deleteUser = createAsyncThunk("user/deleteUser", async (data) => {
    await api.delete(`/users/${data}`);
    return { _id: data };

})
export const CountUsers = createAsyncThunk("user/CountUsers", async () => {
    const response = await api.get("/users/count");
    return response.data;

})
export const GetAllUsers = createAsyncThunk("auth/users",async () =>{
    try {
      const response = await api.get("/users/users")
      return response.data
    } catch (error) {
    }
  })

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //GetAll users
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = action.payload.users;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;

            })
            // Get users without the pagination
            .addCase(GetAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
            .addCase(GetAllUsers.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(GetAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            //Create user
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = [...state.allUsers, action.payload];
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
            //Update user
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = state.allUsers.map((user) => user._id === action.payload._id ? action.payload : user);
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
            //Delete user
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;              
                state.allUsers = state.allUsers.filter((user) => user._id !== action.payload._id);
            })  
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
            //Count users
            .addCase(CountUsers.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(CountUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.CountUsers = action.payload;
            })
            .addCase(CountUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })


    },
})

export const authActions = {
    fetchUser,
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
    CountUsers

}

export const selectUser = (state) => state.user.user;

export const selectAllUsers = (state) => state.user.allUsers;
export const selectCurrentPage  = (state) => state.user.currentPage ;

export const selectCountUsers = (state) => state.user.CountUsers;

export const selectLoading = (state) => state.loading;
export const selectError = (state) => state.error;
//Thunk actions
export default userSlice.reducer
