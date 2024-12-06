import axios from 'axios';
import { Project } from '../types';

interface LoginResponse {
  id: number;
  email: string;
  name: string;
  token: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; name: string }): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Project API
export const projectApi = {
  createProject: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
}; 