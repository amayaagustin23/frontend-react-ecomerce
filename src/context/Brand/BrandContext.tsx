import React, { createContext, useCallback, useContext, useState } from 'react';
import { Brand } from '@/types/Brand';
import { TablePaginationConfig } from 'antd/es/table';
import {
  createBrand,
  deleteBrand,
  getAllBrandsPanel,
  getBrandById,
  updateBrand,
} from '@/services/calls/brand.service';
import { useMessageApi } from '../Message/MessageContext';

interface BrandContextProps {
  brands: Brand[];
  brandDetails: Brand | null;
  loading: boolean;
  pagination: TablePaginationConfig;
  fetchBrands: (pagination?: { page: number; size: number }) => Promise<void>;
  fetchBrandById: (id: string) => Promise<void>;
  updateBrandData: (id: string, data: { name: string }) => Promise<void>;
  deleteBrandById: (id: string) => Promise<void>;
  createBrandData: (data: { name: string }) => Promise<void>;
}

const BrandContext = createContext<BrandContextProps>({} as BrandContextProps);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandDetails, setBrandDetails] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const message = useMessageApi();

  const fetchBrands = async (params = { page: 1, size: 10 }) => {
    setLoading(true);
    try {
      const res = await getAllBrandsPanel(params);
      setBrands(res.data.data);
      setPagination({
        current: res.data.page,
        pageSize: res.data.size,
        total: res.data.total,
      });
    } catch (err) {
      message.error('Error al obtener marcas');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandById = async (id: string) => {
    setLoading(true);
    try {
      const res = await getBrandById(id);
      setBrandDetails(res.data);
    } catch (err) {
      message.error('Error al obtener marca');
    } finally {
      setLoading(false);
    }
  };

  const updateBrandData = async (id: string, data: any) => {
    setLoading(true);
    try {
      await updateBrand(id, data);
      await fetchBrands();
      message.success('Marca actualizada exitosamente');
    } catch (err) {
      message.error('Error al actualizar marca');
    } finally {
      setLoading(false);
    }
  };

  const deleteBrandById = async (id: string) => {
    setLoading(true);
    try {
      await deleteBrand(id);
      await fetchBrands();
    } catch (err) {
      message.error('Error al eliminar marca');
    } finally {
      setLoading(false);
    }
  };

  const createBrandData = async (data: { name: string }) => {
    setLoading(true);
    try {
      await createBrand(data);
      message.success('Marca creada exitosamente');
      await fetchBrands();
    } catch (err) {
      message.error('Error al crear marca');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brands,
        brandDetails,
        loading,
        pagination,
        fetchBrands,
        fetchBrandById,
        updateBrandData,
        deleteBrandById,
        createBrandData,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
