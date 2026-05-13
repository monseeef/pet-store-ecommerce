import "./App.css";
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./components/ForgotPassword";
import Contact from "./pages/Contact";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/Products/ProductDetails";
import PetsDetails from "./pages/Pets/PetsDetails";
import Pets from "./pages/Pets/Pets";

import ProfilePage from "./components/Profile";

import Wishlist from "./pages/Wishlist";
import CartShopping from "./pages/CartShopping";
import { fetchUser } from "@/services/reducer/authSlice";
import { fetchCart } from "@/services/reducer/cartSlice";
import { fetchWishlist } from "@/services/reducer/wishSlice";


const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, userId]);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/:id" element={<PetsDetails />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<CartShopping />} />
        <Route path="/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;
