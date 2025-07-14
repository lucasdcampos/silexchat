import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('silex_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/api/auth/refresh');
        localStorage.setItem('silex_token', data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('silex_token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;