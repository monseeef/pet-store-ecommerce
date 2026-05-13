import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { clearCart, decreaseQuantity, fetchCart, increaseQuantity, removeFromCart } from "@/services/reducer/cartSlice";
import { selectUserId } from "@/services/reducer/authSlice";
import { postOrder } from "@/services/reducer/orderSlice";

const CartMenu = ({ onClose }) => {
  const cartMenuRef = useRef(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartBill = useSelector((state) => state.cart.bill);
  const userId = useSelector(selectUserId);
  const { isLoading: checkoutLoading, isError: checkoutError } = useSelector((state) => state.orders);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCheckout = async () => {
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

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/30 backdrop-blur-sm">
      <aside
        ref={cartMenuRef}
        className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fffaf2] shadow-2xl shadow-slate-950/20"
      >
        <div className="flex items-center justify-between border-b border-amber-100 px-5 py-5">
          <div>
            <p className="pet-eyebrow">Basket</p>
            <h2 className="text-2xl font-extrabold text-slate-950">Your Cart</h2>
          </div>
          <button className="pet-icon-button" onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cartItems.length === 0 ? (
            <div className="pet-card flex h-full flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="mb-4 h-10 w-10 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-950">Your cart is empty</h3>
              <p className="mt-2 text-sm text-slate-500">Add a few pet favorites and they will appear here.</p>
              <Link className="pet-button-primary mt-6" to="/products" onClick={onClose}>
                Shop products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product || {};
                const productId = product._id || item.product;
                const stock = Number(product.stock || 0);
                return (
                  <div key={productId} className="pet-card flex gap-4 p-3">
                    <img
                      alt={product.name || "Product"}
                      className="pet-product-image h-20 w-20 rounded-2xl"
                      onError={(event) => {
                        event.currentTarget.src = "/product-placeholder.svg";
                      }}
                      src={product.image || "/product-placeholder.svg"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-950">{product.name || "Product"}</p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">${Number(product.price || 0).toFixed(2)}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-amber-100 bg-amber-50">
                          <button
                            className="p-2 text-slate-700 hover:text-amber-700"
                            onClick={() => dispatch(decreaseQuantity({ productId }))}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            className="p-2 text-slate-700 hover:text-amber-700 disabled:opacity-40"
                            disabled={stock > 0 && item.quantity >= stock}
                            onClick={() => dispatch(increaseQuantity({ productId }))}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="text-slate-400 hover:text-red-600"
                          onClick={() => dispatch(removeFromCart({ productId }))}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-amber-100 bg-white px-5 py-5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="text-xl font-extrabold text-slate-950">${Number(cartBill || 0).toFixed(2)}</span>
          </div>
          {checkoutError && <p className="mt-3 text-sm font-medium text-red-600">{checkoutError}</p>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="pet-button-secondary py-2" onClick={() => dispatch(clearCart())} disabled={cartItems.length === 0}>
              Clear
            </button>
            <button className="pet-button-primary py-2" onClick={handleCheckout} disabled={cartItems.length === 0 || checkoutLoading}>
              {checkoutLoading ? "Starting..." : "Checkout"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

CartMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CartMenu;
