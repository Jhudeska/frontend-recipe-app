import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function PrivateRoute({ children }) {

    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign_in" replace />;
    }

    return children;
}

export default PrivateRoute;