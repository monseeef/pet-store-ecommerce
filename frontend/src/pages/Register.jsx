import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiError } from "@/services/api";
import { PawPrint, ShieldCheck, Truck } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
          username: username,
          email: email,
          password: password,
      });

        toast.success("Registration successful!");
        navigate("/login");
    } catch (error) {
      toast.error("Registration failed: " + getApiError(error));
    }
  };

  return (
    <div className="pet-page flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-xl shadow-amber-950/10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden min-h-[720px] lg:block">
          <img
            src="/RegisterImg.jpg"
            alt="Happy pet owner"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <Link className="mb-8 inline-flex items-center gap-3" to="/">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/20">
                <PawPrint className="h-6 w-6" />
              </span>
              <div>
                <p className="text-lg font-black text-slate-950">Petopia</p>
                <p className="text-sm font-semibold text-slate-500">Premium pet care</p>
              </div>
            </Link>
            <p className="pet-eyebrow">Create account</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Start shopping smarter for your pet.
            </h1>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold text-slate-600">
                <Truck className="mb-2 h-4 w-4 text-amber-700" />
                Fast delivery
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600">
                <ShieldCheck className="mb-2 h-4 w-4 text-slate-700" />
                Secure checkout
              </div>
          </div>

            <form action="POST" onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
              <label
                htmlFor="petStoreName"
                  className="mb-2 block text-sm font-bold text-slate-700"
              >
                Username
              </label>
              <input
                type="text"
                id="petStoreName"
                onChange={handleUsernameChange}
                  className="pet-input"
                placeholder="Enter your username"
                  required
              />
            </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                onChange={handleEmailChange}
                  className="pet-input"
                placeholder="your_email@example.com"
                  required
              />
            </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">
                Your Password
              </label>
              <input
                type="password"
                id="password"
                onChange={handlePasswordChange}
                  className="pet-input"
                placeholder="Enter your password"
                  required
              />
            </div>
            <button
              type="submit"
                className="pet-button-primary w-full"
            >
                Create account
            </button>
          </form>
            <div className="mt-6 text-sm font-semibold text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-amber-700 hover:text-amber-800">
                Login
              </Link>
          </div>
            <div className="mt-4 text-xs font-semibold leading-6 text-slate-500">
            By registering, you agree to our{" "}
              <Link to="/terms" className="font-bold text-amber-700 hover:text-amber-800">
              Terms of Service
            </Link>{" "}
            and{" "}
              <Link to="/privacy" className="font-bold text-amber-700 hover:text-amber-800">
              Privacy Policy
            </Link>
            .
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
