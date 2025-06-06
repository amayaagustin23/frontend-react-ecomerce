import { api } from '../api';
import { BRAND_ENDPOINTS } from '../endpoints';

export const getAllBrandsPanel = (params = { page: 1, size: 10 }) =>
  api.get(BRAND_ENDPOINTS.GET_ALL, { params });

export const getBrandById = (id: string) => api.get(BRAND_ENDPOINTS.GET_BY_ID(id));

export const createBrand = (data: { name: string }) => api.post(BRAND_ENDPOINTS.CREATE, data);

export const updateBrand = (id: string, data: { name: string }) =>
  api.patch(BRAND_ENDPOINTS.UPDATE(id), data);

export const deleteBrand = (id: string) => api.delete(BRAND_ENDPOINTS.DELETE(id));
