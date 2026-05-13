import axios from "axios";
import { useState, useEffect } from "react";

const ProductForm = ({ isOpen, onClose, onSubmit }) => {
  //   const [isOpen, setIsOpen] = useState(open);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [files, setFile] = useState([]);
  // const [image, setImage] = useState("");
  // const [URL, setURL] = useState("");

  //   const handleOpen = () => setIsOpen(true);
  //   const handleClose = () => setIsOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const uploadedImageUrls = await Promise.all(
        files.map(async (file) => {
          const imageUrl = await uploadImage(file);
          return imageUrl;
        })
      );
      const image = uploadedImageUrls.join(",");

      const requestData = {
        name,
        price,
        description,
        category,
        stock,
        image,
      };

      // Attempt to submit the product
      await onSubmit(requestData);
      handleClose();
    } catch (error) {
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFile([...files, ...selectedFiles]);
  };
  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFile(updatedFiles);
  };

  const handleClose = () => {
    onClose();
    setName("");
    setPrice(0);
    setDescription("");
    setCategory(null);
    setFile([]);
    setStock(0);
    // setImage("");
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const userFormElements = document.getElementsByClassName("bg-teal-400 shadow p-3");
      if (userFormElements.length > 0) {
        const userFormElement = userFormElements[0]; // Assuming there's only one element with this class
        if (!userFormElement.contains(e.target)) {
          onClose();
        }
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petcom");
    // formData.append("folder", folderId);

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dk28itsov/image/upload', formData);
      const { secure_url } = response.data;
      return secure_url; 
    } catch (error) {
      throw error; // Re-throw the error to be caught by the parent try-catch block
    }

  };
  
  return (
    <>
      {/* <button onClick={handleOpen}>Add Product</button> */}
      {isOpen && (
        // <div className="max-w-sm mx-auto">
        //   <div className="bg-white p-6 rounded-lg shadow-md">
        //     <span className="text-gray-700 text-2xl cursor-pointer absolute top-0 right-0" onClick={handleClose}>&times;</span>
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-teal-400 shadow p-3">
            <div className={`bg-white p-5 h-[500px] overflow-y-auto rounded-lg w-[550px] ${files.length > 0 ? 'h-auto overflow-y-auto' : 'h-[700px]'} flex flex-col gap-3`}>
            <h2 className="text-xl text-gray-800 mb-3 ">Add new product</h2>
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
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-teal-400 peer"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm text-gray-900 "
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-teal-400 peer"
                    //   required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm  text-gray-900 "
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                    style={{ resize: "none" }}
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="productCategory"
                    className="block mb-2 text-sm text-gray-900 "
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="productCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-teal-400 peer"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="stock"
                    className="block mb-2 text-sm text-gray-900 "
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                    className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-teal-400 peer"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="productImage"
                    className="block mb-2 text-sm  text-gray-900 "
                  >
                    Product Image (optional)
                  </label>
                  <input
                    type="file"
                    id="productImage"
                    onChange={handleFileChange}
                    className="block px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-teal-400 peer"
                  />
                </div>
                <div>
                {files.map((file, index) => (
                    <div key={index} className="relative inline-block mr-2 mb-2 ">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-24 h-24 object-cover rounded" />
                        <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-0 right-0 px-1 bg-gray-700 rounded-full text-white text-xs hover:bg-gray-900 focus:outline-none"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
                <button
                  type="submit"
                  className="block w-full p-1 text-white bg-teal-400 hover:bg-teal-500 border border-transparent rounded-lg shadow-sm   "
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductForm;
