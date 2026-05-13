import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { forgotPassword } from '@/services/reducer/authSlice';


const ForgotPassword = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(forgotPassword({ email }));

    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="flex flex-col justify-center items-center mb-8">
          <a href="/">
            <img
              src="public/Logo.png"
              alt="Pet Store Logo"
              className="h-12 mr-2 mb-6 "
            />
          </a>
          <h1 className="text-3xl font-light">Forgot Password</h1>
          <p className="mt-4 text-gray-600">
            Enter your email and we will send you a link to reset your password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1 px-4 py-2 w-full border rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-amber-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-amber-600 w-full"
            >
              Reset Password
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-700">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-amber-600 font-medium">
              Register
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword

