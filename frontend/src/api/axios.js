import axios from 'axios';

// 1. Define your base URL
const API_BASE_URL = 'http://localhost:5000';

// 2. Create a new instance of axios with a custom configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Export the configured instance
export default apiClient;