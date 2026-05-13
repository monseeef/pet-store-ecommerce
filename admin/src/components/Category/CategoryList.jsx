// CategoryList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategories,
} from "../../services/reducer/categorySlice";
import CategoryForm from "./CategoryForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

const CategoryList = () => {
  const categories = useSelector((state) => state.category.categories);
  const currentPage = useSelector((state) => state.category.currentPage);
  const totalPages = useSelector((state) => state.category.totalPages);

  const dispatch = useDispatch();

  // State variables for search, pagination, sorting, and limit
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // State variable to control form visibility and mode (add/edit)
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editCategoryData, setEditCategoryData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    dispatch(
      fetchCategories({ search: searchQuery, limit, sortBy, sortOrder })
    );
  }, [dispatch, searchQuery, limit, sortBy, sortOrder]);

  const handlePageChange = (newPage) => {
    dispatch(
      fetchCategories({
        search: searchQuery,
        limit,
        sortBy,
        sortOrder,
        page: newPage,
      })
    );
  };

  // Function to handle limit change
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  // Function to handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCategory = () => {
    setFormMode("add");
    setIsFormVisible(true);
  };

  const handleEditCategory = (category) => {
    setFormMode("edit");
    setIsFormVisible(true);
    setEditCategoryData(category);
  };

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      dispatch(deleteCategories(deleteCategoryId));
      setDeleteCategoryId(null);
      setDeleteModalOpen(false);
    }
  };

  const closeModal = () => {
    setDeleteCategoryId(null);
    setDeleteModalOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditCategoryData(null);
  };

  const handleSubmitForm = (formData) => {
    if (formMode === "add") {
      // Logic to add category using API call
    } else if (formMode === "edit") {
      // Logic to edit category using API call
    }
    handleCloseForm();
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="p-3 bg-gray-100 sm:ml-64 overflow-hidden">
        <div className="bg-white p-3 shadow-md sm:rounded-lg">
          <h3 className="text-xl">All Categories</h3>

          <div className="flex justify-end items-center mb-8 gap-5">
            <div className="flex items-center">
              <div className="mr-5">
                <span>Items per page:&nbsp;</span>
                <select
                  className="border border-gray-300 text-gray-500 rounded px-3 py-1"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option>3</option>
                  <option>5</option>
                  <option>7</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-secondary dark:text-primary"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="text-sm bg-opacity-0 block ps-10 p-2.5 bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <button
              onClick={handleAddCategory}
              className="py-2 px-4 hover:bg-green-600 rounded-lg bg-green-500 text-white"
            >
              <FontAwesomeIcon icon={faPlusSquare} /> Add Category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="text-center w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="text-gray-900 bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="px-6 py-3">{category.name}</td>
                    <td className="px-6 py-3 flex h-[100px] gap-2 items-center justify-center">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className=" rounded-s-3xl "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="orange"
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM21.41 6.34l-3.75-3.75l-2.53 2.54l3.75 3.75z"
                          ></path>
                        </svg>{" "}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category._id)}
                        className=" rounded-e-3xl"
                      >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.5em"
                              height="1.5em"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="red"
                                d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                              ></path>
                            </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-primary hover:bg-secondary text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div> */}

<div className="flex justify-center gap-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
                    currentPage === 1
                      ? "text-gray-900  pointer-events-none"
                      : "text-gray-600 hover:bg-neutral-200"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    ></path>
                  </svg>
                  Previous
                </button>
                <div className="flex items-center gap-2">

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`relative block px-3 py-1.5 text-sm transition-all duration-300 ${
                      currentPage === index + 1
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}</div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
                    currentPage === totalPages
                      ? "text-gray-900  pointer-events-none"
                      : "text-gray-600 hover:bg-neutral-200"
                  }`}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    ></path>
                  </svg>
                </button>
              </div>

        </div>

        {deleteModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg">
              <p>Are you sure you want to delete this category?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Confirm
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isFormVisible && (
        <CategoryForm
          isOpen={isFormVisible}
          onClose={handleCloseForm}
          mode={formMode}
          categoryData={editCategoryData}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default CategoryList;
