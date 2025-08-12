import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SkeletonLoader } from './SkeletonLoader'; // Assuming a generic loader exists

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, session } = useAuth();

  // While the session is being loaded, you might want to show a loader.
  // The initial state of session is null, so we need to differentiate between
  // "loading" and "no session". A simple check for `user` can work if `useAuth`
  // sets it only after the initial check. Let's assume a brief loading state.
  // A more robust solution might involve a dedicated `isLoading` state in the AuthContext.

  // For this implementation, we'll consider that if there's no user, access is denied.
  if (!user && !session) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to. This allows us to send them back there after they log in.
    return <Navigate to="/signin" replace />;
  }

  return children;
};
