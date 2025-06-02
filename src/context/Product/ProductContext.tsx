import { getAllProducts, getAllBrands, getAllVariants } from '@/services/calls/product.service';
import { Brand } from '@/types/Brand';
import { Product } from '@/types/Product';
import { createContext, useContext, useState, useEffect } from 'react';

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
  loading: boolean;
  pagination: Pagination;
  brands: Brand[];
  variants: string[];
  fetchProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchFilteredProducts: (params?: FetchProductsParams) => Promise<void>;
  loadBrandsAndVariants: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsFiltered, setProductsFiltered] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [variants, setVariants] = useState<string[]>([]);
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

  const loadBrandsAndVariants = async () => {
    try {
      const [brandsRes, variantsRes] = await Promise.all([getAllBrands(), getAllVariants()]);

      setBrands(brandsRes.data);
      setVariants(variantsRes.data);
    } catch {
      setBrands([]);
      setVariants([]);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productsFiltered,
        loading,
        pagination,
        brands,
        variants,
        fetchProducts,
        fetchFilteredProducts,
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
