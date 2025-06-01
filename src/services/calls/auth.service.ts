import { api } from '../api';
import { AUTH_ENDPOINTS } from '../endpoints';

export const login = (credentials: { email: string; password: string }) =>
  api.post(AUTH_ENDPOINTS.LOGIN, credentials);

export const logout = () => api.post(AUTH_ENDPOINTS.LOGOUT);

export const getMe = () => api.get(AUTH_ENDPOINTS.ME);
