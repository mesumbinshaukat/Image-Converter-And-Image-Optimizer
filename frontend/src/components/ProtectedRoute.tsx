import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
    children: JSX.Element;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to appropriate login page based on requirement
        return <Navigate to={requireAdmin ? "/admin-access" : "/login"} state={{ from: location }} replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        // If authenticated but not admin, and admin is required, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
