// CategoryForm.js
import { useState, useEffect } from "react";
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
        <div className="admin-modal-backdrop">
          <div className="admin-modal max-w-sm">
            <h2 className="text-xl font-black text-slate-950">
              {mode === "add" ? "Add Category" : "Edit Category"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "add" ? "Create a new category by filling out the form below." : "Edit the category details below."}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input min-h-28 w-full py-3"
                ></textarea>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="admin-button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-button"
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
