import React, { createContext, useContext, useState } from 'react';
import {
  getAllProducts,
  getAllBrands,
  getAllVariantColors,
  getAllVariantSizes,
  getAllVariantGenders,
  getAllFavorites,
  getProductById,
  updateProduct,
  createProduct,
} from '@/services/calls/product.service';
import { Brand } from '@/types/Brand';
import { Color, DetailedProduct, Gender, Size } from '@/types/Product';
import { message } from 'antd';
import { useAuth } from '../Auth/AuthContext';

export type Pagination = {
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
  products: DetailedProduct[];
  product: DetailedProduct | null;
  setProduct: React.Dispatch<React.SetStateAction<DetailedProduct | null>>;
  productsFiltered: DetailedProduct[];
  favoriteProducts: DetailedProduct[];
  loading: boolean;
  pagination: Pagination;
  brands: Brand[];
  variantColors: Color[];
  variantSizes: Size[];
  variantGenders: Gender[];
  fetchProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchFilteredProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchFavoriteProducts: () => Promise<void>;
  loadBrandsAndVariants: () => Promise<void>;
  toggleProductActive: (id: string, isActive: boolean) => Promise<void>;
  createNewProduct: (data: any) => Promise<void>;
  editProduct: (id: string, data: any, files: File[]) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  updateProductById: (id: string, data: FormData) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [productsFiltered, setProductsFiltered] = useState<DetailedProduct[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<DetailedProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [variantColors, setVariantColors] = useState<Color[]>([]);
  const [variantSizes, setVariantSizes] = useState<Size[]>([]);
  const [variantGenders, setVariantGenders] = useState<Gender[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, size: 10, total: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchProducts = async (params: FetchProductsParams = {}) => {
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

  const fetchFilteredProducts = async (params: FetchProductsParams = {}) => {
    const shouldSetLoading =
      Object.keys(params).filter((key) => params[key as keyof typeof params] !== undefined)
        .length <= 2;
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
      if (user?.role === 'CLIENT') {
        setLoading(true);
        const res = await getAllFavorites();
        setFavoriteProducts(res.data);
      }
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

  const toggleProductActive = async (id: string, isActive: boolean) => {
    try {
      await updateProduct(id, { isActive });
      await fetchProducts(pagination);
    } catch (err) {
      console.error('Error al actualizar el estado del producto:', err);
    }
  };

  const createNewProduct = async (data: any) => {
    try {
      setLoading(true);
      await createProduct(data);
      await fetchProducts(pagination);
      message.success('Producto creado con éxito');
    } catch (err) {
      console.error('Error al crear producto:', err);
      message.error('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id: string, data: any, files: File[]) => {
    try {
      setLoading(true);
      await updateProduct(id, data, files);
      await fetchProducts(pagination);
      message.success('Producto actualizado con éxito');
    } catch (err) {
      console.error('Error al editar producto:', err);
      message.error('Error al editar el producto');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string): Promise<void> => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  };

  const updateProductById = async (id: string, data: FormData): Promise<void> => {
    try {
      await updateProduct(id, data);
      await fetchProductById(id);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        setProduct,
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
        toggleProductActive,
        createNewProduct,
        editProduct,
        fetchProductById,
        updateProductById,
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
