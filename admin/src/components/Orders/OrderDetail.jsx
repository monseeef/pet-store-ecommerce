import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError("");
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Unable to load order.");
      }
    };
    fetchOrder();
  }, [id]);

  if (error) {
    return <div className="admin-page text-sm text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="admin-page text-sm text-slate-500">Loading order...</div>;
  }

  const customerName = order.customer?.username || "Unknown customer";
  const products = Array.isArray(order.products) ? order.products : [];
  const orderDate = new Date(order.orderDate);
  const totalAmount = `$${Number(order.totalAmount || 0).toFixed(2)}`;

  return (
    <div className="admin-page">
        <div className="admin-card p-5">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="admin-title">Order Details</h2>
              <p className="admin-subtitle">{customerName}&apos;s order</p>
            </div>
            <Link className="admin-button-secondary" to="/orders">
              Back
            </Link>
          </div>
          <div className="flex flex-col justify-between items-center mb-4">

                <h2 className="px-6 py-3 text-2xl font-semibold text-slate-950">{customerName}&apos;s Order</h2>
              
                <div className="px-6 py-3 w-full">
                  {/* <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Product Name</th>
                        <th className="text-left">Quantity</th>
                        <th className="text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product) => (
                        <tr key={product._id}>
                          <td>{product.product.name}</td>
                          <td>x{product.quantity}</td>
                          <td>${product.product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 "
                        >
                          Product name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 "
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 "
                        >
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No products found for this order.
                        </td>
                      </tr>
                    )}
                    {products.map((product, index) => (
                      <tr key={product._id || product.product?._id || index}>
                        <td
                          scope="row"
                          className="px-6 py-4 text-slate-900 whitespace-nowrap "
                        >
                          {product.product?.name || "Unknown product"}
                        </td>
                        <td className="px-6 py-4 ">
                          ${Number(product.product?.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 ">
                          {product.quantity || 0}
                        </td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>
              
              <div className="text-md text-slate-700 flex items-center justify-center ">
                <h2>Total Amount:</h2>
                <div className="px-6 py-3 font-bold">{totalAmount}</div>
              </div>
                <div className="flex items-center justify-center gap-5">
                <h2>Payment status: </h2>
                  <div
                    className={`py-1 flex justify-center rounded-3xl px-4 ${
                      order.status === "Pending"
                        ? "bg-yellow-400/30 text-orange-400"
                        : order.status === "Completed"
                        ? "bg-green-500/30 text-green-500"
                          : order.status === "Rejected"
                        ? "bg-red-500/30 text-red-500"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
            
                <div className="px-6 py-3 flex items-center justify-center gap-5">
                <h2>Order Date: </h2>
                <div className="px-6 py-3">{Number.isNaN(orderDate.getTime()) ? "Unknown date" : orderDate.toLocaleString()}</div>
                </div>
          </div>
        </div>
    </div>
  );
};

export default OrderDetail;
