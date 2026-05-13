// ProtectedRoute.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchUser } from '../services/reducer/authSlice';

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state) => state.auth.admin || state.auth.auth?.isAdmin);
    const user = useSelector((state) => state.auth.auth);
    const isLoading = useSelector((state) => state.auth.isLoading);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(fetchUser());
        }
    }, [dispatch, isAuthenticated, user]);

    if (isAuthenticated && !user) {
        return <div className="p-6 text-sm text-gray-600">Checking admin access...</div>;
    }

    if (isLoading) {
        return <div className="p-6 text-sm text-gray-600">Checking admin access...</div>;
    }

    return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
