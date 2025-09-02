import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function PrivateRoute({ allowedRoles, children }) {
  const {user}= useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.userRole)) {
    return <Navigate to="/" replace />; // redirect if role not allowed
  }

  return children;
}

export default PrivateRoute;