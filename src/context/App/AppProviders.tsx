import { AuthProvider } from '../Auth/AuthContext';
import { CartProvider } from '../Cart/CartContext';
import { ProductProvider } from '../Product/ProductContext';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ProductProvider>
      <CartProvider>{children}</CartProvider>
    </ProductProvider>
  </AuthProvider>
);

export default AppProviders;
