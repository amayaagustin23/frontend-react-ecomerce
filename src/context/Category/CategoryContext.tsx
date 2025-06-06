import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesOutPaginated,
} from '@/services/calls/category.service';
import { Category, UpdateCategoryDto } from '@/types/Category';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { useMessageApi } from '../Message/MessageContext';

type Pagination = {
  page: number;
  size: number;
  total: number;
};

type PaginationParams = {
  page?: number;
  size?: number;
};

type CategoryContextType = {
  categories: Category[];
  categoriesOutPaginated: Category[];
  selectedCategory: Category | null;
  category: Category | null;
  loading: boolean;
  pagination: Pagination;
  fetchCategories: (params?: PaginationParams) => Promise<void>;
  fetchCategoriesOutPaginated: () => Promise<void>;
  fetchCategoryById: (id: string) => void;
  selectCategory: (id: string) => Promise<void>;
  createCategory: (data: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryDto) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoriesOutPaginated, setCategoriesOutPaginated] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const message = useMessageApi();

  const { t } = useTranslation();

  const fetchCategories = useCallback(
    async (params: PaginationParams = { page: 1, size: 10 }) => {
      try {
        setLoading(true);
        const res: AxiosResponse = await getAllCategories(params);
        setCategories(res.data.data);
        setPagination({
          page: params.page ?? 1,
          size: params.size ?? 10,
          total: res.data.total,
        });
      } catch (error) {
        message.error(t('categories.messages.fetchError'));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const fetchCategoriesOutPaginated = useCallback(async () => {
    try {
      setLoading(true);
      const res: AxiosResponse = await getAllCategoriesOutPaginated();
      setCategoriesOutPaginated(res.data);
    } catch (error) {
      message.error(t('categories.messages.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchCategoryById = async (id: string) => {
    try {
      const { data } = await getCategoryById(id);
      setCategory(data);
    } catch {
      message.error(t('categories.messages.getOneError'));
      return null;
    }
  };

  const selectCategory = async (id: string) => {
    try {
      const { data } = await getCategoryById(id);
      setSelectedCategory(data);
    } catch {
      message.error(t('categories.messages.getOneError'));
    }
  };

  const handleCreate = async (data: Partial<Category>) => {
    try {
      await createCategory(data);
      message.success(t('categories.messages.createSuccess'));
      await fetchCategories({ page: pagination.page, size: pagination.size });
    } catch {
      message.error(t('categories.messages.createError'));
    }
  };

  const handleUpdate = async (id: string, data: UpdateCategoryDto) => {
    try {
      await updateCategory(id, data);
      message.success(t('categories.messages.updateSuccess'));
      await fetchCategories({ page: pagination.page, size: pagination.size });
    } catch {
      message.error(t('categories.messages.updateError'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success(t('categories.messages.deleteSuccess'));
      await fetchCategories({ page: pagination.page, size: pagination.size });
    } catch {
      message.error(t('categories.messages.deleteError'));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        category,
        categoriesOutPaginated,
        selectedCategory,
        loading,
        pagination,
        fetchCategories,
        fetchCategoriesOutPaginated,
        fetchCategoryById,
        selectCategory,
        createCategory: handleCreate,
        updateCategory: handleUpdate,
        deleteCategory: handleDelete,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategory debe usarse dentro de un CategoryProvider');
  return context;
};
