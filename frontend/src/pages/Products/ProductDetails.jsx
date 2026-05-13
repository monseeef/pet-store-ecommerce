import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { fetchProductById } from "@/services/reducer/productSlice";
import { addToCart } from "@/services/reducer/cartSlice";
import { selectUserId } from "@/services/reducer/authSlice";
import { addToWishlist, removeFromWishlist } from "@/services/reducer/wishSlice";
import Navbar from "@/components/Navbar";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state) => state.wish.items);
  const cartError = useSelector((state) => state.cart.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById({ productId: id }));
    }
  }, [dispatch, id]);

  const isInWishlist = wishlistItems.some((item) => {
    const wishlistProduct = item.product || item;
    return String(wishlistProduct?._id || wishlistProduct) === String(id);
  });

  const handleAddToCart = (productId, quantity) => {
    if (!isAuthenticated || !userId) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId, quantity }));
  };

  const handleToggleWish = () => {
    if (!isAuthenticated || !userId) {
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: id }));
      return;
    }
    dispatch(addToWishlist({ productId: id }));
  };

  const renderState = (message, tone = "default") => (
    <div className="pet-page">
      <Navbar />
      <main className="pet-container py-16">
        <div
          className={`pet-card p-10 text-center font-semibold ${
            tone === "error" ? "border-red-100 bg-red-50 text-red-700" : "text-slate-500"
          }`}
        >
          {message}
        </div>
      </main>
    </div>
  );

  if (!id) return renderState("Product id is missing.", "error");
  if (loading) return renderState("Loading product...");
  if (error) return renderState(error, "error");
  if (!product) return renderState("Product not found.");

  const stock = Number(product.stock || 0);
  const isOutOfStock = stock <= 0;
  const thumbnails = Array.isArray(product.thumbnails) ? product.thumbnails : [];

  return (
    <div className="pet-page">
      <Navbar />
      <main className="pet-container py-8 sm:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link className="hover:text-amber-700" to="/">
            Home
          </Link>
          <span>/</span>
          <Link className="hover:text-amber-700" to="/products">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-900">{product.name || "Product"}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4">
            <div className="pet-card overflow-hidden bg-amber-50">
              <img
                alt={product.name || "Product image"}
                className="pet-product-image aspect-square w-full"
                onError={(event) => {
                  event.currentTarget.src = "/product-placeholder.svg";
                }}
                src={product.image || "/product-placeholder.svg"}
              />
            </div>
            {thumbnails.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {thumbnails.slice(0, 4).map((thumbnail, index) => (
                  <div className="pet-card overflow-hidden bg-white" key={`${thumbnail}-${index}`}>
                    <img
                      alt={`${product.name || "Product"} thumbnail ${index + 1}`}
                      className="pet-product-image aspect-square w-full"
                      onError={(event) => {
                        event.currentTarget.src = "/product-placeholder.svg";
                      }}
                      src={thumbnail || "/product-placeholder.svg"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pet-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {product.category?.name && (
                <span className="pet-badge bg-amber-100 text-amber-800">
                  {product.category.name}
                </span>
              )}
              <span
                className={`pet-badge ${
                  isOutOfStock ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isOutOfStock ? "Out of stock" : `${stock} in stock`}
              </span>
            </div>

            <h1 className="pet-title mt-5 text-3xl sm:text-4xl">
              {product.name || "Unnamed product"}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {product.description || "No description available."}
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black text-slate-950">
                ${Number(product.price || 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="pb-1 text-sm font-bold text-slate-400 line-through">
                  ${Number(product.originalPrice || 0).toFixed(2)}
                </span>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                className="pet-button-primary justify-center disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(product._id, 1)}
                type="button"
              >
                <ShoppingBag className="h-5 w-5" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                className={`pet-button-secondary justify-center ${
                  isInWishlist ? "border-amber-300 bg-amber-50 text-amber-800" : ""
                }`}
                onClick={handleToggleWish}
                type="button"
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                {isInWishlist ? "Saved" : "Wishlist"}
              </button>
            </div>

            {cartError && (
              <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {cartError}
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-amber-50 p-4">
                <Truck className="h-5 w-5 text-amber-700" />
                <p className="mt-2 text-sm font-extrabold text-slate-900">
                  Fast delivery
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Carefully packed for pet households.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
                <p className="mt-2 text-sm font-extrabold text-slate-900">
                  Secure checkout
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Order totals are verified before payment.
                </p>
              </div>
            </div>

            {product.additionalInfo && (
              <div className="mt-8 border-t border-amber-100 pt-6">
                <h2 className="text-lg font-extrabold text-slate-950">
                  Product notes
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.additionalInfo}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
