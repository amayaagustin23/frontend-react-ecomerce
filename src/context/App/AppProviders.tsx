import { AuthProvider } from '../Auth/AuthContext';
import { CartProvider } from '../Cart/CartContext';
import { CategoryProvider } from '../Category/CategoryContext';
import { CouponProvider } from '../Coupon/CouponContext';
import { MessageProvider } from '../Message/MessageContext';
import { OrderProvider } from '../Order/OrderContext';
import { ProductProvider } from '../Product/ProductContext';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CategoryProvider>
      <ProductProvider>
        <OrderProvider>
          <CouponProvider>
            <MessageProvider>
              <CartProvider>{children}</CartProvider>
            </MessageProvider>
          </CouponProvider>
        </OrderProvider>
      </ProductProvider>
    </CategoryProvider>
  </AuthProvider>
);

export default AppProviders;
