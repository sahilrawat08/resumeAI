import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Response interceptor to handle auth errors
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

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const uploadAPI = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadJobDescription: async (file: File) => {
    const formData = new FormData();
    formData.append('jobDescription', file);
    
    const response = await api.post('/upload/job-description', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const aiAPI = {
  analyzeResume: async (resumeText: string, jobDescription: string) => {
    const response = await api.post('/ai/analyze', { resumeText, jobDescription });
    return response.data;
  },
  
  optimizeResume: async (resumeText: string, jobDescription: string, optimizationFocus?: string) => {
    const response = await api.post('/ai/optimize', { resumeText, jobDescription, optimizationFocus });
    return response.data;
  }
};

export const resumeAPI = {
  getResumes: async () => {
    const response = await api.get('/resume');
    return response.data;
  },
  
  getResume: async (id: string) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },
  
  createResume: async (resumeData: any) => {
    const response = await api.post('/resume', resumeData);
    return response.data;
  },
  
  updateResume: async (id: string, resumeData: any) => {
    const response = await api.put(`/resume/${id}`, resumeData);
    return response.data;
  },
  
  deleteResume: async (id: string) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  }
};

export default api;


