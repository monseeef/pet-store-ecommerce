import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, HeartHandshake, PawPrint, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import FeaturedProducts from "../components/FeaturedProducts";
import { fetchUser } from "@/services/reducer/authSlice";
import api from "@/services/api";

const trustBadges = [
  { icon: Truck, title: "Fast delivery", text: "Fresh supplies delivered quickly." },
  { icon: Sparkles, title: "Vet-approved", text: "Products chosen for everyday care." },
  { icon: ShieldCheck, title: "Secure checkout", text: "Protected payment experience." },
];

const Home = () => {
  const dispatch = useDispatch();
  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    const loadPets = async () => {
      try {
        setPetsLoading(true);
        setPetsError("");
        const response = await api.get("/pets", { params: { page: 1, limit: 3 } });
        if (isMounted) {
          setPets(Array.isArray(response.data?.pets) ? response.data.pets : []);
        }
      } catch (error) {
        if (isMounted) {
          setPetsError(error.response?.data?.message || "Pets are unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setPetsLoading(false);
        }
      }
    };

    loadPets();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");
        const response = await api.get("/categories", { params: { page: 1, limit: 4 } });
        const nextCategories = Array.isArray(response.data?.categories)
          ? response.data.categories
          : Array.isArray(response.data)
          ? response.data
          : [];
        if (isMounted) {
          setCategories(nextCategories.slice(0, 4));
        }
      } catch (error) {
        if (isMounted) {
          setCategoriesError(error.response?.data?.message || "Categories are unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="pet-page">
      <Navbar />

      <main>
        <section className="pet-container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="pet-eyebrow">Premium pet essentials</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Find everything your pet needs in one place.
            </h1>
            <p className="pet-copy mt-6 max-w-2xl text-lg">
              Petopia brings real product browsing, secure checkout, and friendly adoption discovery into one polished pet commerce experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="pet-button-primary" to="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Products
              </Link>
              <Link className="pet-button-secondary" to="/pets">
                Explore Pets
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {trustBadges.map((item) => (
                <motion.div key={item.title} whileHover={{ y: -4 }} className="pet-card p-4">
                  <item.icon className="h-6 w-6 text-amber-600" />
                  <h3 className="mt-3 font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute inset-6 rounded-[2rem] bg-amber-200/50 blur-3xl" />
            <div className="pet-card relative overflow-hidden p-4">
              <img
                src="/landing-dog.png"
                alt="Happy dog with pet store products"
                className="aspect-[4/4.25] w-full rounded-[1.5rem] object-contain"
              />
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white/90 p-4 shadow-lg backdrop-blur">
                <p className="text-sm font-bold text-slate-950">Curated for comfort</p>
                <p className="mt-1 text-sm text-slate-500">Food, care, and play essentials your pet can trust.</p>
              </div>
            </div>
          </motion.div>
        </section>

        <FeaturedProducts />

        <section className="pet-section bg-white">
          <div className="pet-container">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="pet-eyebrow">Shop by category</p>
                <h2 className="pet-title mt-2">Real catalog groups from the admin dashboard</h2>
              </div>
              <Link className="pet-button-secondary w-fit" to="/products">
                Explore catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {categoriesLoading && <div className="pet-empty-state">Loading categories...</div>}
            {categoriesError && !categoriesLoading && (
              <div className="pet-empty-state">
                <Boxes className="mx-auto h-10 w-10 text-red-500" />
                <p className="mt-3 text-sm font-bold text-red-700">{categoriesError}</p>
              </div>
            )}
            {!categoriesLoading && !categoriesError && categories.length === 0 && (
              <div className="pet-empty-state">
                <Boxes className="mx-auto h-10 w-10 text-amber-600" />
                <h3 className="mt-3 text-xl font-black text-slate-950">No categories yet</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">Create categories in admin to feature them here.</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category._id || category.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="pet-card group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-600 group-hover:text-white">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-950">{category.name || "Category"}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {category.description || "Managed catalog category for product discovery."}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="pet-section">
          <div className="pet-container">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="pet-eyebrow">Meet our pets</p>
                <h2 className="pet-title mt-2">Adoptable companions, browsed with care</h2>
              </div>
              <Link className="pet-button-secondary w-fit" to="/pets">
                Browse pets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {petsLoading && <div className="pet-empty-state">Loading adoptable pets...</div>}
            {petsError && !petsLoading && (
              <div className="pet-empty-state">
                <PawPrint className="mx-auto h-10 w-10 text-red-500" />
                <p className="mt-3 text-sm font-bold text-red-700">{petsError}</p>
              </div>
            )}
            {!petsLoading && !petsError && pets.length === 0 && (
              <div className="pet-empty-state">
                <PawPrint className="mx-auto h-10 w-10 text-amber-600" />
                <h3 className="mt-3 text-xl font-black text-slate-950">No pets listed yet</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">Seed or add pets to feature them here.</p>
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-3">
              {pets.map((pet, index) => (
                <motion.article
                  key={pet._id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="pet-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link to={`/pets/${pet._id}`}>
                    <div className="aspect-[4/3] overflow-hidden bg-amber-50">
                      <img
                        src={pet.image || "/product-placeholder.svg"}
                        alt={pet.name || "Adoptable pet"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src = "/product-placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-black text-slate-950">{pet.name || "Pet"}</h3>
                        <span className={`pet-badge ${pet.availability ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {pet.availability ? "Available" : "Reserved"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-500">
                        {[pet.CategoryName, pet.location].filter(Boolean).join(" - ") || "Petopia adoption listing"}
                      </p>
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                        {pet.description || "A friendly companion ready for a thoughtful home."}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="pet-section bg-white">
          <div className="pet-container">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="pet-eyebrow">Why Petopia</p>
                <h2 className="pet-title mt-2">A realistic pet store experience with a polished product core.</h2>
                <p className="pet-copy mt-4">
                  Built around real catalog data, authenticated shopping flows, and an admin-managed inventory system.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: ShoppingBag, title: "Curated essentials", text: "Products come from the managed catalog, not static filler." },
                  { icon: ShieldCheck, title: "Secure checkout", text: "Orders use backend-calculated totals and protected user flows." },
                  { icon: Boxes, title: "Admin-managed catalog", text: "Inventory, categories, stock, and orders are maintained in the dashboard." },
                  { icon: HeartHandshake, title: "Adoption browsing", text: "Pets use real API data with filters, search, and graceful empty states." },
                ].map((item) => (
                  <motion.div key={item.title} whileHover={{ y: -4 }} className="pet-card p-5">
                    <item.icon className="h-6 w-6 text-amber-600" />
                    <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pet-section">
          <div className="pet-container">
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 md:p-12">
              <p className="pet-eyebrow text-amber-300">Ready when your cart is</p>
              <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <h2 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                  Find everything your pet needs in one place.
                </h2>
                <Link className="pet-button-primary bg-amber-500 hover:bg-amber-400" to="/products">
                  Start shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
