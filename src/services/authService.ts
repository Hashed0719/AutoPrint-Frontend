import api from './api';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login({ username, password }: LoginData) {
    try {
      console.log('Sending login request for user:', username);
      const response = await api.post('/auth/login', { username, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('Login successful for user:', username);
        return response.data;
      } else {
        console.error('Login failed - No token in response:', response.data);
        throw new Error('Authentication failed: No token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Login failed. Please check your credentials and try again.';
        throw new Error(errorMessage);
        
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. Request:', error.request);
        throw new Error('No response from server. Please check your internet connection and try again.');
        
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw new Error(`Error setting up login request: ${error.message}`);
      }
    }
  },

  async register({ username, email, password }: RegisterData) {
    try {
      console.log('Sending registration request with data:', { username, email, password: '***' });
      username = username.trim();
      email = email.trim();
      password = password.trim();
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password,
        confirmPassword: password // Backend expects this field
      });
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up registration request');
      }
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  getAuthToken() {
    return localStorage.getItem('token') || '';
  }
};

export const getAuthToken = () => localStorage.getItem('token') || '';

export default authService;
