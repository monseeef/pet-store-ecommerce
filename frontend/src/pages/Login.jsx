import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { PawPrint, ShieldCheck } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const error = useSelector((state) => state.auth.isError);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
    // navigate("/dashboard");
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="pet-page flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-xl shadow-amber-950/10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-amber-50 p-10 lg:flex lg:flex-col lg:justify-between">
          <Link className="flex items-center gap-3" to="/">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/20">
              <PawPrint className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-black text-slate-950">Petopia</p>
              <p className="text-sm font-semibold text-slate-500">Premium pet care</p>
            </div>
          </Link>
          <div>
            <p className="pet-eyebrow">Welcome back</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Pick up where your pet care routine left off.
            </h1>
            <div className="mt-8 flex items-center gap-3 rounded-3xl bg-white p-4 text-sm font-bold text-slate-600">
              <ShieldCheck className="h-5 w-5 text-amber-700" />
              Secure checkout and protected account access.
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <Link className="mb-6 inline-flex items-center gap-3 lg:hidden" to="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/20">
                <PawPrint className="h-5 w-5" />
              </span>
              <span className="text-lg font-black text-slate-950">Petopia</span>
            </Link>
            <p className="pet-eyebrow">Account login</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Access your cart, wishlist, and order history.
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
              {typeof error === "string" ? error : "Unable to sign in. Please check your credentials."}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-bold text-slate-700">
                Username
              </label>
            <input
              type="text"
              required
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pet-input"
              placeholder="Enter your username"
            />
          </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">
                Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pet-input"
              placeholder="Enter your password"
            />
              <Link to="/forgetPassword" className="mt-2 inline-block text-sm font-bold text-amber-700 hover:text-amber-800">
                Forgot password?
              </Link>
          </div>
            <button
              type="submit"
              className="pet-button-primary w-full"
            >
              Sign in
            </button>
        </form>
          <div className="mt-6 text-center text-sm font-semibold text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-black text-amber-700 hover:text-amber-800">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


