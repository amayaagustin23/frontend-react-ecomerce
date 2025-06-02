import { AuthProvider } from '../Auth/AuthContext';
import { CartProvider } from '../Cart/CartContext';
import { CategoryProvider } from '../Category/CategoryContext';
import { OrderProvider } from '../Order/OrderContext';
import { ProductProvider } from '../Product/ProductContext';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CategoryProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>{children}</CartProvider>
        </OrderProvider>
      </ProductProvider>
    </CategoryProvider>
  </AuthProvider>
);

export default AppProviders;
