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
 * Get user's health profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/api/health/profile', {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    
    // Convert healthConditions array to string if it exists
    if (data && data.healthConditions && Array.isArray(data.healthConditions)) {
      data.healthConditions = data.healthConditions.length > 0 ? data.healthConditions[0] : '';
    }
    
    return data;
  } catch (error) {
    // Return null if profile doesn't exist (404)
    if (error.response?.status === 404) {
      return null;
    }
    const message = error.response?.data?.message || 'Failed to fetch profile';
    throw new Error(message);
  }
};

/**
 * Create new health profile
 */
export const saveProfile = async (formData) => {
  try {
    const response = await api.post('/api/health/profile', formData, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    
    // Convert healthConditions array to string if it exists
    if (data && data.healthConditions && Array.isArray(data.healthConditions)) {
      data.healthConditions = data.healthConditions.length > 0 ? data.healthConditions[0] : '';
    }
    
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create profile';
    throw new Error(message);
  }
};

/**
 * Update existing health profile
 */
export const updateProfile = async (formData) => {
  try {
    const response = await api.put('/api/health/profile', formData, {
      headers: getAuthHeaders(),
    });
    const data = response.data;
    
    // Convert healthConditions array to string if it exists
    if (data && data.healthConditions && Array.isArray(data.healthConditions)) {
      data.healthConditions = data.healthConditions.length > 0 ? data.healthConditions[0] : '';
    }
    
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    throw new Error(message);
  }
};