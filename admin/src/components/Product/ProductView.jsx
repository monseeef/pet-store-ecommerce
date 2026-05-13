import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ProductView = ({ isOpen, onClose, productId }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      // Fetch product data based on productId
      api
        .get(`/products/${productId}`)
        .then((response) => {
          const { name, price, description, category, stock, image } =
            response.data;
          setName(name);
          setPrice(price);
          setDescription(description);
          setCategory(category?.name || "");
          setStock(stock || 0);
          setImages(image ? image.split(",") : []); // Split images by comma
        })
    }
  }, [productId]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const userFormElements = document.getElementsByClassName(
        "bg-gray-100 shadow p-3"
      );
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

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-y-auto">
          <div className="bg-gray-100 h-[95%] shadow p-3 overflow-y-auto">
            <div className="bg-white p-5 rounded-lg w-[550px] flex flex-col gap-3">
              <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure>
                  <img
                  className="h-[400px] w-full"
                    src={
                      images[currentImageIndex] ||
                      "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                    }
                    alt="Album"
                  />
                </figure>
                <div className="card-body">
                <div className="grid gap-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div className="col-span-1 flex flex-col justify-between">
    <div className="mb-2">
      {/* <h2 className="text-xl text-gray-900">Name:</h2> */}
      <button
              onClick={onClose}
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
      <h2 className="text-xl text-center font-bold">{name}</h2>
    </div>
    <div className="flex justify-between mb-5">
      {/* <p className="text-gray-900 mr-5">Description:</p> */}
      <p className="text-gray-700 text-center">{description}</p>
    </div>
    <hr className="w-[75%] m-auto"/>
    <div className="flex justify-between mb-2 mt-4">
      <p className="text-gray-900">Price:</p>
      <p className="text-gray-800 text-lg font-medium">${price}</p>
    </div>
    <div className="flex justify-between mb-2">
      <p className="text-gray-900">Category:</p>
      <p className="text-gray-600">{category}</p>
    </div>
    <div className="flex justify-between mb-2">
      <p className="text-gray-900">Stock:</p>
      <p className="font-medium text-lg text-red-500">{stock}</p>
    </div>
  </div>
</div>


                  <div className="card-actions justify-between">
                    {images.length > 1 && (
                      <>
                        <div className="flex items-center justify-center">
                          <button
                            className="btn btn-primary flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            onClick={handlePrevImage}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="w-4 h-4 "
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                              ></path>
                            </svg>
                            Previous
                          </button>
                          <button
                            className="btn btn-primary flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            onClick={handleNextImage}
                          >
                            {" "}
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
                      </>
                    )}
                    <button
                      className="btn btn-primary block w-full p-1 text-white bg-primary hover:bg-secondary border border-transparent rounded-lg shadow-sm "
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductView;
