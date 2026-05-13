import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/services/reducer/authSlice";
import cartReducer from "@/services/reducer/cartSlice";
import orderReducer from "@/services/reducer/orderSlice";
import petReducer from "@/services/reducer/petSlice";
import productReducer from "@/services/reducer/productSlice";
import wishReducer from "@/services/reducer/wishSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: orderReducer,
    pets: petReducer,
    product: productReducer,
    wish: wishReducer,
  },
});
