import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  PawPrint,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import PetCards from "./PetCards";
import PetModal from "./PetModal";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/services/reducer/authSlice";
import api from "@/services/api";

const locationsSeed = {
  Casablanca: false,
  Rabat: false,
  Tanger: false,
  Marrakech: false,
  Agadir: false,
  "El Jadida": false,
  Mohammedia: false,
  Fes: false,
};

const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "nameDesc", label: "Name Z-A" },
  { value: "updatedAt", label: "Recently Added" },
  { value: "updatedAtDesc", label: "Oldest Added" },
  { value: "age", label: "Age: Low to High" },
  { value: "ageDesc", label: "Age: High to Low" },
];

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [availabilityFilter, setAvailabilityFilter] = useState({
    available: false,
    notAvailable: false,
  });
  const [ageFilter, setAgeFilter] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [locations, setLocations] = useState(locationsSeed);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
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

        const availabilityOptions = [];
        if (availabilityFilter.available) availabilityOptions.push("true");
        if (availabilityFilter.notAvailable) availabilityOptions.push("false");
        if (availabilityOptions.length > 0) params.availability = availabilityOptions;
        if (categoryFilter.length > 0) params.category = categoryFilter;

        const selectedLocations = Object.entries(locations)
          .filter(([, isSelected]) => isSelected)
          .map(([location]) => location);
        if (selectedLocations.length > 0) params.location = selectedLocations;

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

  const handleAvailabilityChange = (key) => {
    setAvailabilityFilter((current) => ({ ...current, [key]: !current[key] }));
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
    setLocations((current) => ({ ...current, [location]: !current[location] }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortCriteria("name");
    setAvailabilityFilter({ available: false, notAvailable: false });
    setAgeFilter(20);
    setCategoryFilter([]);
    setLocations(locationsSeed);
    setCurrentPage(1);
  };

  const activeFilterCount =
    Number(Boolean(searchQuery)) +
    Number(availabilityFilter.available) +
    Number(availabilityFilter.notAvailable) +
    categoryFilter.length +
    Object.values(locations).filter(Boolean).length +
    Number(ageFilter < 20);

  return (
    <div className="pet-page">
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.28),transparent_32rem),linear-gradient(135deg,#fff8ec_0%,#fffaf2_45%,#f8efe2_100%)]" />
        <div className="pet-container relative grid gap-10 pb-12 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="pet-eyebrow inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Adoption marketplace
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find a companion with confidence and a little joy.
            </h1>
            <p className="pet-copy mt-5 max-w-2xl">
              Browse adoptable pets with clear filters, availability, location details, and a calmer experience built for real decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pets-results" className="pet-button-primary">
                <PawPrint className="h-4 w-4" />
                Browse pets
              </a>
              {isAuthenticated && (
                <button onClick={() => setShowModal(true)} className="pet-button-secondary">
                  <Plus className="h-4 w-4" />
                  Add pet
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="pet-glass-panel p-6"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric value={pets.length} label="Visible pets" />
              <Metric value={Object.values(locations).filter(Boolean).length || "All"} label="Locations" />
              <Metric value={ageFilter} label="Max age" />
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <HeartHandshake className="h-8 w-8 text-amber-300" />
              <p className="mt-4 text-lg font-black">Thoughtful adoption starts with better browsing.</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Filter by availability, category, age, and city without losing the friendly pet-store feel.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <main id="pets-results" className="pet-container py-10">
        <div className="grid gap-6 lg:grid-cols-[19rem_1fr]">
          <aside className="pet-glass-panel h-fit p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="pet-eyebrow">Refine</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Filters</h2>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="pet-icon-button" aria-label="Clear filters">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-5 space-y-6">
              <FilterGroup title="Availability">
                <CheckRow checked={availabilityFilter.available} onChange={() => handleAvailabilityChange("available")} label="Available" />
                <CheckRow checked={availabilityFilter.notAvailable} onChange={() => handleAvailabilityChange("notAvailable")} label="Reserved" />
              </FilterGroup>

              <FilterGroup title={`Age: up to ${ageFilter} years`}>
                <input
                  type="range"
                  min="0"
                  max="20"
                  className="w-full accent-amber-600"
                  value={ageFilter}
                  onChange={(e) => {
                    setAgeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>0</span>
                  <span>20</span>
                </div>
              </FilterGroup>

              <FilterGroup title="Category">
                {["Cats", "Dogs"].map((category) => (
                  <CheckRow
                    key={category}
                    checked={categoryFilter.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    label={category}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Location">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {Object.entries(locations).map(([location, isSelected]) => (
                    <CheckRow
                      key={location}
                      checked={isSelected}
                      onChange={() => handleLocationChange(location)}
                      label={location}
                    />
                  ))}
                </div>
              </FilterGroup>
            </div>
          </aside>

          <section>
            <div className="pet-glass-panel p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" />
                  <input
                    type="search"
                    className="pet-input pl-11"
                    placeholder="Search by name, city, or personality"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
                <label className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" />
                  <select
                    className="pet-input min-w-56 appearance-none pl-11"
                    value={sortCriteria}
                    onChange={(e) => {
                      setSortCriteria(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                {isAuthenticated && (
                  <button onClick={() => setShowModal(true)} className="pet-button-primary">
                    <Plus className="h-4 w-4" />
                    Add Pet
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[0, 1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="pet-card h-80 animate-pulse bg-gradient-to-br from-white to-amber-50" />
                  ))}
                </div>
              ) : error ? (
                <div className="pet-empty-state">
                  <PawPrint className="mx-auto h-10 w-10 text-red-500" />
                  <h3 className="mt-4 text-xl font-black text-slate-950">Pets could not load</h3>
                  <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>
                </div>
              ) : pets.length > 0 ? (
                <motion.div
                  layout
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {pets.map((pet) => (
                    <PetCards
                      key={pet._id}
                      setIsHovered={setIsHovered}
                      isHovered={isHovered}
                      id={pet._id}
                      image={pet.image}
                      name={pet.name || "Pet"}
                      age={pet.age ?? 0}
                      location={pet.location || "Location unavailable"}
                      availability={pet.availability}
                      category={pet.CategoryName || "Pet"}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="pet-empty-state">
                  <PawPrint className="mx-auto h-12 w-12 text-amber-600" />
                  <h3 className="mt-4 text-2xl font-black text-slate-950">No pets match these filters</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-500">
                    Try clearing a filter or expanding the age range to discover more companions.
                  </p>
                  <button onClick={clearFilters} className="pet-button-secondary mt-6">
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {!loading && !error && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="pet-button-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                {[...Array(Math.max(totalPages, 1))].map((_, index) => (
                  <button
                    key={index}
                    className={`h-11 min-w-11 rounded-full text-sm font-black transition ${
                      currentPage === index + 1
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                        : "bg-white text-slate-600 hover:bg-amber-50"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pet-button-secondary"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {showModal && (
        <PetModal
          isOpen={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
      <Footer />
    </div>
  );
};

const Metric = ({ value, label }) => (
  <div className="rounded-2xl bg-white p-4 text-center shadow-sm shadow-amber-950/5">
    <p className="text-2xl font-black text-slate-950">{value}</p>
    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
  </div>
);

const FilterGroup = ({ title, children }) => (
  <div>
    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const CheckRow = ({ checked, onChange, label }) => (
  <label className="pet-filter-chip w-full justify-between">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-amber-200 text-amber-600 focus:ring-amber-200"
    />
  </label>
);

export default Pets;
