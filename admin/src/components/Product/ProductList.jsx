import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductAdmin,
  selectIsLoading,
  selectTotalPages,
  setSearch,
  selectError,
  selectProduct,
} from "../../services/reducer/productSlice";
import ProductForm from "./ProductForm";
import ProductEditForm from "./EditForm";
import ProductView from "./ProductView";
import { AlertTriangle, ArrowLeft, ArrowRight, Eye, PackageOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import PetCategory from "./PetCategory";
import api from "../../services/api";
// import { selectCategories } from "../../services/reducer/petCategorySlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProduct);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectError);
  const totalPages = useSelector(selectTotalPages);

  /********************************************/
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const categories = useSelector(selectCategories);

  // useEffect(() => {
  //   dispatch(fetchProduct({ page: currentPage, limit: productsPerPage, search: searchQuery, category: selectedCategory }));
  // }, [dispatch, currentPage, searchQuery, selectedCategory]);

  // const handleCategoryChange = (e) => {
  //   setSelectedCategory(e.target.value);
  // };

  /*********************************************/
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Fixed products per page
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [viewProductId, setViewProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // useEffect(() => {
  //   dispatch(
  //     fetchProduct({
  //       page: currentPage,
  //       limit: productsPerPage,
  //       search: searchQuery,
  //     })
  //   );
  // }, [dispatch, currentPage, searchQuery]);
  // const importedproducts = useSelector(selectProduct);
  // useEffect(() => {
  // }, [importedproducts]);
  useEffect(() => {
    if (selectedCategory !== "") {
      // Fetch products based on selected pet category
      dispatch(
        fetchProductAdmin({
          page: currentPage,
          limit: productsPerPage,
          search: searchQuery,
          petCategory: selectedCategory,
        })
      );
    } else {
      // Fetch all products if no category is selected
      dispatch(
        fetchProductAdmin({
          page: currentPage,
          limit: productsPerPage,
          search: searchQuery,
        })
      );
    }
  }, [dispatch, currentPage, productsPerPage, searchQuery, selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset pagination to first page
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page
    dispatch(setSearch(e.target.value));
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  let filteredProducts = Array.isArray(products.product)
    ? products.product.filter((product) =>
        (product.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  Object.keys(filters).forEach((key) => {
    filteredProducts = filteredProducts.filter(
      (product) => product[key] === filters[key]
    );
  });
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  if (sortBy === "category") {
    filteredProducts.sort((a, b) => {
      const categoryNameA = (a.category?.name || "").toLowerCase();
      const categoryNameB = (b.category?.name || "").toLowerCase();
      if (categoryNameA < categoryNameB) return sortOrder === "asc" ? -1 : 1;
      if (categoryNameA > categoryNameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  } else if (sortBy) {
    filteredProducts.sort((a, b) => {
      const aValue =
        typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
      const bValue =
        typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleOpenProductForm = () => {
    setIsProductFormOpen(true);
  };

  const handleOpenViewForm = (productId) => {
    setViewProductId(productId);
    setIsViewFormOpen(true);
  };

  const handleOpenEditForm = (productId) => {
    setEditProductId(productId);
    setIsEditFormOpen(true);
  };

  const handleCloseProductForm = () => setIsProductFormOpen(false);
  const handleCloseViewForm = () => setIsViewFormOpen(false);
  const handleCloseEditForm = () => setIsEditFormOpen(false);
  const refreshProducts = () => {
    dispatch(
      fetchProductAdmin({
        page: currentPage,
        limit: productsPerPage,
        search: searchQuery,
        petCategory: selectedCategory || undefined,
      })
    );
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      dispatch(
        fetchProductAdmin({
          page: currentPage,
          limit: productsPerPage,
          search: searchQuery,
        })
      );
    } catch {
      // Keep the existing list visible and let protected API errors fail quietly here.
    }
  };

  const closeModal = () => {
    setDeleteUserId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      handleDeleteProduct(deleteUserId);
      setDeleteUserId(null);
      setDeleteModalOpen(false);
    }
  };

  const handleProductSubmit = async (formData) => {
    try {
      await api.post("/products", formData);
      dispatch(
        fetchProductAdmin({
          page: currentPage,
          limit: productsPerPage,
          search: searchQuery,
        })
      );
    } catch {
      // Product creation errors are surfaced by the form layer where possible.
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">Loading products...</div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state border-red-200 bg-red-50 text-red-700">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8" />
          Error: {isError}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-title">Products</h3>
                <p className="admin-subtitle">Manage catalog items, stock, and merchandising details.</p>
              </div>
              <button
                className="admin-button"
                onClick={handleOpenProductForm}
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
            <div className="flex flex-col gap-6 p-5">
              <div className="admin-toolbar">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <Search className="h-4 w-4 text-amber-700" aria-hidden="true" />
                    </div>
                    <input
                      value={searchQuery}
                      onChange={handleSearch}
                      type="text"
                      className="admin-input w-full ps-10 sm:w-72"
                      placeholder="Search..."
                    />
                  </div>
                <PetCategory onChange={handleCategoryChange} />
                </div>
              </div>
              <ProductForm
                isOpen={isProductFormOpen}
                onClose={handleCloseProductForm}
                onSubmit={handleProductSubmit}
              />
              <div className="admin-table-wrap mb-5">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        Name
                        {sortBy === "name" && (
                          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        {sortBy === "price" && (
                          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th scope="col">
                        Description
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer"
                        onClick={() => handleSort("category")}
                      >
                        Category
                        {sortBy === "category" && (
                          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer"
                        onClick={() => handleSort("stock")}
                      >
                        Stock
                        {sortBy === "stock" && (
                          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <div className="admin-empty-state">
                            <PackageOpen className="mx-auto mb-3 h-8 w-8 text-amber-600" />
                            No products found.
                          </div>
                        </td>
                      </tr>
                    )}
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                      >
                        <td className="font-medium text-slate-900">{product.name || "Unnamed product"}</td>
                        <td className="font-semibold text-slate-900">
                          ${Number(product.price || 0).toFixed(2)}
                        </td>
                        <td className="max-w-xs truncate">{product.description || "-"}</td>
                        <td>
                          <span className="admin-badge bg-amber-50 text-amber-700">
                            {product.category ? product.category.name : "Uncategorized"}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge ${Number(product.stock || 0) > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {product.stock ?? 0} in stock
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                          <button
                            className="admin-icon-button"
                            aria-label={`View ${product.name || "product"}`}
                            onClick={() => handleOpenViewForm(product._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="admin-icon-button"
                            aria-label={`Edit ${product.name || "product"}`}
                            onClick={() => handleOpenEditForm(product._id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="admin-icon-button-danger"
                            aria-label={`Delete ${product.name || "product"}`}
                            onClick={() => handleDeleteClick(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              /> */}
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
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}</div>
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
            {deleteModalOpen && (
              <div className="admin-modal-backdrop">
                <div className="admin-modal max-w-sm">
                  <p className="font-semibold text-slate-950">Delete this product?</p>
                  <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={confirmDelete}
                      className="admin-button-danger mr-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={closeModal}
                      className="admin-button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
      <ProductEditForm
        isOpen={isEditFormOpen}
        onClose={handleCloseEditForm}
        productId={editProductId}
        onSaved={refreshProducts}
      />
      <ProductView
        isOpen={isViewFormOpen}
        onClose={handleCloseViewForm}
        productId={viewProductId}
      />
    </>
  );
};

export default ProductList;
