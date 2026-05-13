import React, { useEffect } from "react";
import ProductList from "./Product/ProductList";
import UserList from "./User/UserList";
import Orders from "./Orders/Orders";
import { CountUsers } from "../services/reducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Card10 from "./DashboardCard10";

import { fetchCategories } from "../services/reducer/categorySlice";
import {
  CountProducts,
  CountOrders,
  CountTotalAmount,
} from "../services/reducer/productSlice";
import ChartComponent from "../services/ChartComponent";
import { useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.CountUsers);
  const products = useSelector((state) => state.product.count);
  const orders = useSelector((state) => state.product.ordersCount);
  const totalAmount = useSelector((state) => state.product.totalAmount);

  useEffect(() => {
    dispatch(CountUsers());
    dispatch(CountProducts());
    dispatch(CountOrders());
    dispatch(CountTotalAmount());
  }, []);
  //count users
  const countUsers = users ? users : 0;

  //count orders
  const CountOrder = orders ? orders : 0;

  //count total amount
  const CountAmount = totalAmount ? totalAmount : 0;

  //count products
  const CountProduct = products.count ? products.count : 0;

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get("/products/products-per-category")
      .then((response) => response.data)
      .then((data) => {
        const transformedData = data.map((item) => ({
          _id: item._id,
          totalProducts: item.totalProducts,
          name: item.name,
        }));
        setChartData(transformedData);
      })
  }, []);

  return (
    <div className="bg-primary min-h-screen">
      <div className="p-4 sm:ml-64">
        <div className="bg-white p-4 shadow-md sm:rounded-lg mb-4">
          <h1 className="text-3xl">Dashboard</h1>

          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <div className="text-xl font-bold">100</div>
            </div>
            <div className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
              <div className="text-xl font-bold">50</div>
            </div>
            <div className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <div className="text-xl font-bold">200</div>
            </div>
          </div> */}

          <div className="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-4 sm:px-8">
            <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <div className="px-4 text-gray-700">
                <h3 className="text-sm tracking-wider">Users</h3>
                <p className="text-3xl">{countUsers}</p>
              </div>
            </div>
            <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  ></path>
                </svg>
              </div>
              <div className="px-4 text-gray-700">
                <h3 className="text-sm tracking-wider">Products</h3>
                <p className="text-3xl">{CountProduct}</p>
              </div>
            </div>
            <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-indigo-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  ></path>
                </svg>
              </div>
              <div className="px-4 text-gray-700">
                <h3 className="text-sm tracking-wider">Orders</h3>
                <p className="text-3xl">{CountOrder}</p>
              </div>
            </div>
            <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-4 bg-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  ></path>
                </svg>
              </div>
              <div className="px-4 text-gray-700">
                <h3 className="text-sm tracking-wider">Total Amount</h3>
                <p className="text-3xl">{CountAmount} $</p>
              </div>
            </div>
          </div>
        </div>

        <ChartComponent className="mt-5" data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
