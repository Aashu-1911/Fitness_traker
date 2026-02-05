import axios from 'axios';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Auth response with token and user data
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/api/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Extract error message from response
    const errorMessage =
      error.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(errorMessage);
  }
};

/**
 * Login an existing user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Auth response with token and user data
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Extract error message from response
    const errorMessage =
      error.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

export default api;