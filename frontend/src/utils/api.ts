import axios from 'axios';

// Add type declaration for Vite's import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

export default api;

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  itemNumber: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  itemNumber: number;
  title: string;
  price: number;
  soldAt: string;
  buyerName: string;
}

export const fetchUserItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get('/items/my-items');
    return response.data;
  } catch (error) {
    console.error('Error fetching user items:', error);
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    await api.delete(`/items/${itemId}`);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const fetchUserSales = async (): Promise<Sale[]> => {
  try {
    const response = await api.get('/items/my-items?status=sold');
    return response.data;
  } catch (error) {
    console.error('Error fetching user sales:', error);
    throw error;
  }
}; 