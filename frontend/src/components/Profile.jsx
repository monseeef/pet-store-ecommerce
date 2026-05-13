import { CalendarDays, PackageCheck, PawPrint, ShoppingCart } from "lucide-react";
import profileImage from "../assets/Profile.jpg";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fetchUser } from "@/services/reducer/authSlice";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "@/services/api";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.auth);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [pets, setPets] = useState([]);

  const getPets = async (id) => {
    try {
      const response = await api.get(`/pets/customers/${id}`);
      setPets(response.data);
    } catch {
      setPets([]);
    }
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrdersLoading(false);
      return;
    }
    const getOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const response = await api.get("/orders/my/list");
        setOrders(response.data.orders || []);
      } catch (error) {
        setOrdersError(
          error.response?.data?.message || error.message || "Unable to load orders"
        );
      } finally {
        setOrdersLoading(false);
      }
    };
    getOrders();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      getPets(user._id);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="pet-page">
        <Navbar />
        <main className="pet-container py-16">
          <div className="pet-card p-10 text-center">
            <h1 className="text-3xl font-black text-slate-950">
              Sign in to view your profile
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-slate-500">
              Your account, pets, and order history are available after login.
            </p>
            <Link className="pet-button-primary mx-auto mt-6 w-fit" to="/login">
              Sign in
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pet-page">
      <Navbar user={user} />
      <main className="pet-container py-8 sm:py-12">
        <div className="mb-8">
          <p className="pet-eyebrow">Account</p>
          <h1 className="pet-title text-4xl sm:text-5xl">Your pet care hub</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <section className="pet-card p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-amber-100">
                  <AvatarImage alt={user?.username || "Profile"} src={profileImage} />
                  <AvatarFallback>{user?.username?.slice(0, 2)?.toUpperCase() || "PS"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {user?.username || "Pet Store Customer"}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    {user?.email || "Signed-in customer"}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                    Role
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-slate-950">
                    {user?.isAdmin ? "Admin" : "Customer"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Orders
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-slate-950">
                    {orders.length}
                  </p>
                </div>
              </div>
            </section>

            <section className="pet-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-950">Pets</h2>
                <PawPrint className="h-5 w-5 text-amber-600" />
              </div>
              {pets.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div className="text-center" key={pet._id}>
                      <img
                        alt={pet.name || "Pet"}
                        className="mx-auto aspect-square w-24 rounded-full object-cover ring-4 ring-amber-50"
                        onError={(event) => {
                          event.currentTarget.src = "/product-placeholder.svg";
                        }}
                        src={pet.image || "/product-placeholder.svg"}
                      />
                      <h3 className="mt-3 text-sm font-extrabold text-slate-950">
                        {pet.name || "Pet"}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {pet.CategoryName || "Companion"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  No pets found yet.
                </p>
              )}
            </section>
          </aside>

          <section className="pet-card p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Orders</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Recent purchases and checkout history.
                </p>
              </div>
              <PackageCheck className="h-7 w-7 text-amber-600" />
            </div>

            {ordersLoading && (
              <p className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Loading orders...
              </p>
            )}

            {!ordersLoading && ordersError && (
              <p className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700">
                {ordersError}
              </p>
            )}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <div className="rounded-2xl bg-amber-50 p-8 text-center">
                <ShoppingCart className="mx-auto h-9 w-9 text-amber-700" />
                <h3 className="mt-3 text-lg font-black text-slate-950">
                  No orders yet
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Your completed checkouts will appear here.
                </p>
              </div>
            )}

            {!ordersLoading && !ordersError && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article
                    className="rounded-2xl border border-amber-100 bg-white p-4"
                    key={order._id}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-950">
                            {order.products?.[0]?.product?.name || "Order"}
                          </h3>
                          <p className="text-sm font-semibold text-slate-500">
                            ${Number(order.totalAmount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        {order.orderDate
                          ? format(new Date(order.orderDate), "dd MMM yyyy")
                          : "Date unavailable"}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
