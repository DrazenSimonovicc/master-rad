import { create } from 'zustand';
import api from './api';

// Helper to check if we're on client side
const isClient = typeof window !== 'undefined';

// Safe localStorage helpers
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent fail
    }
  },
  removeItem: (key: string): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  }
};

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required.');
      }

      safeLocalStorage.setItem('admin_token', token);
      safeLocalStorage.setItem('admin_user', JSON.stringify(user));
      
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ user: null, token: null, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    safeLocalStorage.removeItem('admin_token');
    safeLocalStorage.removeItem('admin_user');
    set({ user: null, token: null });
  },

  checkAuth: () => {
    const token = safeLocalStorage.getItem('admin_token');
    const userStr = safeLocalStorage.getItem('admin_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN') {
          set({ user, token, isLoading: false });
          return;
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    set({ user: null, token: null, isLoading: false });
  },
}));
