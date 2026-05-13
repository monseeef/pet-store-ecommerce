import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { logout } from "@/services/reducer/authSlice";
import CartMenu from "./CartMenu.jsx";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Pets", to: "/pets" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const user = useSelector((state) => state.auth.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate("/login"))
  };

  const renderLinks = (isMobile = false) =>
    navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) =>
          `${isMobile ? "block rounded-2xl px-4 py-3" : "rounded-full px-3 py-2"} text-sm font-semibold ${
            isActive
              ? "bg-amber-100 text-amber-800"
              : "text-slate-700 hover:bg-amber-50 hover:text-amber-800"
          }`
        }
      >
        {item.label}
      </NavLink>
    ));

  return (
    <header className="sticky top-0 z-50 border-b border-amber-100/80 bg-[#fffaf2]/95 backdrop-blur">
      <nav className="pet-container flex h-20 items-center justify-between gap-4" aria-label="Global">
        <Link to="/" className="flex items-center gap-3" aria-label="Petopia home">
          <img src="/logoo.png" alt="Petopia" className="h-12 w-auto" />
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold tracking-tight text-slate-950">Petopia</p>
            <p className="text-xs font-medium text-slate-500">Premium pet care</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-amber-100 bg-white p-1 shadow-sm lg:flex">
          {renderLinks()}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link className="pet-icon-button" to="/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>
              <button className="pet-icon-button relative" onClick={() => setCartMenuOpen(true)} aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[11px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  className="flex h-10 items-center gap-2 rounded-full bg-slate-900 px-3 text-sm font-bold text-white hover:bg-slate-800"
                  onClick={() => setProfileOpen((value) => !value)}
                >
                  <UserRound className="h-4 w-4" />
                  <span>{user?.username?.[0]?.toUpperCase() || "U"}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-amber-100 bg-white p-2 shadow-xl shadow-amber-950/10">
                    <Link className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50" to="/profile">
                      My Profile
                    </Link>
                    <button
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-amber-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link className="pet-button-secondary px-4 py-2" to="/login">
                Sign in
              </Link>
              <Link className="pet-button-primary px-4 py-2" to="/register">
                Sign up
              </Link>
            </div>
          )}
          <button className="pet-icon-button lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-amber-100 bg-[#fffaf2] px-4 py-4 lg:hidden">
          <div className="space-y-2">{renderLinks(true)}</div>
          {!isAuthenticated && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link className="pet-button-secondary py-2" to="/login" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
              <Link className="pet-button-primary py-2" to="/register" onClick={() => setMobileOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}

      {cartMenuOpen && <CartMenu onClose={() => setCartMenuOpen(false)} />}
    </header>
  );
};

export default Navbar;
