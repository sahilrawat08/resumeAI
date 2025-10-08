import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://resumeai-backend.vercel.app/api' 
    : 'http://localhost:5001/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      toast.error('Network error. Please check if the backend server is running and CORS is configured correctly.');
    } else {
      const message = error.response?.data?.error || 'An error occurred';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Analysis API
export const analysisAPI = {
  analyzeResume: async (data: {
    resumeText: string;
    jobDescription: string;
    fileName: string;
    fileType: string;
  }) => {
    const response = await api.post('/analyze', data);
    return response.data;
  },

  getAnalyses: async () => {
    const response = await api.get('/analyze');
    return response.data;
  },

  getAnalysis: async (id: string) => {
    const response = await api.get(`/analyze/${id}`);
    return response.data;
  },

  exportAnalysis: async (id: string) => {
    const response = await api.get(`/analyze/export/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  getAnalyses: async (page = 1, limit = 10) => {
    const response = await api.get(`/resume/analyses?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAnalysis: async (id: string) => {
    const response = await api.get(`/resume/analyses/${id}`);
    return response.data;
  },

  deleteAnalysis: async (id: string) => {
    const response = await api.delete(`/resume/analyses/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/resume/stats');
    return response.data;
  },

  exportAnalysis: async (id: string) => {
    const response = await api.get(`/resume/export/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Chat History API
export const chatAPI = {
  // Get all chat sessions
  getHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },

  // Get a specific chat session
  getSession: async (sessionId: string) => {
    const response = await api.get(`/chat/${sessionId}`);
    return response.data;
  },

  // Create or update chat session
  saveSession: async (data: {
    title?: string;
    messages: any[];
    resumeFileName?: string;
    atsScore?: number;
    sessionId?: string;
  }) => {
    const response = await api.post('/chat', data);
    return response.data;
  },

  // Delete chat session
  deleteSession: async (sessionId: string) => {
    const response = await api.delete(`/chat/${sessionId}`);
    return response.data;
  }
};

export default api;
