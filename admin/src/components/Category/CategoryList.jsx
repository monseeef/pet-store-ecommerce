import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, Pencil, Plus, Search, Tags, Trash2 } from "lucide-react";
import {
  deleteCategories,
  fetchCategories,
} from "../../services/reducer/categorySlice";
import CategoryForm from "./CategoryForm";

const CategoryList = () => {
  const categories = useSelector((state) => state.category.categories);
  const currentPage = useSelector((state) => state.category.currentPage);
  const totalPages = useSelector((state) => state.category.totalPages);
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState("name");
  const [sortOrder] = useState("asc");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories({ search: searchQuery, limit, sortBy, sortOrder }));
  }, [dispatch, searchQuery, limit, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    dispatch(fetchCategories({ search: searchQuery, limit, sortBy, sortOrder, page }));
  };

  const handleAddCategory = () => {
    setFormMode("add");
    setEditCategoryData(null);
    setIsFormVisible(true);
  };

  const handleEditCategory = (category) => {
    setFormMode("edit");
    setEditCategoryData(category);
    setIsFormVisible(true);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      dispatch(deleteCategories(deleteCategoryId));
      setDeleteCategoryId(null);
      setDeleteModalOpen(false);
    }
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setEditCategoryData(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Catalog taxonomy</p>
            <h3 className="admin-title mt-1">Categories</h3>
            <p className="admin-subtitle">Keep storefront product groups clean and easy to browse.</p>
          </div>
          <button onClick={handleAddCategory} className="admin-button">
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5">
          <div className="admin-toolbar">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                Items per page
                <select
                  className="admin-select"
                  value={limit}
                  onChange={(event) => setLimit(parseInt(event.target.value, 10))}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                </select>
              </label>
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" />
                <input
                  type="text"
                  className="admin-input w-full ps-10 sm:w-72"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3}>
                      <div className="admin-empty-state">
                        <Tags className="mx-auto mb-3 h-8 w-8 text-amber-600" />
                        No categories found.
                      </div>
                    </td>
                  </tr>
                )}
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="font-bold text-slate-950">{category.name}</td>
                    <td className="text-slate-500">{category.description || "No description"}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="admin-icon-button"
                          aria-label={`Edit ${category.name || "category"}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteCategoryId(category._id);
                            setDeleteModalOpen(true);
                          }}
                          className="admin-icon-button-danger"
                          aria-label={`Delete ${category.name || "category"}`}
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

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="admin-button-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages || 1)].map((_, index) => (
                <button
                  key={index}
                  className={`admin-pagination-button ${currentPage === index + 1 ? "admin-pagination-button-active" : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="admin-button-secondary"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal max-w-sm">
            <p className="font-semibold text-slate-950">Delete this category?</p>
            <p className="mt-2 text-sm text-slate-500">Products using it may need to be reassigned.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={confirmDelete} className="admin-button-danger">
                Confirm
              </button>
              <button
                onClick={() => {
                  setDeleteCategoryId(null);
                  setDeleteModalOpen(false);
                }}
                className="admin-button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormVisible && (
        <CategoryForm
          isOpen={isFormVisible}
          onClose={closeForm}
          mode={formMode}
          categoryData={editCategoryData}
          onSubmit={closeForm}
        />
      )}
    </div>
  );
};

export default CategoryList;
