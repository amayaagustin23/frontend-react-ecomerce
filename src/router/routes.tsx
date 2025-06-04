import HomePage from '@/pages/Client/Home';
import LoginPage from '@/pages/Auth/Login';
import ProductDetailPage from '@/pages/Client/Product/Detail';
import ProductsPage from '@/pages/Client/Product/Products';
import ContactPage from '@/pages/Client/Contact';

import {
  PATH_ROUTE_HOME,
  PATH_ROUTE_LOGIN,
  PATH_ROUTE_DASHBOARD,
  PATH_ROUTE_PRODUCT_DETAIL,
  PATH_ROUTE_PRODUCTS,
  PATH_ROUTE_CONTACT,
  PATH_ROUTE_CART,
  PATH_ROUTE_PROFILE,
  PATH_ROUTE_ORDER_DETAIL,
  PATH_ROUTE_REGISTER,
  PATH_ROUTE_RECOVERY_PASSWORD,
  PATH_ROUTE_RESET_PASSWORD,
} from './paths';
import CartPage from '@/pages/Client/Cart';
import UserProfilePage from '@/pages/Client/Profile';
import OrderDetailPage from '@/pages/Client/OrderDetail';
import RegisterPage from '@/pages/Auth/Register';
import RecoveryPasswordPage from '@/pages/Auth/RecoveryPassword';
import DashboardPage from '@/pages/Admin/Dashboard';
import ResetPasswordPage from '@/pages/Auth/ResetPassword';

export const routes = [
  {
    path: PATH_ROUTE_HOME,
    element: <HomePage />,
    isPrivate: false,
    layout: 'client',
  },
  {
    path: PATH_ROUTE_LOGIN,
    element: <LoginPage />,
    isPrivate: false,
    layout: null,
  },
  {
    path: PATH_ROUTE_REGISTER,
    element: <RegisterPage />,
    isPrivate: false,
    layout: null,
  },
  {
    path: PATH_ROUTE_RECOVERY_PASSWORD,
    element: <RecoveryPasswordPage />,
    isPrivate: false,
    layout: null,
  },
  {
    path: PATH_ROUTE_RESET_PASSWORD,
    element: <ResetPasswordPage />,
    isPrivate: false,
    layout: null,
  },
  {
    path: PATH_ROUTE_DASHBOARD,
    element: <DashboardPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  {
    path: PATH_ROUTE_PRODUCTS,
    element: <ProductsPage />,
    isPrivate: false,
    layout: 'client',
  },
  {
    path: PATH_ROUTE_PRODUCT_DETAIL,
    element: <ProductDetailPage />,
    isPrivate: false,
    layout: 'client',
  },
  {
    path: PATH_ROUTE_CONTACT,
    element: <ContactPage />,
    isPrivate: false,
    layout: 'client',
  },
  {
    path: PATH_ROUTE_CART,
    element: <CartPage />,
    isPrivate: true,
    layout: 'client',
  },
  {
    path: PATH_ROUTE_PROFILE,
    element: <UserProfilePage />,
    isPrivate: true,
    layout: 'client',
  },
  {
    path: PATH_ROUTE_ORDER_DETAIL,
    element: <OrderDetailPage />,
    isPrivate: true,
    layout: 'client',
  },
];
