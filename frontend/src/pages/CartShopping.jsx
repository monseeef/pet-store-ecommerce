import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  clearCart,
  decreaseQuantity,
  fetchCart,
  increaseQuantity,
  removeFromCart,
} from "@/services/reducer/cartSlice";
import { postOrder } from "@/services/reducer/orderSlice";

export default function CartShopping() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, bill, status } = useSelector((state) => state.cart);
  const { isLoading: checkoutLoading, isError: checkoutError } = useSelector(
    (state) => state.orders
  );
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartBill = Number(bill || 0);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const products = cartItems.map((item) => ({
      productId: item.product?._id || item.product,
      quantity: item.quantity,
    }));
    try {
      const result = await dispatch(postOrder({ products })).unwrap();
      if (result?.url) {
        await dispatch(clearCart());
        window.location.href = result.url;
      }
    } catch {
      // The order slice stores the checkout error for display.
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pet-page">
        <Navbar />
        <main className="pet-container py-16">
          <div className="pet-card p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-amber-600" />
            <h1 className="mt-4 text-3xl font-black text-slate-950">
              Your cart is waiting
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-slate-500">
              Sign in to view saved items, adjust quantities, and continue to checkout.
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
      <Navbar />
      <main className="pet-container py-8 sm:py-12">
        <div className="mb-8">
          <p className="pet-eyebrow">Shopping cart</p>
          <h1 className="pet-title text-4xl sm:text-5xl">Review your order</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <section className="space-y-4">
            {status === "loading" && (
              <div className="pet-card p-8 text-center font-semibold text-slate-500">
                Loading cart...
              </div>
            )}

            {status !== "loading" && cartItems.length === 0 && (
              <div className="pet-card p-10 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-amber-600" />
                <h2 className="mt-4 text-2xl font-black text-slate-950">
                  Your cart is empty
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-500">
                  Add food, toys, grooming, or comfort products to start a new order.
                </p>
                <Link className="pet-button-primary mx-auto mt-6 w-fit" to="/products">
                  Shop products
                </Link>
              </div>
            )}

            {cartItems.map((item) => {
              const product = item.product || {};
              const productId = product._id || item.product;
              const stock = Number(product.stock || 0);
              const quantity = Number(item.quantity || 0);

              return (
                <article
                  className="pet-card grid gap-4 p-4 sm:grid-cols-[120px_1fr] sm:items-center"
                  key={productId}
                >
                  <img
                    alt={product.name || "Product image"}
                    className="pet-product-image aspect-square w-full rounded-2xl sm:w-[120px]"
                    onError={(event) => {
                      event.currentTarget.src = "/product-placeholder.svg";
                    }}
                    src={product.image || "/product-placeholder.svg"}
                  />
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-950">
                        {product.name || "Product"}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        ${Number(product.price || 0).toFixed(2)} each
                      </p>
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        {stock > 0 ? `${stock} in stock` : "Stock unavailable"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-11 items-center rounded-full border border-amber-200 bg-amber-50">
                        <button
                          aria-label="Decrease quantity"
                          className="px-3 text-slate-700 disabled:opacity-40"
                          disabled={quantity <= 1}
                          onClick={() => dispatch(decreaseQuantity({ productId }))}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black text-slate-900">
                          {quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          className="px-3 text-slate-700 disabled:opacity-40"
                          disabled={stock > 0 && quantity >= stock}
                          onClick={() => dispatch(increaseQuantity({ productId }))}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        aria-label="Remove item"
                        className="pet-icon-button bg-red-50 text-red-600"
                        onClick={() => dispatch(removeFromCart({ productId }))}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="pet-card sticky top-24 p-6">
            <h2 className="text-2xl font-black text-slate-950">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-950">${cartBill.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-700">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-amber-100 pt-4 text-lg font-black text-slate-950">
                <span>Total</span>
                <span>${cartBill.toFixed(2)}</span>
              </div>
            </div>
            {checkoutError && (
              <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {checkoutError}
              </p>
            )}
            <button
              className="pet-button-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
              disabled={cartItems.length === 0 || checkoutLoading}
              onClick={handleCheckout}
              type="button"
            >
              {checkoutLoading ? "Starting checkout..." : "Proceed to Checkout"}
            </button>
            {cartItems.length > 0 && (
              <button
                className="pet-button-secondary mt-3 w-full justify-center"
                onClick={() => dispatch(clearCart())}
                type="button"
              >
                Clear Cart
              </button>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
