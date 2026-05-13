import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../services/reducer/authSlice';


const ForgotPassword = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(forgotPassword({ email }));

    }
  return (
    <div className="max-w-lg mx-auto my-16">
            <h1 className="text-2xl font-semibold text-center text-gray-700 dark:text-white"> Forgot Password</h1>
            <p>Enter your email and we will send you a link to reset your password</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-secondary"
                        placeholder="Enter your email"
                        required

                    />
                </div>
                
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    >
                        Login
                    </button>
                </div>
            </form>
            <p>Don't have an account? <a href="/register" className="text-secondary">Register</a></p>
        </div>
  )
}

export default ForgotPassword