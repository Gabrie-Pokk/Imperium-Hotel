import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Check email availability
  checkEmail: async (email) => {
    const response = await api.post('/api/auth/check-email', { email });
    return response.data;
  },

  // Check CPF availability
  checkCPF: async (cpf) => {
    const response = await api.post('/api/auth/check-cpf', { cpf });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Delete user (soft delete)
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // Restore user
  restoreUser: async (id) => {
    const response = await api.post(`/api/users/${id}/restore`);
    return response.data;
  },

  // Search users
  searchUsers: async (query, page = 1, limit = 10) => {
    const response = await api.get(`/api/users/search?q=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get deleted users
  getDeletedUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/users/deleted?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
