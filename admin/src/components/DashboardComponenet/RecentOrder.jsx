
import React, { useEffect } from "react";
import { format } from "date-fns";
import { getOrderStatus2 } from "../../lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { RecentOrders } from "@/services/reducer/orderSlice";


export default function Table() {
    const dispatch = useDispatch();
    const LastOrders = useSelector(state => state.orders.recentorders);
    useEffect(() => {
        dispatch(RecentOrders());
    }, [dispatch]); 
  return (
    <div className="admin-card flex-1 w-full p-4">
      <strong className="font-semibold text-slate-800">Recent Orders</strong>
      <div className="admin-table-wrap mt-3">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="font-semibold py-3 px-2.5 text-sm text-left border-y">Customer Name</th>
              <th className="font-semibold py-3 px-2.5 text-sm text-left border-y">Order Date</th>
              <th className="font-semibold py-3 px-2.5 text-sm text-left border-y">Order Total</th>
              <th className="font-semibold py-3 px-2.5 text-sm text-left border-y">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {LastOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="py-3 px-2.5 text-sm text-center border-y border-gray-200 text-gray-500">
                  No recent orders.
                </td>
              </tr>
            )}
            {LastOrders.map((order) => {
              const orderDate = new Date(order.orderDate);
              return (
              <tr key={order._id || order.orderId}>
                <td className="py-3 px-2.5 text-sm text-left border-y border-gray-200">
                    {order.customer?.firstName || order.customer?.username || "Unknown customer"}
                </td>
                <td className="py-3 px-2.5 text-sm text-left border-y border-gray-200">{Number.isNaN(orderDate.getTime()) ? "Unknown date" : format(orderDate, "dd MMM yyyy")}</td>
                <td className="py-3 px-2.5 text-sm text-left border-y border-gray-200">{Number(order.totalAmount || 0).toFixed(2)}</td>
                <td className="py-3 px-2.5 text-sm text-left border-y border-gray-200">{getOrderStatus2(order.status)}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

