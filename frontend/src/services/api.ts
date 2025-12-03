import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      return Promise.reject(error);
    }

    // Handle 500 Server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
  }) => api.post('/register', data),

  login: (data: { email: string; password: string; remember?: boolean }) =>
    api.post('/login', data),

  logout: () => api.post('/logout'),

  getUser: () => api.get('/user'),

  forgotPassword: (email: string) => api.post('/forgot-password', { email }),

  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post('/reset-password', data),

  resendVerification: (email: string) =>
    api.post('/resend-verification', { email }),

  enable2FA: () => api.post('/2fa/enable'),

  verify2FA: (code: string, userId?: number) =>
    api.post('/2fa/verify', { code, user_id: userId }),

  disable2FA: (password: string) => api.post('/2fa/disable', { password }),
};

// User API
export const userApi = {
  getProfile: () => api.get('/profile'),

  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => api.put('/profile', data),

  updatePassword: (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => api.put('/profile/password', data),

  deleteAccount: (password: string) =>
    api.delete('/profile', { data: { password } }),

  getNotifications: (page = 1) =>
    api.get('/notifications', { params: { page } }),

  markNotificationRead: (id: string) =>
    api.post(`/notifications/${id}/read`),

  updateNotificationPreferences: (preferences: Array<{
    notification_type: string;
    email_enabled?: boolean;
    push_enabled?: boolean;
    in_app_enabled?: boolean;
  }>) => api.put('/notifications/preferences', { preferences }),
};

// Token API
export const tokenApi = {
  getPackages: () => api.get('/token-packages'),

  getBalance: () => api.get('/tokens/balance'),

  getTransactions: (page = 1) =>
    api.get('/tokens/transactions', { params: { page } }),

  purchase: (packageId: number) =>
    api.post('/tokens/purchase', { package_id: packageId }),

  confirmPurchase: (paymentIntentId: string, packageId: number) =>
    api.post('/tokens/purchase/confirm', {
      payment_intent_id: paymentIntentId,
      package_id: packageId,
    }),
};

// Subscription API
export const subscriptionApi = {
  getPlans: () => api.get('/subscription-plans'),

  getSubscription: () => api.get('/subscription'),

  subscribe: (planId: number, paymentMethodId: string) =>
    api.post('/subscription', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
    }),

  cancel: () => api.post('/subscription/cancel'),
};

// Questionnaire API
export const questionnaireApi = {
  get: () => api.get('/questionnaire'),

  submit: (data: {
    problem_description: string;
    tech_stack: string[];
    error_logs?: string;
    urgency: string;
    previous_attempts?: string;
  }) => api.post('/questionnaire/submit', data),
};

// Consultation API
export const consultationApi = {
  getAll: (page = 1) =>
    api.get('/consultations', { params: { page } }),

  get: (id: number) => api.get(`/consultations/${id}`),

  create: (consultationRequestId: number) =>
    api.post('/consultations', { consultation_request_id: consultationRequestId }),

  shuffle: (id: number) => api.post(`/consultations/${id}/shuffle`),

  cancel: (id: number) => api.post(`/consultations/${id}/cancel`),

  start: (id: number) => api.post(`/consultations/${id}/start`),

  end: (id: number) => api.post(`/consultations/${id}/end`),

  rate: (id: number, rating: number, feedback?: string) =>
    api.post(`/consultations/${id}/rate`, { rating, feedback }),

  getMessages: (id: number) => api.get(`/consultations/${id}/messages`),

  sendMessage: (id: number, message: string, type = 'text', metadata?: Record<string, unknown>) =>
    api.post(`/consultations/${id}/messages`, { message, type, metadata }),

  getFiles: (id: number) => api.get(`/consultations/${id}/files`),

  uploadFile: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/consultations/${id}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  downloadFile: (id: number, fileId: number) =>
    api.get(`/consultations/${id}/files/${fileId}/download`, {
      responseType: 'blob',
    }),

  getZoomSignature: (id: number) =>
    api.post(`/consultations/${id}/zoom-signature`),
};

// Consultant API
export const consultantApi = {
  getDashboard: () => api.get('/consultant/dashboard'),

  getProfile: () => api.get('/consultant/profile'),

  updateProfile: (data: {
    specializations?: string[];
    bio?: string;
    languages?: string[];
    hourly_rate?: number;
  }) => api.put('/consultant/profile', data),

  getAvailability: () => api.get('/consultant/availability'),

  updateAvailability: (slots: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    timezone?: string;
    is_active?: boolean;
  }>) => api.put('/consultant/availability', { slots }),

  toggleAvailability: () => api.post('/consultant/availability/toggle'),

  getRequests: (page = 1) =>
    api.get('/consultant/requests', { params: { page } }),

  acceptRequest: (id: number) => api.post(`/consultant/requests/${id}/accept`),

  declineRequest: (id: number) => api.post(`/consultant/requests/${id}/decline`),

  getEarnings: () => api.get('/consultant/earnings'),

  getConsultations: (page = 1) =>
    api.get('/consultant/consultations', { params: { page } }),
};

