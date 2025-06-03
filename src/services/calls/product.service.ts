import { FetchProductsParams } from '@/context/Product/ProductContext';
import { api } from '../api';
import { PRODUCT_ENDPOINTS } from '../endpoints';

export const getAllProducts = (params: FetchProductsParams) =>
  api.get(PRODUCT_ENDPOINTS.GET_ALL, { params });

export const getProductById = (id: string) =>
  api.get(PRODUCT_ENDPOINTS.GET_BY_ID(id));

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

export const getAllBrands = () =>
  api.get(PRODUCT_ENDPOINTS.GET_ALL_BRANDS);

export const getAllVariantColors = () =>
  api.get(PRODUCT_ENDPOINTS.GET_ALL_COLORS);


export const getAllVariantSizes = () =>
  api.get(PRODUCT_ENDPOINTS.GET_ALL_SIZES);


export const getAllVariantGenders = () =>
  api.get(PRODUCT_ENDPOINTS.GET_ALL_GENDERS);
