import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use((response) => response);
