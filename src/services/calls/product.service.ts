import { api } from '../api';
import { PRODUCT_ENDPOINTS } from '../endpoints';

export const getAllProducts = (params: { page: number; size: number }) =>
  api.get('/products', { params });

export const getProductById = (id: string) => api.get(PRODUCT_ENDPOINTS.GET_BY_ID(id));

export const createProduct = (data: any, files: File[] = []) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  files.forEach((file) => {
    formData.append('files', file);
  });

  return api.post(PRODUCT_ENDPOINTS.CREATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (id: string, data: any, files: File[] = []) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  files.forEach((file) => {
    formData.append('files', file);
  });

  return api.patch(PRODUCT_ENDPOINTS.UPDATE(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
