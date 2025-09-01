import axios from 'axios';

// 1. Define the base URL using the environment
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:5000';

// 2. Create the axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;