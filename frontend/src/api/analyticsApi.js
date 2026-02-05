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
 * Get weight trend over specified number of days
 */
export const getWeightTrend = async (days = 30) => {
  try {
    const response = await api.get(
      `/api/analytics/weight-trend?days=${days}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch weight trend';
    throw new Error(message);
  }
};

/**
 * Get water intake trend
 */
export const getWaterTrend = async (days = 30) => {
  try {
    const response = await api.get(
      `/api/analytics/water-trend?days=${days}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch water trend';
    throw new Error(message);
  }
};

/**
 * Get calorie intake trend
 */
export const getCalorieTrend = async (days = 30) => {
  try {
    const response = await api.get(
      `/api/analytics/calorie-trend?days=${days}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch calorie trend';
    throw new Error(message);
  }
};

/**
 * Get workout summary
 */
export const getWorkoutSummary = async (days = 30) => {
  try {
    const response = await api.get(
      `/api/analytics/workout-summary?days=${days}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch workout summary';
    throw new Error(message);
  }
};