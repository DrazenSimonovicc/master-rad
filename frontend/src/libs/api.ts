import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = safeLocalStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error;
      
      // Token expired or invalid
      if (errorMessage === 'Token expired' || errorMessage === 'Invalid token') {
        safeLocalStorage.removeItem('auth_token');
        safeLocalStorage.removeItem('user');
        
        // Only redirect if we're on client side
        if (isClient && window.location.pathname !== '/prijava') {
          window.location.href = '/prijava';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  async signup(email: string, password: string, passwordConfirm: string) {
    const response = await api.post('/auth/signup', { email, password, passwordConfirm });
    if (response.data.token) {
      safeLocalStorage.setItem('auth_token', response.data.token);
      safeLocalStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      safeLocalStorage.setItem('auth_token', response.data.token);
      safeLocalStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    safeLocalStorage.removeItem('auth_token');
    safeLocalStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!safeLocalStorage.getItem('auth_token');
  },

  getCurrentUser() {
    const user = safeLocalStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// User service
export const userService = {
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async update(id: string, data: any, avatar?: File) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (avatar) {
      formData.append('avatar', avatar);
    }

    const response = await api.patch(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// Forum service
export const forumService = {
  async getCategories() {
    const response = await api.get('/forum/categories');
    return response.data;
  },

  async getAllNews(expand?: string) {
    const response = await api.get('/forum/news', {
      params: { expand }
    });
    return response.data;
  },

  async getNewsById(id: string, expand?: string) {
    const response = await api.get(`/forum/news/${id}`, {
      params: { expand }
    });
    return response.data;
  },

  async createNews(data: any, image?: File) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (image) {
      formData.append('image_url', image);
    }

    const response = await api.post('/forum/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateNews(id: string, data: any, image?: File) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (image) {
      formData.append('image_url', image);
    }

    const response = await api.patch(`/forum/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteNews(id: string) {
    const response = await api.delete(`/forum/news/${id}`);
    return response.data;
  }
};

// Lesson plan service
export const lessonPlanService = {
  async getAll(filter?: string) {
    const response = await api.get('/lesson-plans', {
      params: { filter }
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/lesson-plans/${id}`);
    return response.data;
  },

  async create(data: any, file?: File) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (file) {
      formData.append('file', file);
    }

    const response = await api.post('/lesson-plans', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, data: any, file?: File) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (file) {
      formData.append('file', file);
    }

    const response = await api.patch(`/lesson-plans/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/lesson-plans/${id}`);
    return response.data;
  }
};

// Homework service
export const homeworkService = {
  async getAll() {
    const response = await api.get('/homeworks');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/homeworks/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/homeworks', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/homeworks/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/homeworks/${id}`);
    return response.data;
  }
};

// Test service
export const testService = {
  async getAll() {
    const response = await api.get('/tests');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/tests', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/tests/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  }
};

// Activity service
export const activityService = {
  async getAll(filter?: string) {
    const response = await api.get('/activities', {
      params: { filter }
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/activities', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/activities/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  }
};

// Class schedule service
export const classScheduleService = {
  async getAll() {
    const response = await api.get('/class-schedules');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/class-schedules/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/class-schedules', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/class-schedules/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/class-schedules/${id}`);
    return response.data;
  }
};

// Announcement service
export const announcementService = {
  async getAll() {
    const response = await api.get('/announcements');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/announcements/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

// Operative plan service
export const operativePlanService = {
  async getAll() {
    const response = await api.get('/operative-plans');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/operative-plans/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/operative-plans', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/operative-plans/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/operative-plans/${id}`);
    return response.data;
  }
};

// Global plan service
export const globalPlanService = {
  async getAll() {
    const response = await api.get('/global-plans');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/global-plans/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/global-plans', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/global-plans/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/global-plans/${id}`);
    return response.data;
  },

  async getAllSubjects() {
    const response = await api.get('/global-plans/subjects/all');
    return response.data;
  },

  async createSubject(data: any) {
    const response = await api.post('/global-plans/subjects', data);
    return response.data;
  }
};

// Subject service
export const subjectService = {
  async getAll() {
    const response = await api.get('/subjects');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch(`/subjects/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  }
};

// Helper to get file URL
export const getFileUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}/${path}`;
};

export const getAvatarUrl = (userId: string, filename: string) => {
  return getFileUrl(`uploads/avatars/${filename}`);
};

export const getForumImageUrl = (filename: string) => {
  return getFileUrl(`uploads/forum-images/${filename}`);
};

export const getLessonFileUrl = (filename: string) => {
  return getFileUrl(`uploads/lesson-files/${filename}`);
};


