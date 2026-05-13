import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Heart, ShoppingBag, SlidersHorizontal } from "lucide-react";
import {
  fetchCategories,
  fetchProduct,
  setFilter,
  setSearch,
  setSort,
} from "@/services/reducer/productSlice";
import { addToCart } from "@/services/reducer/cartSlice";
import { fetchUser, selectUserId } from "@/services/reducer/authSlice";
import { addToWishlist, removeFromWishlist } from "@/services/reducer/wishSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import Filters from "../../components/Filters";

const Products = () => {
  const { product, loading, error, totalPages, search, filters, sort } =
    useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(search);
  const [selectedFilters, setSelectedFilters] = useState(filters);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartError = useSelector((state) => state.cart.error);
  const wishlistItems = useSelector((state) => state.wish.items);
  const productList = Array.isArray(product) ? product : [];
  const pageCount = Number(totalPages || 1);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProduct({
        page: currentPage,
        search: searchTerm,
        filters: selectedFilters,
        sort,
      })
    );
    dispatch(fetchCategories());
  }, [dispatch, currentPage, searchTerm, selectedFilters, sort]);

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => {
      const wishlistProduct = item.product || item;
      return String(wishlistProduct?._id || wishlistProduct) === String(productId);
    });

  const handleAddToCart = (event, productId, quantity) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated || !userId) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId, quantity }));
  };

  const handleToggleWishlist = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated || !userId) {
      navigate("/login");
      return;
    }
    if (isWishlisted(productId)) {
      dispatch(removeFromWishlist({ productId }));
      return;
    }
    dispatch(addToWishlist({ productId }));
  };

  const handleFilterChange = (filterKey, filterValue) => {
    const newFilters = { ...selectedFilters, [filterKey]: filterValue };
    setSelectedFilters(newFilters);
    dispatch(setFilter(newFilters));
    setCurrentPage(1);
    dispatch(
      fetchProduct({ page: 1, search: searchTerm, filters: newFilters, sort })
    );
  };

  const handleSortChange = (sortOption) => {
    dispatch(setSort(sortOption));
    setCurrentPage(1);
    dispatch(
      fetchProduct({
        page: 1,
        search: searchTerm,
        filters: selectedFilters,
        sort: sortOption,
      })
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    dispatch(setSearch(e.target.value));
    dispatch(
      fetchProduct({
        page: 1,
        search: e.target.value,
        filters: selectedFilters,
        sort,
      })
    );
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchTerm));
    dispatch(
      fetchProduct({
        page: 1,
        search: searchTerm,
        filters: selectedFilters,
        sort,
      })
    );
  };

  return (
    <div className="pet-page">
      <Navbar />
      <main>
        <section className="border-b border-amber-100 bg-white/70 py-10 sm:py-14">
          <div className="pet-container grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="pet-eyebrow">Shop pet essentials</p>
              <h1 className="pet-title text-4xl sm:text-5xl">
                Premium picks for every kind of companion
              </h1>
              <p className="pet-copy mt-4 max-w-2xl">
                Browse food, comfort, grooming, and play products selected for
                safe daily routines and happy homes.
              </p>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="pet-card flex items-center gap-2 p-2"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <FaSearch className="h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full border-0 bg-transparent py-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              <button type="submit" className="pet-button-primary shrink-0">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="pet-section">
          <div className="pet-container">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="rounded-full border-amber-200 bg-white font-bold text-slate-800 hover:bg-amber-50"
                      variant="outline"
                    >
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[220px]">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={handleSortChange}
                    >
                      <DropdownMenuRadioItem value="featured">
                        Featured
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="newest">
                        Newest
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="priceLowHigh">
                        Price: Low to High
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="priceHighLow">
                        Price: High to Low
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Filters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  setCurrentPage={setCurrentPage}
                  onFilterChange={handleFilterChange}
                />
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {loading ? "Refreshing products..." : `${productList.length} products shown`}
              </p>
            </div>

            {cartError && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {cartError}
              </div>
            )}

            {loading && (
              <div className="pet-card p-10 text-center font-semibold text-slate-500">
                Loading products...
              </div>
            )}

            {!loading && error && (
              <div className="pet-card border-red-100 bg-red-50 p-10 text-center font-semibold text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && productList.length === 0 && (
              <div className="pet-card p-10 text-center">
                <h2 className="text-xl font-extrabold text-slate-950">
                  No products found
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Try a different search or clear your filters.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {!loading &&
                !error &&
                productList.map((item) => {
                  const stock = Number(item.stock || 0);
                  const isOutOfStock = stock <= 0;
                  const wished = isWishlisted(item._id);

                  return (
                    <article
                      key={item._id}
                      className="pet-card group relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Link className="absolute inset-0 z-10" to={`/products/${item._id}`}>
                        <span className="sr-only">View {item.name || "product"}</span>
                      </Link>
                      <button
                        type="button"
                        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                        className={`pet-icon-button absolute right-3 top-3 z-20 ${
                          wished ? "bg-amber-600 text-white" : "bg-white/90 text-slate-700"
                        }`}
                        onClick={(event) => handleToggleWishlist(event, item._id)}
                      >
                        <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
                      </button>
                      <div className="aspect-[4/3] bg-amber-50">
                        <img
                          alt={item.name || "Product image"}
                          className="pet-product-image h-full w-full transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src = "/product-placeholder.svg";
                          }}
                          src={item.image || "/product-placeholder.svg"}
                        />
                      </div>
                      <div className="flex min-h-[230px] flex-col p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <h2 className="line-clamp-2 text-lg font-extrabold text-slate-950">
                              {item.name || "Unnamed product"}
                            </h2>
                            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                              {item.description || "A trusted pet care essential."}
                            </p>
                          </div>
                          <span className="shrink-0 text-lg font-extrabold text-amber-700">
                            ${Number(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-auto space-y-4">
                          <span
                            className={`pet-badge ${
                              isOutOfStock
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {isOutOfStock ? "Out of stock" : `${stock} in stock`}
                          </span>
                          <button
                            type="button"
                            className="pet-button-primary relative z-20 w-full justify-center disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                            disabled={isOutOfStock}
                            onClick={(event) => handleAddToCart(event, item._id, 1)}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>

            {pageCount > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  className="pet-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  type="button"
                >
                  Previous
                </button>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-700 shadow-sm ring-1 ring-amber-100">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  className="pet-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, pageCount))}
                  disabled={currentPage >= pageCount}
                  type="button"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Products;
