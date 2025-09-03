import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SkeletonLoader } from "./SkeletonLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!user) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to. This allows us to send them back there after they log in.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user has one of the allowed roles.
  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    // Redirect to a "not authorized" page or back to the homepage.
    // For now, redirecting to the homepage is a safe default.
    return <Navigate to="/" replace />;
  }

  return children;
};
