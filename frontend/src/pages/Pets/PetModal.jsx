import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { addPet } from "@/services/reducer/petSlice";

const PetModal = ({ isOpen, handleClose }) => {
    const userId = useSelector(state => state.auth.userId);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "male",
        isVaccinated: false,
        availability: true,
        location: "",
        description: "",
        CategoryName: "",
        image: null,
        userId : userId
    });
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        setFormData({
            name: "",
            age: "",
            gender: "male",
            isVaccinated: false,
            availability: true,
            location: "",
            description: "",
            CategoryName: "",
            image: null,
            userId : userId,
        });
        setFile(null);
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (file) {
                imageUrl = await uploadImage(file);
            }
            const newFormData = { ...formData, image: imageUrl };
            dispatch(addPet(newFormData)).then((result) => {
                if (addPet.fulfilled.match(result)) {
                    handleClose(); // Close the popup immediately after adding the pet
                    toast.success("Pet added successfully");
                }
            });
        } catch (err) {
            toast.error("Error adding pet");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "petcom");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dk28itsov/image/upload",
                formData
            );
            const { secure_url } = response.data;
            return secure_url;
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-y-auto">
            <div className="bg-gray-100 h-[95%] shadow p-3 overflow-y-auto">
                <div className="bg-white p-5 rounded-lg w-[350px] flex flex-col gap-3">
                    <div className="px-6 py-5">
                        <div className="">
                            <h3 className="text-xl text-gray-800 mb-3">Add New Pet</h3>
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
                            <form onSubmit={handleModalSubmit} className="flex flex-col gap-5">
                                {/* Form fields */}
                                <div className="">
                                    <label htmlFor="name" className="block mb-2 text-sm text-gray-900">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="age" className="block mb-2 text-sm text-gray-900">Age</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        min="0"
                                        step="any"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="gender" className="block mb-2 text-sm text-gray-900">Gender</label>
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
                                    <label htmlFor="isVaccinated" className="block mb-2 text-sm text-gray-900">Vaccinated</label>
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
                                        <label htmlFor="vaccinated-yes" className="mr-4 text-md">Yes</label>
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
                                        <label htmlFor="vaccinated-no" className="text-md">No</label>
                                    </div>
                                </div>
                                <div className="">
                                    <label htmlFor="availability" className="block mb-2 text-sm text-gray-900">Available</label>
                                    <div className="block px-0 w-full bg-transparent border-gray-300 dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer">
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
                                        <label htmlFor="available-yes" className="mr-4">Yes</label>
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
                                    <label htmlFor="location" className="block mb-2 text-sm text-gray-900">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="description" className="block mb-2 text-sm text-gray-900">Description</label>
                                    <textarea
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="CategoryName" className="block mb-2 text-sm text-gray-900">Category</label>
                                    <select
                                        id="CategoryName"
                                        name="CategoryName"
                                        value={formData.CategoryName}
                                        onChange={handleChange}
                                        className="block px-0 w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                                    >
                                        <option value=""></option>
                                        <option value="Dogs">Dogs</option>
                                        <option value="Cats">Cats</option>
                                    </select>
                                </div>
                                <div className="">
                                    <label htmlFor="image" className="block mb-2 text-sm text-gray-900">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
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


