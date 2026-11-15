import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with auth interceptor
const api = axios.create({ baseURL: API_BASE });

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Product API calls
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Auth API calls
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export default api;
