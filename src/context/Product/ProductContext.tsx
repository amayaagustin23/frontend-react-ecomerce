import { getAllProducts } from '@/services/calls/product.service';
import { Product } from '@/types/Product';
import { createContext, useContext, useEffect, useState } from 'react';


type Pagination = {
  page: number;
  size: number;
  total: number;
};

type ProductContextType = {
  products: Product[];
  loading: boolean;
  pagination: Pagination;
  fetchProducts: (params: { page: number; size: number }) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async (params = { page: 1, size: 10 }) => {
    setLoading(true);
    try {
      const response = await getAllProducts(params); // asegúrate que reciba { page, size }
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        pagination,
        fetchProducts,
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
