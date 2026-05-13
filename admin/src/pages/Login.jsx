import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.admin || state.auth.auth?.isAdmin);
  const error = useSelector((state) => state.auth.isError);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
    // navigate("/dashboard");
  };
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl md:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Admin Console
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight">
              Premium pet commerce, managed with clarity.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Track products, orders, pets, and customers from one focused operations workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-amber-200">Secure</p>
              <p className="mt-1 text-slate-400">Admin-only access</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-amber-200">Fast</p>
              <p className="mt-1 text-slate-400">Inventory workflows</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-amber-200">Clear</p>
              <p className="mt-1 text-slate-400">Order visibility</p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              PetCo Admin
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in with your admin username or email.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
                  Username or email
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="admin-input w-full"
                  placeholder="admin@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="admin-input w-full"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600" role="alert">
                {typeof error === "string" ? error : "Unable to log in."}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <Link
                to="/forgot-password"
                className="text-right text-sm font-medium text-slate-500 underline-offset-4 hover:text-amber-700 hover:underline"
              >
                Forgot password?
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="admin-button w-full"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Need an admin account? Use the development seed script or ask an existing admin to create one.
            <div className="mt-3">
              <Link to="/register" className="font-semibold underline underline-offset-4">
                View admin setup notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
