import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending credentials (cookies, HTTP authentication)
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Create a new config object with proper typing
    const newConfig = { ...config };
    
    // Initialize headers if they don't exist
    if (!newConfig.headers) {
      newConfig.headers = {} as any;
    }
    
    // Add authorization header if token exists
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers
    newConfig.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    newConfig.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
    newConfig.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    newConfig.headers['Access-Control-Allow-Credentials'] = 'true';
    
    return newConfig;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code within the range of 2xx will trigger this
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
