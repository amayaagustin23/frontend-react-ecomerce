import { Category } from '@/types/Category';
import { api } from '../api';
import { CATEGORY_ENDPOINTS } from '../endpoints';

type PaginationParams = {
  page?: number;
  size?: number;
};

export const getAllCategories = (params?: PaginationParams) =>
  api.get<{ data: Category[]; total: number; page: number; size: number }>(
    CATEGORY_ENDPOINTS.GET_ALL,
    {
      params,
    }
  );

export const getCategoryById = (id: string) => api.get<Category>(CATEGORY_ENDPOINTS.GET_BY_ID(id));

export const createCategory = (data: Partial<Category>) =>
  api.post<Category>(CATEGORY_ENDPOINTS.CREATE, data);

export const updateCategory = (id: string, data: Partial<Category>) =>
  api.patch<Category>(CATEGORY_ENDPOINTS.UPDATE(id), data);

export const deleteCategory = (id: string) => api.delete<void>(CATEGORY_ENDPOINTS.DELETE(id));
