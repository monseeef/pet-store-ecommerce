import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deletePet,
  fetchPets,
} from "../../services/reducer/petSlice";
import PetModal from "./petModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "../ui/table";

const PetComponent = () => {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.value);
  const status = useSelector((state) => state.pets.status);
  const error = useSelector((state) => state.pets.error);
  const totalPages = useSelector((state) => state.pets.totalPages);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const [totalPages, setTotalPages] = useState();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    age: "",
    gender: "",
    isVaccinated: false,
    availability: false,
    location: "",
    CategoryName: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    sortBy: "name", // Default sort by pet name
    sortDir: "asc", // Default sort direction (ascending)
  });

  useEffect(() => {
    dispatch(fetchPets({ currentPage, limit, search }));
  }, [currentPage, limit, search, dispatch]);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    });
  };

  const getFilteredAndSortedPets = () => {
    return (Array.isArray(pets) ? pets : [])
      .filter((pet) => {
        return (pet.name || "").toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (filterOptions.sortBy === "name") {
          return filterOptions.sortDir === "asc"
            ? (a.name || "").localeCompare(b.name || "")
            : (b.name || "").localeCompare(a.name || "");
        } else if (filterOptions.sortBy === "age") {
          return filterOptions.sortDir === "asc"
            ? Number(a.age || 0) - Number(b.age || 0)
            : Number(b.age || 0) - Number(a.age || 0);
        }
        return 0;
      });
  };

  const handleAddPet = () => {
    setModalData({
      name: "",
      age: "",
      gender: "",
      isVaccinated: false,
      availability: false,
      location: "",
      CategoryName: "",
    });
    setShowModal(true);
  };

  const handleEditPet = (pet) => {
    setModalData(pet);
    setShowModal(true);
  };

  const handleDeletePet = (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      dispatch(deletePet(petId));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const filteredPets = getFilteredAndSortedPets();

  return (
    <div className="admin-page">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-title">Pets</h3>
              <p className="admin-subtitle">Manage adoptable pets and availability details.</p>
            </div>
            <button
              onClick={handleAddPet}
              className="admin-button"
            >
              <FontAwesomeIcon icon={faPlusSquare} /> Add Pet
            </button>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-8">
              <div className="admin-toolbar">
                <div className="flex justify-center items-center">
                  <div className="relative">
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
                      placeholder="Search pets..."
                      value={search}
                      onChange={handleSearch}
                      className="admin-input w-full ps-10 sm:w-72"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <select
                name="sortBy"
                className="admin-select"
                value={filterOptions.sortBy}
                onChange={handleSortChange}
              >
                <option value="name" className="bg-white">
                  Sort by Name
                </option>
                <option value="age" className="bg-white">
                  Sort by Age
                </option>
              </select>
              <select
                name="sortDir"
                className="admin-select"
                value={filterOptions.sortDir}
                onChange={handleSortChange}
              >
                <option value="asc" className="bg-white">
                  Ascending
                </option>
                <option value="desc" className="bg-white">
                  Descending
                </option>
              </select>
            </div>

            <div className="admin-table-wrap">
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/5 md:w-auto col">
                      Pet Name
                    </TableHead>
                    <TableHead className="w-1/5 md:w-auto col">Age</TableHead>
                    <TableHead className="w-1/5 md:w-auto col">
                      Gender
                    </TableHead>
                    <TableHead className="w-1/5 md:w-auto col">
                      Location
                    </TableHead>
                    <TableHead className="w-1/5 md:w-auto col">
                      Vaccination
                    </TableHead>
                    <TableHead className="w-1/5 md:w-auto col">
                      Availability
                    </TableHead>
                    <TableHead className="w-1/5 md:w-auto">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {status === "loading" && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Loading pets...
                      </TableCell>
                    </TableRow>
                  )}
                  {status === "failed" && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-red-500">
                        {error || "Unable to load pets."}
                      </TableCell>
                    </TableRow>
                  )}
                  {status !== "loading" && status !== "failed" && filteredPets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No pets found.
                      </TableCell>
                    </TableRow>
                  )}
                  {status !== "loading" && status !== "failed" && filteredPets.map((pet) => (
                    <TableRow key={pet._id} className="h-[52px]">
                      <TableCell className="w-1/5 md:w-auto text-center ">
                        {pet.name || "Unnamed pet"}
                      </TableCell>
                      <TableCell className="w-1/5 md:w-auto text-center">
                        {pet.age ?? "-"}
                      </TableCell>
                      <TableCell
                        className={`w-1/5 md:w-auto capitalize flex items-center justify-center`}
                      >
                        {pet.gender === "male" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="blue"
                              d="M20 4v6h-2V7.425l-3.975 3.95q.475.7.725 1.488T15 14.5q0 2.3-1.6 3.9T9.5 20t-3.9-1.6T4 14.5t1.6-3.9T9.5 9q.825 0 1.625.237t1.475.738L16.575 6H14V4zM9.5 11q-1.45 0-2.475 1.025T6 14.5t1.025 2.475T9.5 18t2.475-1.025T13 14.5t-1.025-2.475T9.5 11"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#e600b4"
                              d="M11 21v-2H9v-2h2v-2.1q-1.975-.35-3.238-1.888T6.5 9.45q0-2.275 1.613-3.862T12 4t3.888 1.588T17.5 9.45q0 2.025-1.263 3.563T13 14.9V17h2v2h-2v2zm1-8q1.45 0 2.475-1.025T15.5 9.5t-1.025-2.475T12 6T9.525 7.025T8.5 9.5t1.025 2.475T12 13"
                            />
                          </svg>
                        )}
                      </TableCell>
                      <TableCell className="w-1/5 md:w-auto text-center">
                        {pet.location || "-"}
                      </TableCell>
                      <TableCell className="w-1/5 md:w-auto text-center">
                        <span
                          className={
                            pet.isVaccinated ? "text-green-500" : "text-red-500"
                          }
                        >
                          {pet.isVaccinated ? (
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
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
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
                              </svg>{" "}
                            </div>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="w-1/5 md:w-auto text-center">
                        <span
                          className={`
                            ${
                              pet.availability
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                        >
                          {pet.availability ? (
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
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
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
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                        <button
                          className="admin-icon-button"
                          aria-label={`Edit ${pet.name || "pet"}`}
                          onClick={() => handleEditPet(pet)}
                        >
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
                          className="admin-icon-button hover:border-red-200 hover:bg-red-50"
                          aria-label={`Delete ${pet.name || "pet"}`}
                          onClick={() => handleDeletePet(pet._id)}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <nav aria-label="Pet pagination">
              <ul className="flex items-center justify-center gap-4">
                <li>
                  <button
                    onClick={() => handlePagination(currentPage - 1)}
                    className="admin-button-secondary"
                    disabled={currentPage === 1}
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
                </li>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages).keys()].map((page) => (
                    <li key={page + 1}>
                      <button
                        onClick={() => handlePagination(page + 1)}
                        className={`relative block rounded-md px-3 py-1.5 text-sm transition-all duration-300 ${
                          currentPage === page + 1
                            ? "bg-primary hover:bg-secondary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                </div>
                <li>
                  <button
                    onClick={() => handlePagination(currentPage + 1)}
                    className="admin-button-secondary"
                    disabled={currentPage === totalPages}
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
                </li>
              </ul>
            </nav>
          </div>
          {showModal && (
            <PetModal
              petData={modalData}
              handleClose={handleModalClose}
            />
          )}
      </div>
    </div>
  );
};

export default PetComponent;
