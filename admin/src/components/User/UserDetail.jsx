import React, { useEffect, useRef, useState } from "react";
import api from "../../services/api";

const UserDetail = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
      }
    };

    if (isOpen) {
      fetchUser();
    }
  }, [userId, isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) {
    return null;
  }

  const isAdminToString = (isAdmin) => {
    return isAdmin ? "Yes" : "No";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-y-auto">
      <div ref={modalRef} className="bg-gray-100 shadow p-3 overflow-y-auto">
        <div className="bg-white p-3 shadow-md sm:rounded-lg relative">
          <h2 className="text-xl mb-5">User Details</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none bg-white rounded-full p-2"
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

          <table className="text-center w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="text-md text-gray-700 bg-gray-100">
                <th scope="col" className="px-6 py-3">
                  First Name
                </th>
                <td className="px-6 py-3">{user.firstName}</td>
              </tr>
              <tr className="text-md text-gray-700 bg-gray-100">
                <th scope="col" className="px-6 py-3">
                  Last Name
                </th>
                <td className="px-6 py-3">{user.lastName}</td>
              </tr>
              <tr className="text-md text-gray-700 bg-gray-100">
                <th scope="col" className="px-6 py-3 truncate">
                  Email
                </th>
                <td className="px-6 py-3">{user.email}</td>
              </tr>
              <tr className="text-md text-gray-700 bg-gray-100">
                <th>Username</th>
                <td className="px-6 py-3">{user.username}</td>
              </tr>
              <tr className="text-md text-gray-700 bg-gray-100">
                <th>Is Admin</th>
                <td className="px-6 py-3 flex justify-center items-center gap-1">
                  {user.isAdmin ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="green"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M20 7L10 17l-5-5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 15 15"
                    >
                      <path
                        fill="red"
                        fillRule="evenodd"
                        d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687 4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {isAdminToString(user.isAdmin)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="btn btn-primary block w-full p-1 text-white bg-primary hover:bg-secondary border border-transparent rounded-lg shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
