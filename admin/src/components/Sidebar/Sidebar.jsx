import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IoBagHandleOutline,
  IoBarChartOutline,
  IoCartOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoPawOutline,
  IoPeopleOutline,
  IoPersonCircleOutline,
  IoPricetagsOutline,
  IoSettingsOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { logout } from "../../services/reducer/authSlice";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: IoBarChartOutline },
  { to: "/products", label: "Products", icon: IoBagHandleOutline },
  { to: "/orders", label: "Orders", icon: IoCartOutline },
  { to: "/pets", label: "Pets", icon: IoPawOutline },
  { to: "/users", label: "Users", icon: IoPeopleOutline },
  { to: "/categories", label: "Categories", icon: IoPricetagsOutline },
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.auth);

  const handleLogout = () => {
    dispatch(logout()).finally(() => {
      navigate("/login", { replace: true });
    });
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-amber-100 text-slate-950 shadow-sm"
        : "text-slate-500 hover:bg-white hover:text-slate-950"
    }`;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:ml-64 sm:px-6">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setIsMobileOpen(true)}
          className="admin-icon-button sm:hidden"
        >
          <IoMenuOutline className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Pet Store Admin
          </p>
          <p className="text-sm text-slate-500">Operations dashboard</p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-expanded={isUserMenuOpen}
            aria-label="Open account menu"
          >
            <IoPersonCircleOutline className="h-7 w-7 text-slate-500" />
            <span className="hidden max-w-32 truncate sm:inline">
              {user?.username || "Admin"}
            </span>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <NavLink
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-amber-50 hover:text-slate-950"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <IoSettingsOutline className="h-4 w-4" />
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <IoLogOutOutline className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {isMobileOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 sm:hidden"
          onClick={() => setIsMobileOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-[#fbfaf7] px-4 py-5 shadow-xl transition-transform sm:translate-x-0 sm:shadow-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
      >
        <div className="mb-8 flex items-center justify-between">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setIsMobileOpen(false)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-amber-300">
              <IoGridOutline className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-950">PetCo Admin</span>
              <span className="block text-xs text-slate-500">Commerce control</span>
            </span>
          </NavLink>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsMobileOpen(false)}
            className="admin-icon-button sm:hidden"
          >
            <IoCloseOutline className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={navClass}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <IoLogOutOutline className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
