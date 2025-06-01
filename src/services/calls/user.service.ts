import { api } from "../api";
import { USER_ENDPOINTS } from "../endpoints";

export const getAllUsers = (pagination = { page: 1, limit: 10 }) =>
  api.get(USER_ENDPOINTS.GET_ALL, { params: pagination });

export const getUserById = (id: string) => api.get(USER_ENDPOINTS.GET_BY_ID(id));

export const updateUser = (id: string, data: any) => api.patch(USER_ENDPOINTS.UPDATE(id), data);

export const deleteUser = (id: string) => api.delete(USER_ENDPOINTS.DELETE(id));

export const exchangeCoupon = (code: string) => api.patch(USER_ENDPOINTS.EXCHANGE_COUPON(code));

export const addressDefaultUpdate = (id: string) =>
  api.patch(USER_ENDPOINTS.ADDRESS_DEFAULT_UPDATE(id));
