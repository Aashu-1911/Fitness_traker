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

// Add auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('fitlife_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Add water intake to today's log
 */
export const addWater = async (amount) => {
  try {
    const response = await api.post(
      '/api/logs/water',
      { amount },
      { headers: getAuthHeaders() }
    );
    return response.data.log;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to log water intake';
    throw new Error(message);
  }
};

/**
 * Add calories to today's log
 */
export const addCalories = async (amount) => {
  try {
    const response = await api.post(
      '/api/logs/calories',
      { amount },
      { headers: getAuthHeaders() }
    );
    return response.data.log;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to log calories';
    throw new Error(message);
  }
};

/**
 * Add workout to today's log
 */
export const addWorkout = async (workout) => {
  try {
    const response = await api.post(
      '/api/logs/workout',
      workout,
      { headers: getAuthHeaders() }
    );
    return response.data.log;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to log workout';
    throw new Error(message);
  }
};

/**
 * Get today's log
 */
export const getTodayLog = async () => {
  try {
    const response = await api.get(
      '/api/logs/today',
      { headers: getAuthHeaders() }
    );
    return response.data.log;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch today\'s log';
    throw new Error(message);
  }
};