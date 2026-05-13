import React, { useEffect, useState } from "react";
import { createUser, updateUser } from "../../services/reducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UserForm = ({ isOpen, onClose, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEditMode = !!userId; // Check if userId exists, indicating edit mode

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const userToEdit = useSelector((state) =>
    state.user.allUsers.find((user) => user._id === userId)
  );

  useEffect(() => {
    // If in edit mode, populate form fields with user data
    if (isEditMode && userToEdit) {
      setFirstName(userToEdit.firstName);
      setLastName(userToEdit.lastName);
      setEmail(userToEdit.email);
      setIsAdmin(userToEdit.isAdmin);
      setUsername(userToEdit.username);
    }
  }, [isEditMode, userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      username,
      firstName,
      lastName,
      email,
      password,
      isAdmin,
    };

    if (isEditMode) {
      // If in edit mode, dispatch update user action
      dispatch(updateUser({ id: userId, ...formData }));
    } else {
      // If in add mode, dispatch create user action
      dispatch(createUser(formData));
      handelClose();
    }

    // navigate('/users');
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsAdmin(e.target.value === "true");
  };

  const handelClose = () => {
    onClose();
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setIsAdmin(false);
  };

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

  return (
    <>
      {isOpen && (
        // {/* Card Section */}
        // <div className="max-w-sm w-full bg-white shadow-md rounded-lg p-6">
        // {/* <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto"> */}
        // {/* Card */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-100 shadow p-3">
            <div className="bg-white p-5 rounded-lg">
              <div className="mb-8">
                <h2 className="text-xl text-gray-800 mb-3 ">
                  {isEditMode ? "Edit User" : "Add User"}
                </h2>
                <p className="text-sm text-gray-600 ">
                  {isEditMode
                    ? "Update your user information."
                    : "Create your username, password, and account settings."}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Grid */}
                <div className="grid sm:grid-cols-8 w-[350px] gap-2 sm:gap-6">
                  {/* Full Name Fields */}

                  <div className="sm:col-span-9">
                    <div className="sm:flex gap-5">
                      <input
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        autoComplete="given-name"
                        required
                        type="text"
                        className="block py-2 px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                      />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        required
                        placeholder="Last Name"
                        className="block py-2 px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                      />
                    </div>
                  </div>

                  {/* End Full Name Fields */}
                  {/* Username Field */}
                  <div className="sm:col-span-9">
                    <input
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                      required
                      type="text"
                      className="block py-2 px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                    />
                  </div>
                  {/* End Username Field */}

                  {/* Email Field */}

                  <div className="sm:col-span-9">
                    <input
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      placeholder="Email"
                      type="email"
                      className="block py-2 px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                    />
                  </div>
                  {/* End Email Field */}

                  {/* Password Field */}

                  <div className="sm:col-span-9">
                    <div className="space-y-2">
                      <input
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordInput}
                        autoComplete="new-password"
                        required
                        placeholder="Enter your password"
                        type="text"
                        className="block py-2 px-0 w-full text-sm  bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-gray-500 focus:outline-none focus:ring-0 focus:border-primary peer"
                      />
                    </div>
                  </div>
                  {/* End Password Field */}

                  {/* Role Field */}

                  <div className="sm:col-span-9">
                    <div className="sm:flex">
                      <label
                        htmlFor="Admin"
                        className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10  disabled:opacity-50 disabled:pointer-events-none "
                      >
                        <input
                          type="radio"
                          value={true}
                          name="isAdmin"
                          onChange={handleCheckboxChange}
                          id="Admin"
                          checked={isAdmin === true}
                          defaultChecked={false}
                          className="shrink-0 mt-0.5 border-gray-300 rounded-full disabled:opacity-50 disabled:pointer-events-none "
                        />
                        <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">
                          Admin
                        </span>
                      </label>
                      <label
                        htmlFor="User"
                        className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10  disabled:opacity-50 disabled:pointer-events-none "
                      >
                        <input
                          type="radio"
                          value={false}
                          name="isAdmin"
                          onChange={handleCheckboxChange}
                          id="User"
                          checked={isAdmin === false}
                          defaultChecked={false}
                          className="shrink-0 mt-0.5 border-gray-300 rounded-full  disabled:opacity-50 disabled:pointer-events-none "
                        />
                        <span className="text-sm text-gray-500 ms-3 ">
                          User
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* End Role Field */}
                </div>
                {/* End Grid */}

                {/* Button Section */}
                <div className="mt-5 flex justify-end gap-x-2">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-primary bg-white text-primary shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isEditMode ? "Save changes" : "Create User"}
                  </button>
                </div>
                {/* End Button Section */}
              </form>
            </div>
          </div>
          {/* End Card */}
        </div>
        // {/* End Card Section */}
      )}
    </>
  );
};

export default UserForm;
