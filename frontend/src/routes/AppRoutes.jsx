import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import HealthProfilePage from '../pages/profile/HealthProfilePage.jsx';
import ProgressPage from '../pages/progress/ProgressPage.jsx';
import ChallengesPage from '../pages/challenges/ChallengesPage.jsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HealthProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProgressPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChallengesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;