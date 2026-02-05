import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getProfile } from '../../api/profileApi.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [profileExists, setProfileExists] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    // Only check profile if user is trying to access dashboard
    if (location.pathname === '/dashboard') {
      const checkProfile = async () => {
        try {
          const profile = await getProfile();
          setProfileExists(profile !== null);
        } catch (error) {
          setProfileExists(false);
        } finally {
          setIsChecking(false);
        }
      };

      checkProfile();
    } else {
      // Skip profile check for other routes
      setIsChecking(false);
      setProfileExists(true);
    }
  }, [location.pathname]);

  // Show loading while checking profile
  if (isChecking && location.pathname === '/dashboard') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Redirect to profile setup if accessing dashboard without profile
  if (location.pathname === '/dashboard' && profileExists === false) {
    return <Navigate to="/profile" replace />;
  }

  // If authenticated (and profile exists for dashboard), render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;