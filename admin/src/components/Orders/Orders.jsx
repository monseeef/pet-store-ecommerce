import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, ClipboardList, Eye, Save, Search, Trash2 } from "lucide-react";
import api from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // Default limit
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  const [sortBy, setSortBy] = useState(""); // State to hold current sorting option
  const [sortOrder, setSortOrder] = useState(1); // State to hold sorting order (1 for ascending, -1 for descending)
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/orders", {
        params: { page: currentPage, limit, search: searchTerm, sortBy, sortOrder },
      });
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, limit, searchTerm, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (confirmDelete) {
        setError("");
        await api.delete(`/orders/${id}`);
        fetchOrders();
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to delete order.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleDateString();
  };
  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      // If already sorting by the same key, toggle the sorting order
      setSortOrder(sortOrder === 1 ? -1 : 1);
    } else {
      // If sorting by a different key, set the new key and default to ascending order
      setSortBy(key);
      setSortOrder(1);
    }
  };

  const handleStatusChange = (orderId, event) => {
    const newStatus = event.target.value;
    setSelectedStatus({ ...selectedStatus, [orderId]: newStatus });
  };

  const updateOrderStatus = async (orderId) => {
    try {
      const newStatus = selectedStatus[orderId];
      if (!newStatus) {
        setError("Choose a status before saving.");
        return;
      }
      setError("");
      await api.put(`/orders/${orderId}`, {
        status: newStatus,
      });
      // Optionally, you can fetch orders again to refresh the data after updating status
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to update order status.");
    }
  };

  return (
    <div className="admin-page">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-title">Orders</h3>
              <p className="admin-subtitle">Review customer orders and update fulfillment status.</p>
            </div>
          </div>
          <div className="p-5">
          <div className="admin-toolbar mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="mr-5">
                <span className="text-sm text-slate-500">Items per page:&nbsp;</span>
                <select
                  className="admin-select"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <Search className="h-4 w-4 text-amber-700" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="admin-input w-full ps-10 sm:w-72"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="admin-table-wrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Customer</TableHead>
                  <TableHead scope="col">Products</TableHead>
                  <TableHead scope="col">Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead onClick={() => handleSort("orderDate")}>
                    Date{" "}
                    {sortBy === "orderDate" && (sortOrder === 1 ? "▲" : "▼")}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="admin-empty-state">Loading orders...</div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="admin-empty-state">
                        <ClipboardList className="mx-auto mb-3 h-8 w-8 text-amber-600" />
                        No orders found.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && orders.map((order) => (
                  <TableRow key={order._id} className="">
                    <TableCell>{order.customer?.username || "Unknown customer"}</TableCell>
                    {/* Display product details here */}
                    <TableCell>
                      <ul>
                        {(order.products || []).map((product, index) => (
                          <li key={product._id || product.product?._id || index}>
                            <span>{product.product?.name || "Unknown product"}</span>{" "}
                            <b>
                              x<span>{product.quantity}</span>
                            </b>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className=" text-lg">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <div className="flex">
                        <select
                          value={selectedStatus[order._id] || order.status}
                          onChange={(e) => handleStatusChange(order._id, e)}
                          className={`admin-select min-w-36 ${
                            order.status === "Pending"
                              ? "bg-yellow-400/30 text-orange-400"
                              : order.status === "Completed"
                              ? "bg-green-500/30 text-green-500"
                              : order.status === "Rejected"
                              ? "bg-red-500/30 text-red-500"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <button aria-label={`Save status for order ${order.orderId || order._id}`} className="admin-icon-button ml-2" onClick={() => updateOrderStatus(order._id)}>
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/orders/${order._id}`}
                        className="admin-icon-button"
                        aria-label={`View order ${order.orderId || order._id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="admin-icon-button-danger"
                        aria-label={`Delete order ${order.orderId || order._id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-primary hover:bg-secondary text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div> */}

          <div className="flex justify-center gap-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="admin-button-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`admin-pagination-button ${
                    currentPage === index + 1
                      ? "admin-pagination-button-active"
                      : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="admin-button-secondary"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Orders;
