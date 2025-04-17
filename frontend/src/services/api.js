import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Traffic data services
export const trafficService = {
  // Get traffic data around a location
  getTrafficData: async (lat, lon, radius = 5000) => {
    try {
      const response = await api.get('/api/traffic', {
        params: { lat, lon, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      throw error;
    }
  },
  
  // Get traffic incidents
  getTrafficIncidents: async (lat, lon, radius = 5000) => {
    try {
      const response = await api.get('/api/traffic/incidents', {
        params: { lat, lon, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic incidents:', error);
      throw error;
    }
  },
  
  // Get weather data
  getWeatherData: async (lat, lon) => {
    try {
      const response = await api.get('/api/weather', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
};

// Auth services
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/auth/preferences', { preferences });
      // Update stored user data
      const user = authService.getCurrentUser();
      if (user) {
        user.preferences = response.data.preferences;
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
};

export default api;