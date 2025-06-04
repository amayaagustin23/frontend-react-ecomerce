import { AddressInputDto } from '@/types/User';
import { api } from '../api';
import { USER_ENDPOINTS } from '../endpoints';

export const getAllUsers = (pagination = { page: 1, limit: 10 }) =>
  api.get(USER_ENDPOINTS.GET_ALL, { params: pagination });

export const getUserById = (id: string) => api.get(USER_ENDPOINTS.GET_BY_ID(id));

export const updateUser = (id: string, data: any) => api.patch(USER_ENDPOINTS.UPDATE(id), data);

export const deleteUser = (id: string) => api.delete(USER_ENDPOINTS.DELETE(id));

export const exchangeCoupon = (code: string) => api.patch(USER_ENDPOINTS.EXCHANGE_COUPON(code));

export const addressDefaultUpdate = (id: string) =>
  api.patch(USER_ENDPOINTS.ADDRESS_DEFAULT_UPDATE(id));

export const addFavoriteProduct = (productId: string) =>
  api.patch(USER_ENDPOINTS.ADD_FAVORITE_PRODUCT, { productId });

export const deleteFavoriteProduct = (productId: string) =>
  api.patch(USER_ENDPOINTS.DELETE_FAVORITE_PRODUCT, { productId });

export const createUserAddress = (addressData: AddressInputDto) =>
  api.patch(USER_ENDPOINTS.ADD_ADDRESS, addressData);

export const updateUserAddress = (id: string, addressData: AddressInputDto) =>
  api.patch(USER_ENDPOINTS.UPDATE_ADDRESS(id), addressData);

export const deleteUserAddress = (id: string) => api.patch(USER_ENDPOINTS.DELETE_ADDRESS(id));
export const defaultChangeUserAddress = (id: string) =>
  api.patch(USER_ENDPOINTS.DEFAULT_CHANGE_ADDRESS(id));
