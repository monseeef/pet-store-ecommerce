import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid2X2,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PawPrint,
  Settings,
  ShoppingCart,
  Tags,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { logout } from "../../services/reducer/authSlice";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/pets", label: "Pets", icon: PawPrint },
  { to: "/users", label: "Users", icon: Users },
  { to: "/categories", label: "Categories", icon: Tags },
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
    `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-bold transition duration-200 ${
      isActive
        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
        : "text-slate-500 hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 hover:shadow-sm"
    }`;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-amber-100/80 bg-white/85 px-4 shadow-sm shadow-amber-950/5 backdrop-blur-xl sm:ml-64 sm:px-6">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setIsMobileOpen(true)}
          className="admin-icon-button sm:hidden"
        >
            <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Petopia Admin
          </p>
          <p className="text-sm text-slate-500">Operations dashboard</p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 shadow-sm shadow-amber-950/5 transition hover:-translate-y-0.5 hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-100"
            aria-expanded={isUserMenuOpen}
            aria-label="Open account menu"
          >
            <UserCircle className="h-7 w-7 text-slate-500" />
            <span className="hidden max-w-32 truncate sm:inline">
              {user?.username || "Admin"}
            </span>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-amber-100 bg-white p-2 shadow-xl shadow-slate-950/10">
              <NavLink
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-amber-50 hover:text-slate-950"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-amber-100/80 bg-[#fbfaf7] px-4 py-5 shadow-xl shadow-slate-950/10 transition-transform sm:translate-x-0 sm:shadow-none ${
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
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 text-amber-300 shadow-lg shadow-slate-950/10">
              <Grid2X2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-950">Petopia Admin</span>
              <span className="block text-xs text-slate-500">Commerce control</span>
            </span>
          </NavLink>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsMobileOpen(false)}
            className="admin-icon-button sm:hidden"
          >
            <X className="h-5 w-5" />
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
              <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-amber-300 opacity-0 transition group-[.active]:opacity-100" />
              <Icon className="h-5 w-5 transition group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
