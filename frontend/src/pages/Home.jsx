import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sponsor from "../components/Sponsor";
import Services from "../components/Services";
import FeaturedProducts from "../components/FeaturedProducts";
import { fetchUser } from "@/services/reducer/authSlice";

const trustBadges = [
  { icon: Truck, title: "Fast delivery", text: "Fresh supplies delivered quickly." },
  { icon: Sparkles, title: "Vet-approved", text: "Products chosen for everyday care." },
  { icon: ShieldCheck, title: "Secure checkout", text: "Protected payment experience." },
];

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="pet-page">
      <Navbar />

      <main>
        <section className="pet-container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <div>
            <p className="pet-eyebrow">Premium pet essentials</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Thoughtful care for pets who rule the house.
            </h1>
            <p className="pet-copy mt-6 max-w-2xl text-lg">
              Shop warm, reliable pet food, toys, grooming care, and adoption-friendly essentials in one calm, modern store.
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
                <div key={item.title} className="pet-card p-4">
                  <item.icon className="h-6 w-6 text-amber-600" />
                  <h3 className="mt-3 font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
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
          </div>
        </section>

        <section className="pet-section bg-white">
          <div className="pet-container">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="pet-eyebrow">Featured shop</p>
                <h2 className="pet-title mt-2">Popular picks for happy pets</h2>
              </div>
              <Link className="pet-button-secondary" to="/products">
                View all products
              </Link>
            </div>
            <FeaturedProducts />
          </div>
        </section>

        <section className="pet-section">
          <div className="pet-container">
            <div className="mb-8 text-center">
              <p className="pet-eyebrow">Services</p>
              <h2 className="pet-title mt-2">Care beyond the cart</h2>
            </div>
            <Services />
          </div>
        </section>

        <section className="pet-section bg-white">
          <div className="pet-container">
            <div className="mb-8 text-center">
              <p className="pet-eyebrow">Trusted partners</p>
              <h2 className="pet-title mt-2">Brands pet parents love</h2>
            </div>
            <Sponsor />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
