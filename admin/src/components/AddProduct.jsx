import React, { useEffect, useState } from "react";
import api from "../services/api";

const AddProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const addProducts = async () => {
      try {
        const response = await api.post("/products"); // Adjust the endpoint URL as per your backend setup
        setProducts(response.data);
      } catch (error) {
      }
    };
    addProducts();
  }, []);
  return (
    <div className="h-screen flex justify-center bg-primary bg-opacity-50">
      <div className="m-5 p-5 w-[75%] text-center bg-white">
        <h1 className="text-xl">Add Product</h1>
      </div>
    </div>
  );
};

export default AddProduct;
