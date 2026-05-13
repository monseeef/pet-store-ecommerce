import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../../services/reducer/userSlice";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserDetail from "./UserDetail";

const UserList = () => {
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // Add state for showing add user form
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Ensure local state for currentPage
  // const currentPage = useSelector((state) => state.user.currentPage);

  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.allUsers);
  const totalPages = useSelector((state) => state.user.totalPages);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getAllUsers({ limit, searchTerm, sortBy, sortOrder, currentPage })
    );
  }, [dispatch, limit, searchTerm, sortBy, sortOrder, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(
      getAllUsers({
        currentPage: newPage,
        limit,
        searchTerm,
        sortBy,
        sortOrder,
      })
    );
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 1 ? -1 : 1);
    } else {
      setSortBy(key);
      setSortOrder(1);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      dispatch(deleteUser(deleteUserId));
      setDeleteUserId(null);
      setDeleteModalOpen(false);
    }
  };

  const closeModal = () => {
    setDeleteUserId(null);
    setDeleteModalOpen(false);
  };
  const handleOpenEditForm = (userId) => {
    setIsEditFormOpen(true);
    setEditUserId(userId);
    setShowAddUserForm(false);

  };
  const handleAddUserClick = () => {
    setShowAddUserForm(true);
    setIsEditFormOpen(false);
  };

  const handleOpenViewForm = (userId) => {
    setViewUserId(userId);
    setIsViewFormOpen(true);
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

  const handleCloseForm = () => {
    setShowAddUserForm(false);
  };
  const handleCloseEditForm = () => setIsEditFormOpen(false);
  const handleCloseViewForm = () => setIsViewFormOpen(false);

  
  return (
    <>
      <div className="admin-page">
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-title">Users</h3>
                <p className="admin-subtitle">Manage customers and staff roles.</p>
              </div>
              <button
                onClick={handleAddUserClick}
                className="admin-button"
              >
                <FontAwesomeIcon icon={faPlusSquare} /> Add User
              </button>
            </div>
            <div className="flex flex-col gap-6 p-5">
              <div className="admin-toolbar">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="mr-5">
                  <span className="text-sm text-slate-500">Items per page:&nbsp;</span>
                  <select
                    className="admin-select"
                    value={limit}
                    onChange={handleLimitChange}
                  >
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={7}>7</option>
                  </select>
                </div>
                <div className="relative mr-5">
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
                    className="admin-input w-full ps-10 sm:w-72"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                </div>
              </div>
              {showAddUserForm && ( // Conditionally render the form
                <div className="p-3 bg-gray-200 rounded-lg">
                  <UserForm isOpen={showAddUserForm} onClose={handleCloseForm} />
                </div>
              )}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        onClick={() => handleSort("firstName")}
                      >
                        Firstname{" "}
                        {sortBy === "firstName" &&
                          (sortOrder === 1 ? "▲" : "▼")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        onClick={() => handleSort("lastName")}
                      >
                        LastName{" "}
                        {sortBy === "lastName" && (sortOrder === 1 ? "▲" : "▼")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 truncate"
                        onClick={() => handleSort("email")}
                      >
                        Email{" "}
                        {sortBy === "email" && (sortOrder === 1 ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("username")}>
                        Username{" "}
                        {sortBy === "username" && (sortOrder === 1 ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("isAdmin")}>
                        Is Admin{" "}
                        {sortBy === "isAdmin" && (sortOrder === 1 ? "▲" : "▼")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                      >
                        <td className="px-6 py-3">{user.firstName}</td>
                        <td className="px-6 py-3">{user.lastName}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">{user.username}</td>
                        <td className="px-6 py-3">
                          {user.isAdmin ? (
                            <div className="flex justify-center items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="none"
                                  stroke="green"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2.5"
                                  d="M20 7L10 17l-5-5"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 15 15"
                              >
                                <path
                                  fill="red"
                                  fillRule="evenodd"
                                  d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 flex h-[100px] items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenViewForm(user._id)}
                            className="admin-icon-button"
                            aria-label={`View ${user.username || "user"}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.5em"
                              height="1.5em"
                              viewBox="0 0 32 32"
                            >
                              <circle
                                cx={16}
                                cy={16}
                                r={4}
                                fill="blue"
                              ></circle>
                              <path
                                fill="blue"
                                d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"
                              ></path>
                            </svg>
                          </button>
                          <button className="admin-icon-button" aria-label={`Edit ${user.username || "user"}`} onClick={() => handleOpenEditForm(user._id)}>
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
                            onClick={() => handleDeleteClick(user._id)}
                            className="admin-icon-button hover:border-red-200 hover:bg-red-50"
                            aria-label={`Delete ${user.username || "user"}`}
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

              {/* Pagination */}
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
                  className="admin-button-secondary"
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
                      className={`relative block rounded-md px-3 py-1.5 text-sm transition-all duration-300 ${
                        currentPage === index + 1
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="admin-button-secondary"
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
          </div>
          {/* Delete confirmation modal */}
          {deleteModalOpen && (
            <div className="admin-modal-backdrop">
              <div className="admin-modal max-w-sm">
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={confirmDelete}
                    className="admin-button-danger mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={closeModal}
                    className="admin-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      <UserForm
        isOpen={isEditFormOpen}
        onClose={handleCloseEditForm}
        userId={editUserId}
      />
      <UserDetail
        isOpen={isViewFormOpen}
        onClose={handleCloseViewForm}
        userId={viewUserId}
      />
    </>
  );
};

export default UserList;
