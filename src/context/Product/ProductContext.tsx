import React, { createContext, useContext, useState, useRef } from 'react';
import {
  getAllProducts,
  getAllBrands,
  getAllVariantColors,
  getAllVariantSizes,
  getAllVariantGenders,
  getAllFavorites,
} from '@/services/calls/product.service';
import { Brand } from '@/types/Brand';
import { Product } from '@/types/Product';
import Cookies from 'js-cookie';
import { useAuth } from '../Auth/AuthContext';

type Pagination = {
  page: number;
  size: number;
  total: number;
};

export type FetchProductsParams = {
  page?: number;
  size?: number;
  search?: string;
  categoryIds?: string;
  category?: string;
  brandIds?: string;
  minPrice?: number;
  maxPrice?: number;
  variantsName?: string;
  orderBy?: string;
};

type ProductContextType = {
  products: Product[];
  productsFiltered: Product[];
  favoriteProducts: Product[];
  loading: boolean;
  pagination: Pagination;
  brands: Brand[];
  variantColors: string[];
  variantSizes: string[];
  variantGenders: string[];
  fetchProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchFilteredProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchFavoriteProducts: () => Promise<void>;
  loadBrandsAndVariants: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsFiltered, setProductsFiltered] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [variantColors, setVariantColors] = useState<string[]>([]);
  const [variantSizes, setVariantSizes] = useState<string[]>([]);
  const [variantGenders, setVariantGenders] = useState<string[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts: ProductContextType['fetchProducts'] = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getAllProducts(params);
      setProducts(response.data.data);
      setPagination({
        page: response.data.page,
        size: response.data.size,
        total: response.data.total,
      });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredProducts: ProductContextType['fetchFilteredProducts'] = async (
    params = {}
  ) => {
    const paramKeys = Object.keys(params).filter(
      (key) => params[key as keyof typeof params] !== undefined
    );

    const shouldSetLoading = paramKeys.length <= 2;
    if (shouldSetLoading) setLoading(true);

    try {
      const response = await getAllProducts(params);
      setProductsFiltered(response.data.data);
    } catch {
      setProductsFiltered([]);
    } finally {
      if (shouldSetLoading) setLoading(false);
    }
  };

  const fetchFavoriteProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllFavorites();
      setFavoriteProducts(res.data);
    } catch {
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBrandsAndVariants = async () => {
    try {
      const [brandsRes, variantsColorRes, variantSizesRes, variantGendersRes] = await Promise.all([
        getAllBrands(),
        getAllVariantColors(),
        getAllVariantSizes(),
        getAllVariantGenders(),
      ]);

      setBrands(brandsRes.data);
      setVariantColors(variantsColorRes.data);
      setVariantSizes(variantSizesRes.data);
      setVariantGenders(variantGendersRes.data);
    } catch {
      setBrands([]);
      setVariantColors([]);
      setVariantSizes([]);
      setVariantGenders([]);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productsFiltered,
        favoriteProducts,
        loading,
        pagination,
        brands,
        variantColors,
        variantSizes,
        variantGenders,
        fetchProducts,
        fetchFilteredProducts,
        fetchFavoriteProducts,
        loadBrandsAndVariants,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
