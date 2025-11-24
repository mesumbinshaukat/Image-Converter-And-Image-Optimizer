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

    if (requireAdmin && user && user.role !== 'admin') {
        // If authenticated but not admin, and admin is required, redirect to home
        return <Navigate to="/" replace />;
    }

    // If requireAdmin is true but user is null (should be handled by SessionRestorer, but as safety)
    if (requireAdmin && !user) {
        return null; // Or loading spinner, but SessionRestorer handles this
    }

    return children;
};

export default ProtectedRoute;
