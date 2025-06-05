import React, { createContext, useCallback, useContext, useState } from 'react';

import { Brand } from '@/types/Brand';
import { TablePaginationConfig } from 'antd/es/table';
import { getAllBrands } from '@/services/calls/product.service';
import {
  deleteBrand,
  getAllBrandsPanel,
  getBrandById,
  updateBrand,
} from '@/services/calls/brand.service';

interface BrandContextProps {
  brands: Brand[];
  brandDetails: Brand | null;
  loading: boolean;
  pagination: TablePaginationConfig;
  fetchBrands: (pagination?: { page: number; size: number }) => Promise<void>;
  fetchBrandById: (id: string) => Promise<void>;
  updateBrandData: (id: string, data: any) => Promise<void>;
  deleteBrandById: (id: string) => Promise<void>;
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

  const fetchBrands = useCallback(async (params = { page: 1, size: 10 }) => {
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
      console.error('Error al obtener marcas', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrandById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getBrandById(id);
      setBrandDetails(res.data);
    } catch (err) {
      console.error('Error al obtener marca por ID', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBrandData = useCallback(
    async (id: string, data: any) => {
      setLoading(true);
      try {
        await updateBrand(id, data);
        await fetchBrands();
      } catch (err) {
        console.error('Error al actualizar marca', err);
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands]
  );

  const deleteBrandById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteBrand(id);
        await fetchBrands();
      } catch (err) {
        console.error('Error al eliminar marca', err);
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands]
  );

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
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
