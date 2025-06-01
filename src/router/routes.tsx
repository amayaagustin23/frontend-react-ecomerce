// src/routes/routes.tsx
import HomePage from '@/pages/ECOMERCE/Home';
import LoginPage from '@/pages/ECOMERCE/Login';
import DashboardPage from '@/pages/Admin/Dashboard';
import ProtectedRoute from './ProtectedRoute';

import {
  PATH_ROUTE_HOME,
  PATH_ROUTE_LOGIN,
  PATH_ROUTE_DASHBOARD,
  PATH_ROUTE_PRODUCT_DETAIL,
} from './paths';
import ProductDetailPage from '@/pages/ECOMERCE/Product/Detail';

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
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    isPrivate: true,
  },
  {
    path: PATH_ROUTE_PRODUCT_DETAIL,
    element: <ProductDetailPage />,
    isPrivate: false,
  },
];
