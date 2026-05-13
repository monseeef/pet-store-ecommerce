import React,{ useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./components/Product/ProductList";

import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/DashboardComponenet/DashContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import UserList from "./components/User/UserList";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetail from "./components/Orders/OrderDetail";
import UserForm from "./components/User/UserForm";

import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";


import UserDetail from "./components/User/UserDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import CategoryList from "./components/Category/CategoryList";
import CategoryForm from "./components/Category/CategoryForm";
import { CategoryDetails } from "./components/component/CategoryDetails";
import PetComponent from "./components/Pet/PetComponent";
import Profile from "./pages/Profile";


function App() {

  const location = useLocation();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isforgotpassword = location.pathname === "/forgot-password"
  const isresetpassword = location.pathname === "/reset-password"
  

  return (
    <div>
      

      {!isLoginPage && !isRegisterPage && !isforgotpassword && !isresetpassword && <Sidebar />}  
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
            
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:userId/edit" element={<UserForm />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/pets" element={<PetComponent />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/:id/edit" element={<CategoryForm />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*"></Route>

        </Route>
    
        <Route path="/reset-password/:token" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
      </Routes>
    </div>
  );
}

export default App;
