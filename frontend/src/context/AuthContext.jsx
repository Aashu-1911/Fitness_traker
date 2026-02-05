import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Auth Context
const AuthContext = createContext();

/**
 * Auth Provider Component
 * Manages authentication state and provides auth functions to the app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('fitlife_token');
    const storedUser = localStorage.getItem('fitlife_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('fitlife_token');
        localStorage.removeItem('fitlife_user');
      }
    }
  }, []);

  /**
   * Login function - saves token and user to state and localStorage
   * @param {string} token - JWT token from backend
   * @param {Object} user - User object from backend
   */
  const login = (token, user) => {
    // Save to state
    setToken(token);
    setUser(user);

    // Save to localStorage for persistence
    localStorage.setItem('fitlife_token', token);
    localStorage.setItem('fitlife_user', JSON.stringify(user));

    // Navigate to dashboard
    navigate('/dashboard');
  };

  /**
   * Logout function - clears state and localStorage
   */
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('fitlife_token');
    localStorage.removeItem('fitlife_user');

    // Navigate to login
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};