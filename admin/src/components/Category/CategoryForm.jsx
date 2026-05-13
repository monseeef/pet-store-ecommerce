// CategoryForm.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createCategories, updateCategories } from "../../services/reducer/categorySlice";

const CategoryForm = ({ isOpen, onClose, mode, categoryData, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  

  useEffect(() => {
    // Set initial form values if in edit mode and categoryData is available
    if (mode === "edit" && categoryData) {
      setName(categoryData.name);
      setDescription(categoryData.description);
    }
  }, [mode, categoryData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    const formData = {
      name,
      description,
    };

    if (mode === "add") {
      dispatch(createCategories(formData));
    } else if (mode === "edit") {
      dispatch(updateCategories({ id: categoryData._id, data: formData }));
    }
    onSubmit(formData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-y-auto">
          <div className="max-w-sm bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl text-gray-800 mb-3">
              {mode === "add" ? "Add Category" : "Edit Category"}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === "add" ? "Create a new category by filling out the form below." : "Edit the category details below."}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm bg-transparent
                  border-0 border-b-[1px] border-gray-400 appearance-none dark:text-white
                   dark:border-gray-400 dark:focus:border-primary focus:outline-none 
                   focus:ring-0 focus:border-secondary peer"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm bg-transparent
                  border-0 border-b-[1px] border-gray-400 appearance-none dark:text-white
                   dark:border-gray-400 dark:focus:border-primary focus:outline-none 
                   focus:ring-0 focus:border-secondary peer"
                ></textarea>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {mode === "add" ? "Add Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryForm;
