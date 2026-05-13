import { useEffect, useState } from "react";
import PetCards from "./PetCards";
import PetModal from "./PetModal";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/services/reducer/authSlice";
import api from "@/services/api";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const [searchCriteria, setSearchCriteria] = useState("-1"); // Default criteria
  const [sortCriteria, setSortCriteria] = useState("name"); // Default sorting criteria
  const [availabilityFilter, setAvailabilityFilter] = useState({
    available: false,
    notAvailable: false,
  });
  const [ageFilter, setAgeFilter] = useState(20); // Default age filter value
  const [categoryFilter, setCategoryFilter] = useState([]); // Default category filter value
  const [locations, setLocations] = useState({
    Casablanca: false,
    Rabat: false,
    Tanger: false,
    Marrakech: false,
    Agadir: false,
    "El Jadida": false,
    Mohammedia: false,
    Fes: false,
  });

  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [isHovered, setIsHovered] = useState(null); // State to manage hovered item
  const user = useSelector((state) => state.auth.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          query: searchQuery,
          page: currentPage,
          sort: sortCriteria,
          minAge: 0,
          maxAge: ageFilter,
        };
  
        // Add availability filter to the API URL only if available checkbox is checked
        const availabilityOptions = [];
        if (availabilityFilter.available) availabilityOptions.push("true");
        if (availabilityFilter.notAvailable) availabilityOptions.push("false");
        if (availabilityOptions.length > 0) {
          params.availability = availabilityOptions;
        }
  
        // Add category filter to the API URL
        if (categoryFilter.length > 0) {
          params.category = categoryFilter;
        }
        // Construct location filter based on selected options
        const selectedLocations = Object.entries(locations)
          .filter(([_, isSelected]) => isSelected)
          .map(([location, _]) => location);
        if (selectedLocations.length > 0) {
          params.location = selectedLocations;
        }
        const response = await api.get("/pets", { params });
        const payload = response.data;
        const nextPets = Array.isArray(payload) ? payload : payload?.pets || payload?.data || [];
        setPets(Array.isArray(nextPets) ? nextPets : []);
        setTotalPages(Number(payload?.totalPages || 1));
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Unable to load pets.");
        setPets([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [currentPage, searchQuery, sortCriteria, availabilityFilter, ageFilter, categoryFilter, locations]);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const backgroundImageStyle = {
    backgroundImage: 'url("/pets-bg.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "600px",
  };

  const handleAddPet = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePetSubmit = async (formData) => {
    try {
      // Make API call to add the pet
      // Dispatch action to add pet using Redux if needed
      // Close the modal after successful addition
      setShowModal(false);
      // Optionally, you can update the pets list to reflect the new addition immediately
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to add pet.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (key) => {
    setAvailabilityFilter((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
    setCurrentPage(1);
  };

  const handleLocationChange = (location) => {
    setLocations((current) => ({
      ...current,
      [location]: !current[location],
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchCriteria("-1");
    setSortCriteria("name");
    setAvailabilityFilter({ available: false, notAvailable: false });
    setAgeFilter(20);
    setCategoryFilter([]);
    setLocations((current) =>
      Object.keys(current).reduce((next, location) => {
        next[location] = false;
        return next;
      }, {})
    );
    setCurrentPage(1);
  };

  return (
    <div>
      <Navbar />
      <div className=" bg-gray-500">
        <section
          className="w-full pt-32 md:pt-32 pb-10"
          style={backgroundImageStyle}
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl tracking-wide font-primary font-bold sm:text-4xl text-primary">
              Find Your Furry Friend
            </h1>
            <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
              Browse our selection of adorable pets waiting to be adopted into
              their forever homes.
            </p>
          </div>

          {/* <img src="../../../petss.png"/> */}
        </section>
      </div>
      <div className="w-full py-5 md:py-5 lg:py-5 bg-gray-100 dark:bg-gray-800">
        <div className="relative  flex w-full flex-col justify-center p-2 sm:flex-row sm:items-center sm:p-0">
          <div className="flex gap-4 items-center justify-center mb-5">
            <label
              className="focus-within:ring flex items-center justify-center h-10  bg-gray-200 ring-primary"
              htmlFor="category"
            >
              <select
                className="bg-transparent px-6  outline-none cursor-pointer"
                name="category"
                id="category"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
              >
                <option value="-1">Choose criteria</option>
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="location">Location</option>
              </select>
            </label>

            <div className="flex">
              <input
                type="name"
                name="search"
                className="px-4 py-2 border border-primary ring-primary  shadow-sm sm:text-sm flex-grow"
                placeholder="Search by name, location, etc."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="bg-primary p-2  flex items-center justify-center hover:bg-primary cursor-pointer">
                <FaSearch className="text-white" onClick={handleSearch} />
              </div>
            </div>

            {/* Sorting */}
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="flex items-center bg-gray-200 p-2"
                    variant="outline"
                  >
                    <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] z-50 bg-white p-1"
                >
                  <DropdownMenuRadioGroup
                    value={sortCriteria}
                    onValueChange={(value) => {
                      setSortCriteria(value);
                      setCurrentPage(1); // Reset to first page when sorting changes
                    }}
                  >
                    <DropdownMenuRadioItem
                      value="name"
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Name A-Z
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="nameDesc"
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Name Z-A
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="updatedAt"
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Recently Added
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="updatedAtDesc"
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Oldest Added
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="age"
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Age: Low to High
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="ageDesc"
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Age: High to Low
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleAddPet}
                className="flex justify-center text-center py-2 px-4 hover:bg-green-600  bg-green-500 text-white"
              >
                <FaPlusSquare className="m-1" /> <p> Add Pet</p>
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1 bg-gray-200">
          <div className="w-64 p-4 bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={availabilityFilter.available}
                  onChange={() => handleAvailabilityChange("available")}
                  className="form-checkbox"
                />
                <span className="ml-2">Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={availabilityFilter.notAvailable}
                  onChange={() => handleAvailabilityChange("notAvailable")}
                  className="form-checkbox"
                />
                <span className="ml-2">Not Available</span>
              </label>
            </div>

            {/* filter by age */}
            <div className="mb-4">
              <button className="w-full text-left font-semibold">Age</button>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="20"
                  className="w-full accent-primary"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                />
                <div className="flex justify-between text-sm ">
                  <span>0</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button className="w-full text-left font-semibold">
                Category
              </button>
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={categoryFilter.includes("Cats")}
                    onChange={() => handleCategoryChange("Cats")}
                  />
                  <span className="ml-2">Cats</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={categoryFilter.includes("Dogs")}
                    onChange={() => handleCategoryChange("Dogs")}
                  />
                  <span className="ml-2">Dogs</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <button className="w-full text-left font-semibold">
                Location
              </button>
              <div className="mt-2">
                {Object.entries(locations).map(([location, isSelected]) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={isSelected}
                      onChange={() => handleLocationChange(location)}
                    />
                    <span className="ml-2">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 bg-primary hover:bg-secondary text-white font-bold"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <section className="md:col-span-4 my-4">
          <div className="container px-4 md:px-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center text-red-700">
                {error}
              </div>
            ) : (
              <>
                {pets.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pets.map((pet) => (
                      <PetCards
                        key={pet._id}
                        // onBlur={() => setIsHovered(null)}
                        setIsHovered={setIsHovered}
                        isHovered={isHovered}
                        id={pet._id}
                        image={pet.image}
                        name={pet.name || "Pet"}
                        age={pet.age ?? 0}
                        location={pet.location || "Location unavailable"}
                        description={pet.description}
                        availability={pet.availability}
                        category={pet.CategoryName || "Pet"}
                        date={pet.updatedAt}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center">No pets found.</div>
                )}

                <div className="flex justify-center my-8">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all  select-none active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
                      currentPage === 1
                        ? "text-gray-900  pointer-events-none"
                        : "text-gray-600 hover:bg-neutral-200"
                    }`}
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
                  {[...Array(Math.max(totalPages, 1))].map((_, index) => (
                    <button
                      key={index}
                      className={`mx-2 px-4 py-2  ${
                        currentPage === index + 1
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all select-none active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
                      currentPage === totalPages
                        ? "text-gray-900  pointer-events-none"
                        : "text-gray-600 hover:bg-neutral-200"
                    }`}
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
              </>
            )}
          </div>
        </section>
      </div>
      {showModal && (
        <PetModal
          isOpen={showModal}
          handleClose={closeModal}
          handleSubmit={handlePetSubmit}
        />
      )}{" "}
      {/* Modal component */}
      <Footer />
    </div>
  );
};

export default Pets;


