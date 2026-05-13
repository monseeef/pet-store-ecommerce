import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPet, updatePet } from "../../services/reducer/petSlice";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const normalizePetData = (petData = {}) => {
  const normalizedCategory = petData.CategoryName || petData.categoryName || "";
  return {
    name: "",
    age: "",
    gender: "",
    isVaccinated: false,
    availability: false,
    location: "",
    description: "",
    image: "",
    ...petData,
    CategoryName: normalizedCategory,
  };
};

const PetModal = ({ isOpen, petData, handleClose }) => {
  const [formData, setFormData] = useState(normalizePetData(petData));
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  // Update formData when petData changes
  useEffect(() => {
    setFormData(normalizePetData(petData));
  }, [petData]);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const userFormElements = document.getElementsByClassName(
        "bg-gray-100 h-[95%]"
      );
      if (userFormElements.length > 0) {
        const userFormElement = userFormElements[0]; // Assuming there's only one element with this class
        if (!userFormElement.contains(e.target)) {
          handleClose();
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, handleClose]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (file) {
        imageUrl = await uploadImage(file);
      }
      const newFormData = {
        ...formData,
        age: Number(formData.age),
        image: imageUrl,
        CategoryName: formData.CategoryName || formData.categoryName,
      };
      if (formData._id) {
        dispatch(updatePet(newFormData)).then((result) => {
          if (updatePet.fulfilled.match(result)) {
            handleClose();
            toast.success("Pet updated successfully");
          } else {
            toast.error(result.payload || "Error updating pet");
          }
        });
      } else {
        dispatch(addPet(newFormData)).then((result) => {
          if (addPet.fulfilled.match(result)) {
            handleClose();
            toast.success("Pet added successfully");
          } else {
            toast.error(result.payload || "Error adding pet");
          }
        });
      }
    } catch (err) {
      toast.error("Error saving pet");
    }
  };
  // Add image upload handling
  const handleImageUpload = (e) => {
    // const file = Array.from(e.target.files);
    // // const file = e.target.files[0];
    // // setModalData({ ...modalData, profileImage: file });
    // setFile({ ...files, ...file });

    const file = e.target.files[0]; // Take the first file
    setFile(file); // Assuming you have a state variable named 'file'
  };
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petcom");
    // formData.append("folder", folderId);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dk28itsov/image/upload",
        formData
      );
      const { secure_url } = response.data;
      return secure_url;
    } catch (error) {
      throw error; // Re-throw the error to be caught by the parent try-catch block
    }
  };
  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-y-auto">
      <div className="bg-gray-100 h-[95%] shadow p-3 overflow-y-auto">
        <div className="bg-white p-5 rounded-lg w-[350px] flex flex-col gap-3">
          <div className="px-6 py-5">
            <div className="">
              <h3 className="text-xl text-gray-800 mb-3">
                {formData._id ? "Edit Pet" : "Add New Pet"}
              </h3>
              <button
                onClick={handleClose}
                className="absolute top-14 right-14 text-gray-600 hover:text-gray-800 focus:outline-none bg-white rounded-full p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <form
                onSubmit={handleModalSubmit}
                className="flex flex-col gap-5 "
              >
                <div className="">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="age"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="0"
                    step="any"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Gender
                  </label>
                  <div className="flex justify-start gap-5 items-center">
                    <div>
                      <input
                        type="radio"
                        id="gender-male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="gender-male">Male</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="gender-female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="gender-female">Female</label>
                    </div>
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="isVaccinated"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Vaccinated
                  </label>
                  <div className="block px-0 w-full bg-transparent border-gray-300 dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer">
                    <input
                      type="radio"
                      id="vaccinated-yes"
                      name="isVaccinated"
                      value="true"
                      checked={formData.isVaccinated}
                      onChange={() =>
                        setFormData({ ...formData, isVaccinated: true })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="vaccinated-yes" className="mr-4 text-md">
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="vaccinated-no"
                      name="isVaccinated"
                      value="false"
                      checked={!formData.isVaccinated}
                      onChange={() =>
                        setFormData({ ...formData, isVaccinated: false })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="vaccinated-no" className="text-md">
                      No
                    </label>
                  </div>
                </div>
                {/* <div className="">
                  <label
                    htmlFor="availability"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Available
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div> */}
                <div className="">
                  <label
                    htmlFor="availability"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Available
                  </label>
                  <div className="block px-0 w-full  bg-transparent border-gray-300 dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer">
                    <input
                      type="radio"
                      id="available-yes"
                      name="availability"
                      value="true"
                      checked={formData.availability}
                      onChange={() =>
                        setFormData({ ...formData, availability: true })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="available-yes" className="mr-4">
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="available-no"
                      name="availability"
                      value="false"
                      checked={!formData.availability}
                      onChange={() =>
                        setFormData({ ...formData, availability: false })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="available-no">No</label>
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="location"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="CategoryName"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Category
                  </label>
                  <select
                    id="CategoryName"
                    name="CategoryName"
                    value={formData.CategoryName}
                    onChange={handleChange}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                  >
                    <option value=""></option>
                    <option value="Dogs">Dogs</option>
                    <option value="Cats">Cats</option>
                  </select>
                </div>
                <div className="">
                  <label
                    htmlFor="petImage"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Image
                  </label>
                  <input
                    id="petImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    // value={formData.image}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-none border bg-gray-200 text-gray-700 rounded-lg focus:outline-none hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="block p-1 w-24 text-white bg-primary hover:bg-secondary border border-transparent rounded-lg shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;
