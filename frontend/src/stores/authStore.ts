import { create } from 'zustand';
import api from '../utils/api';

interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  loadUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/auth/me');
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load user', isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', { email, password, name });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore; 