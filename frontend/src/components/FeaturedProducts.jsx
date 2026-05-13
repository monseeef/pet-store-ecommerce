import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { fetchProduct } from "@/services/reducer/productSlice";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);
  const products = Array.isArray(product) ? product.slice(0, 3) : [];

  useEffect(() => {
    dispatch(fetchProduct({ page: 1, search: "", filters: {}, sort: "" }));
  }, [dispatch]);

  return (
    <section className="pet-section">
      <div className="pet-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="pet-eyebrow">Featured care essentials</p>
            <h2 className="pet-title text-3xl sm:text-4xl">
              Favorites for happier routines
            </h2>
          </div>
          <Link className="pet-button-secondary w-fit" to="/products">
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading && (
          <div className="pet-card p-8 text-center text-sm font-semibold text-slate-500">
            Loading featured products...
          </div>
        )}

        {error && (
          <div className="pet-card border-red-100 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="pet-card p-8 text-center text-sm font-semibold text-slate-500">
            No featured products available yet.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((item) => {
            const stock = Number(item.stock || 0);
            const isOutOfStock = stock <= 0;

            return (
              <article
                className="pet-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                key={item._id}
              >
                <Link to={`/products/${item._id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden bg-amber-50">
                    <img
                      alt={item.name || "Pet product"}
                      className="pet-product-image h-full w-full transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src = "/product-placeholder.svg";
                      }}
                      src={item.image || "/product-placeholder.svg"}
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-950">
                          {item.name || "Pet product"}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {item.description || "Quality care for everyday pet needs."}
                        </p>
                      </div>
                      <span className="shrink-0 text-lg font-extrabold text-amber-700">
                        ${Number(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`pet-badge ${
                          isOutOfStock
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isOutOfStock ? "Out of stock" : `${stock} in stock`}
                      </span>
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <ShoppingBag className="h-4 w-4 text-amber-600" />
                        Details
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
