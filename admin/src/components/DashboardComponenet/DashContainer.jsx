import React, { useEffect } from "react";
import DashboardStatsGrid from "./dashboardState";
import TransactionChart from './AnalysChart'
import PopularProducts from "./PopulateProducts";
import Table from "./RecentOrder";
import { useDispatch, useSelector } from "react-redux";
import { GetOrders, ordersAnalys } from "@/services/reducer/orderSlice";
import OrderChart from "./OrderChart";
import { GetAllUsers } from "@/services/reducer/userSlice";
import { CountProducts, selectCountProduct } from "@/services/reducer/productSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const countOrder = useSelector((state) => state.orders.orderCount);
    const users = useSelector((state) => state.user.Users);
    const Analys = useSelector((state) => state.orders.ordersAnalys);
    const countProduct = useSelector(selectCountProduct);
    useEffect(() => {
        dispatch(GetOrders());
        dispatch(ordersAnalys())
        dispatch(GetAllUsers())
        dispatch(CountProducts())
    }, [dispatch]);
    // Data processing to categorize orders
    const safeUsers = Array.isArray(users) ? users : [];
    const safeOrders = Array.isArray(orders) ? orders : [];
    const Customer = safeUsers.reduce((acc, user) => user.isAdmin === false ? acc + 1 : acc, 0);
    const completedOrders = safeOrders.reduce((acc, ord) => ord.status === "Completed" ? acc + 1 : acc, 0);
    const { Completed, Pending, Rejected, Stock_Not_Available } = categorizeOrders(safeOrders);
    return (
        <div className="admin-page">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Overview</p>
                <h1 className="admin-title mt-2">Dashboard</h1>
                <p className="admin-subtitle">Monitor catalog health, customer activity, and order momentum.</p>
            </div>
            < DashboardStatsGrid customer={Customer} CountProducts={countProduct} orders={countOrder} completedOrders={completedOrders} />

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
                <div className="xl:col-span-1">
                    <OrderChart
                        Rejected={Rejected}
                        Pending={Pending}
                        Stock_Not_Available={Stock_Not_Available}
                        Completed={Completed}
                    />
                </div>
                <div className="xl:col-span-2">
                    <TransactionChart data={Analys} />
                </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <Table />
                </div>
                <div className="xl:col-span-1">
                    <PopularProducts />
                </div>
            </div>
        </div>
    );
};

// Function to categorize orders based on their status
const categorizeOrders = (orders) => {
    let Completed = 0;
    let Pending = 0;
    let Rejected = 0;
    let Stock_Not_Available = 0;

    orders.forEach(order => {
        switch (order.status) {
            case "Completed":
                Completed++;
                break;
            case "Pending":
                Pending++;
                break;
            case "Rejected":
                Rejected++;
                break;
            case "Stock Not Available":
                Stock_Not_Available++;
                break;
            default:
                break;
        }
    });

    return { Completed, Pending, Rejected, Stock_Not_Available };
};

export default Dashboard;
