import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../../services/reducer/userSlice";
import UserForm from "./UserForm";
import { ArrowLeft, ArrowRight, Eye, Pencil, Plus, Search, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
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
  const visibleUsers = Array.isArray(users) ? users : [];

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
                <Plus className="h-4 w-4" /> Add User
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
                    <Search className="h-4 w-4 text-amber-700" aria-hidden="true" />
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
                    {visibleUsers.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <div className="admin-empty-state">
                            <UserRound className="mx-auto mb-3 h-8 w-8 text-amber-600" />
                            No users found.
                          </div>
                        </td>
                      </tr>
                    )}
                    {visibleUsers.map((user) => (
                      <tr
                        key={user._id}
                      >
                        <td className="px-6 py-3">{user.firstName}</td>
                        <td className="px-6 py-3">{user.lastName}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">{user.username}</td>
                        <td className="px-6 py-3">
                          {user.isAdmin ? (
                            <span className="admin-badge bg-emerald-50 text-emerald-700">
                              <ShieldCheck className="h-3.5 w-3.5" /> Admin
                            </span>
                          ) : (
                            <span className="admin-badge bg-slate-100 text-slate-600">
                              <X className="h-3.5 w-3.5" /> Customer
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 flex h-[100px] items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenViewForm(user._id)}
                            className="admin-icon-button"
                            aria-label={`View ${user.username || "user"}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="admin-icon-button" aria-label={`Edit ${user.username || "user"}`} onClick={() => handleOpenEditForm(user._id)}>
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user._id)}
                            className="admin-icon-button-danger"
                            aria-label={`Delete ${user.username || "user"}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`admin-pagination-button ${
                        currentPage === index + 1
                          ? "admin-pagination-button-active"
                          : ""
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
                  <ArrowRight className="h-4 w-4" />
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
