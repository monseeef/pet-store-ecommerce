import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {
  deletePet,
  fetchPets,
} from "../../services/reducer/petSlice";
import PetModal from "./petModal";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, PawPrint, Pencil, Plus, Search, Trash2, X } from "lucide-react";
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
  const [limit] = useState(10);
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
              <Plus className="h-4 w-4" /> Add Pet
            </button>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-8">
              <div className="admin-toolbar">
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <Search className="h-4 w-4 text-amber-700" aria-hidden="true" />
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
                      <TableCell colSpan={7}>
                        <div className="admin-empty-state">Loading pets...</div>
                      </TableCell>
                    </TableRow>
                  )}
                  {status === "failed" && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="admin-empty-state border-red-200 bg-red-50 text-red-700">
                          <AlertTriangle className="mx-auto mb-3 h-8 w-8" />
                          {error || "Unable to load pets."}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {status !== "loading" && status !== "failed" && filteredPets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="admin-empty-state">
                          <PawPrint className="mx-auto mb-3 h-8 w-8 text-amber-600" />
                          No pets found.
                        </div>
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
                          <span className="admin-badge bg-sky-50 text-sky-700">
                            <PawPrint className="h-3.5 w-3.5" /> Male
                          </span>
                        ) : (
                          <span className="admin-badge bg-pink-50 text-pink-700">
                            <PawPrint className="h-3.5 w-3.5" /> Female
                          </span>
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
                          <span className={`admin-badge ${pet.isVaccinated ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {pet.isVaccinated ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            {pet.isVaccinated ? "Vaccinated" : "No"}
                          </span>
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
                          <span className={`admin-badge ${pet.availability ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {pet.availability ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            {pet.availability ? "Available" : "Reserved"}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                        <button
                          className="admin-icon-button"
                          aria-label={`Edit ${pet.name || "pet"}`}
                          onClick={() => handleEditPet(pet)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="admin-icon-button-danger"
                          aria-label={`Delete ${pet.name || "pet"}`}
                          onClick={() => handleDeletePet(pet._id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                </li>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages).keys()].map((page) => (
                    <li key={page + 1}>
                      <button
                        onClick={() => handlePagination(page + 1)}
                        className={`admin-pagination-button ${
                          currentPage === page + 1
                            ? "admin-pagination-button-active"
                            : ""
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
                    <ArrowRight className="h-4 w-4" />
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
