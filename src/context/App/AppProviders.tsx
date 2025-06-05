import React from 'react';
import { AuthProvider } from '../Auth/AuthContext';
import { CartProvider } from '../Cart/CartContext';
import { CategoryProvider } from '../Category/CategoryContext';
import { CouponProvider } from '../Coupon/CouponContext';
import { MessageProvider } from '../Message/MessageContext';
import { OrderProvider } from '../Order/OrderContext';
import { ProductProvider } from '../Product/ProductContext';
import { DashboardProvider } from '../Panel/PanelContext';
import { UserProvider } from '../User/UserContext';
import { BrandProvider } from '../Brand/BrandContext';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <UserProvider>
      <DashboardProvider>
        <CategoryProvider>
          <ProductProvider>
            <OrderProvider>
              <CouponProvider>
                <MessageProvider>
                  <BrandProvider>
                    <CartProvider>{children}</CartProvider>
                  </BrandProvider>
                </MessageProvider>
              </CouponProvider>
            </OrderProvider>
          </ProductProvider>
        </CategoryProvider>
      </DashboardProvider>
    </UserProvider>
  </AuthProvider>
);

export default AppProviders;
