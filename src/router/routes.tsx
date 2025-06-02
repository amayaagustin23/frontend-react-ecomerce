import HomePage from '@/pages/Client/Home';
import LoginPage from '@/pages/Client/Login';
import DashboardPage from '@/pages/Admin/Dashboard';
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
} from './paths';
import CartPage from '@/pages/Client/Cart';
import UserProfilePage from '@/pages/Client/Profile';
import OrderDetailPage from '@/pages/Client/OrderDetail';

export const routes = [
  {
    path: PATH_ROUTE_HOME,
    element: <HomePage />,
    isPrivate: false,
  },
  {
    path: PATH_ROUTE_LOGIN,
    element: <LoginPage />,
    isPrivate: false,
  },
  {
    path: PATH_ROUTE_DASHBOARD,
    element: <DashboardPage />,
    isPrivate: true,
  },
  {
    path: PATH_ROUTE_PRODUCTS,
    element: <ProductsPage />,
    isPrivate: false,
  },
  {
    path: PATH_ROUTE_PRODUCT_DETAIL,
    element: <ProductDetailPage />,
    isPrivate: false,
  },
  {
    path: PATH_ROUTE_CONTACT,
    element: <ContactPage />,
    isPrivate: false,
  },
  {
    path: PATH_ROUTE_CART,
    element: <CartPage />,
    isPrivate: true,
  },
  {
    path: PATH_ROUTE_PROFILE,
    element: <UserProfilePage />,
    isPrivate: true,
  },
  {
    path: PATH_ROUTE_ORDER_DETAIL,
    element: <OrderDetailPage />,
    isPrivate: true,
  },
];
