import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function RoleRoute({ children, allowedRoles =[] }) {

    const { isAuthenticated,   isLoading, hasAnyRole } = useAuth();

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/sign_in" replace />;
    }

    if (!hasAnyRole(allowedRoles)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleRoute;