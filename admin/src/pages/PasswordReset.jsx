import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { passwordReset } from '../services/reducer/authSlice'

const PasswordReset = () => {
    const dispatch = useDispatch()
    const { token } = useParams()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handlePasswordConfirmation = () => {
        return password === confirmPassword
    }

    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (handlePasswordConfirmation()) {
            // Dispatch password reset action
            
            dispatch(passwordReset({ token, password }))
        } else {
            // Handle password mismatch error here
        }
    }


    return (
        <div className="max-w-lg mx-auto my-16">
            <h1>Password Reset : New Password</h1>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-primary"
                    required
                    placeholder="Enter your new password"
                    name="new_password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-secondary"
                    required
                    placeholder="Confirm your new password"
                />
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    disabled={!handlePasswordConfirmation()}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default PasswordReset
