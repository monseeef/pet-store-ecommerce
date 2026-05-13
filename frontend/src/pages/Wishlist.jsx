import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { fetchUser } from "@/services/reducer/authSlice";
import { addToCart } from "@/services/reducer/cartSlice";
import { fetchWishlist, removeFromWishlist } from "@/services/reducer/wishSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.wish);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (!isAuthenticated) {
    return (
      <div className="pet-page">
        <Navbar />
        <main className="pet-container py-16">
          <div className="pet-card p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-amber-600" />
            <h1 className="mt-4 text-3xl font-black text-slate-950">
              Save your favorites
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-slate-500">
              Sign in to keep a wishlist across visits and move products into your cart.
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
          <p className="pet-eyebrow">Wishlist</p>
          <h1 className="pet-title text-4xl sm:text-5xl">Products you love</h1>
        </div>

        {status === "loading" && (
          <div className="pet-card p-8 text-center font-semibold text-slate-500">
            Loading wishlist...
          </div>
        )}

        {status !== "loading" && items.length === 0 && (
          <div className="pet-card p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-amber-600" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-500">
              Save products while browsing and return when you are ready to buy.
            </p>
            <Link className="pet-button-primary mx-auto mt-6 w-fit" to="/products">
              Browse products
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => {
            const stock = Number(product.stock || 0);
            const isOutOfStock = stock <= 0;

            return (
              <article
                className="pet-card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                key={product._id}
              >
                <Link to={`/products/${product._id}`}>
                  <img
                    alt={product.name || "Pet product"}
                    className="pet-product-image aspect-[4/3] w-full"
                    onError={(event) => {
                      event.currentTarget.src = "/product-placeholder.svg";
                    }}
                    src={product.image || "/product-placeholder.svg"}
                  />
                </Link>
                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="line-clamp-2 text-lg font-extrabold text-slate-950">
                      {product.name || "Pet product"}
                    </h2>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-amber-700">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                      <span
                        className={`pet-badge ${
                          isOutOfStock
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isOutOfStock ? "Out" : `${stock} in stock`}
                      </span>
                    </div>
                  </div>
                  <button
                    className="pet-button-primary w-full justify-center disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product._id)}
                    type="button"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    className="pet-button-secondary w-full justify-center border-red-100 text-red-700 hover:bg-red-50"
                    onClick={() => dispatch(removeFromWishlist({ productId: product._id }))}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
