import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get today's daily challenge
 */
export const getDailyChallenge = async () => {
  const token = getAuthToken();
  
  const response = await axios.get(`${API_URL}/challenges/daily`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

/**
 * Get current weekly challenge
 */
export const getWeeklyChallenge = async () => {
  const token = getAuthToken();
  
  const response = await axios.get(`${API_URL}/challenges/weekly`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

/**
 * Mark a challenge as completed
 */
export const completeChallenge = async (id) => {
  const token = getAuthToken();
  
  const response = await axios.put(
    `${API_URL}/challenges/complete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};