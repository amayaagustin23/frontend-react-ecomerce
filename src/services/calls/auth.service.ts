import { api } from '../api';
import { AUTH_ENDPOINTS } from '../endpoints';
import { RegisterUserDto, RecoverPasswordDto, ResetPasswordDto } from '@/types/Auth';

export const login = (credentials: { email: string; password: string }) =>
  api.post(AUTH_ENDPOINTS.LOGIN, credentials);

export const logoutSession = () => api.get(AUTH_ENDPOINTS.LOGOUT);

export const getMe = () => api.get(AUTH_ENDPOINTS.ME);

export const registerUser = (data: RegisterUserDto) => api.post(AUTH_ENDPOINTS.REGISTER, data);

export const recoverPassword = (data: RecoverPasswordDto) =>
  api.post(AUTH_ENDPOINTS.RECOVER_PASSWORD, data);

export const resetPassword = (data: ResetPasswordDto) =>
  api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
