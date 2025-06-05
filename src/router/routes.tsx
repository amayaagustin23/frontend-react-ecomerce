import React from 'react';
import HomePage from '@/pages/Client/Home';
import LoginPage from '@/pages/Auth/Login';
import ProductDetailPage from '@/pages/Client/Product/Detail';
import ProductsPage from '@/pages/Client/Product/Products';
import ContactPage from '@/pages/Client/Contact';
import CartPage from '@/pages/Client/Cart';
import UserProfilePage from '@/pages/Client/Profile';
import OrderDetailPage from '@/pages/Client/OrderDetail';
import RegisterPage from '@/pages/Auth/Register';
import RecoveryPasswordPage from '@/pages/Auth/RecoveryPassword';
import ResetPasswordPage from '@/pages/Auth/ResetPassword';
import DashboardPage from '@/pages/Admin/Dashboard';
import ProductsPanelPage from '@/pages/Admin/Products/All';
import UsersPanelPage from '@/pages/Admin/Users/All';
import CouponsPanelPage from '@/pages/Admin/Coupons/All';
import CategoriesPanelPage from '@/pages/Admin/Categories/All';
import BrandsPanelPage from '@/pages/Admin/Brands/All';
import OrdersPanelPage from '@/pages/Admin/Orders/All';

// import ProductCreatePanel from '@/pages/Admin/Products/Create';
// import ProductEditPanel from '@/pages/Admin/Products/Edit';
import ProductDetailPanel from '@/pages/Admin/Products/Detail';

// import UserCreatePanel from '@/pages/Admin/Users/Create';
// import UserEditPanel from '@/pages/Admin/Users/Edit';
// import UserDetailPanel from '@/pages/Admin/Users/Detail';

// import CouponCreatePanel from '@/pages/Admin/Coupons/Create';
// import CouponEditPanel from '@/pages/Admin/Coupons/Edit';
// import CouponDetailPanel from '@/pages/Admin/Coupons/Detail';

// import OrderCreatePanel from '@/pages/Admin/Orders/Create';
// import OrderEditPanel from '@/pages/Admin/Orders/Edit';
// import OrderDetailPanel from '@/pages/Admin/Orders/Detail';

// import CategoryCreatePanel from '@/pages/Admin/Categories/Create';
// import CategoryEditPanel from '@/pages/Admin/Categories/Edit';
// import CategoryDetailPanel from '@/pages/Admin/Categories/Detail';

// import BrandCreatePanel from '@/pages/Admin/Brands/Create';
// import BrandEditPanel from '@/pages/Admin/Brands/Edit';
// import BrandDetailPanel from '@/pages/Admin/Brands/Detail';

import {
  PATH_ROUTE_HOME,
  PATH_ROUTE_LOGIN,
  PATH_ROUTE_PANEL_DASHBOARD,
  PATH_ROUTE_PRODUCT_DETAIL,
  PATH_ROUTE_PRODUCTS,
  PATH_ROUTE_CONTACT,
  PATH_ROUTE_CART,
  PATH_ROUTE_PROFILE,
  PATH_ROUTE_ORDER_DETAIL,
  PATH_ROUTE_REGISTER,
  PATH_ROUTE_RECOVERY_PASSWORD,
  PATH_ROUTE_RESET_PASSWORD,
  PATH_ROUTE_PANEL_PRODUCTS,
  PATH_ROUTE_PANEL_PRODUCTS_CREATE,
  PATH_ROUTE_PANEL_PRODUCTS_DETAIL,
  PATH_ROUTE_PANEL_USERS,
  PATH_ROUTE_PANEL_USERS_CREATE,
  PATH_ROUTE_PANEL_USERS_EDIT,
  PATH_ROUTE_PANEL_USERS_DETAIL,
  PATH_ROUTE_PANEL_COUPONS,
  PATH_ROUTE_PANEL_COUPONS_CREATE,
  PATH_ROUTE_PANEL_COUPONS_EDIT,
  PATH_ROUTE_PANEL_COUPONS_DETAIL,
  PATH_ROUTE_PANEL_ORDERS_CREATE,
  PATH_ROUTE_PANEL_ORDERS_EDIT,
  PATH_ROUTE_PANEL_ORDERS_DETAIL,
  PATH_ROUTE_PANEL_CATEGORIES,
  PATH_ROUTE_PANEL_ORDERS,
  PATH_ROUTE_PANEL_CATEGORIES_CREATE,
  PATH_ROUTE_PANEL_CATEGORIES_EDIT,
  PATH_ROUTE_PANEL_CATEGORIES_DETAIL,
  PATH_ROUTE_PANEL_BRANDS,
  PATH_ROUTE_PANEL_BRANDS_CREATE,
  PATH_ROUTE_PANEL_BRANDS_EDIT,
  PATH_ROUTE_PANEL_BRANDS_DETAIL,
} from './paths';
import ProductCreatePanelPage from '@/pages/Admin/Products/Create';
import ProductDetailPanelPage from '@/pages/Admin/Products/Detail';

export const routes = [
  { path: PATH_ROUTE_HOME, element: <HomePage />, isPrivate: false, layout: 'client' },
  { path: PATH_ROUTE_LOGIN, element: <LoginPage />, isPrivate: false, layout: null },
  { path: PATH_ROUTE_REGISTER, element: <RegisterPage />, isPrivate: false, layout: null },
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

  { path: PATH_ROUTE_PRODUCTS, element: <ProductsPage />, isPrivate: false, layout: 'client' },
  {
    path: PATH_ROUTE_PRODUCT_DETAIL,
    element: <ProductDetailPage />,
    isPrivate: false,
    layout: 'client',
  },
  { path: PATH_ROUTE_CONTACT, element: <ContactPage />, isPrivate: false, layout: 'client' },
  { path: PATH_ROUTE_CART, element: <CartPage />, isPrivate: true, layout: 'client' },
  { path: PATH_ROUTE_PROFILE, element: <UserProfilePage />, isPrivate: true, layout: 'client' },
  {
    path: PATH_ROUTE_ORDER_DETAIL,
    element: <OrderDetailPage />,
    isPrivate: true,
    layout: 'client',
  },

  {
    path: '',
    element: <DashboardPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  {
    path: PATH_ROUTE_PANEL_PRODUCTS,
    element: <ProductsPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  {
    path: PATH_ROUTE_PANEL_PRODUCTS_CREATE,
    element: <ProductCreatePanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  // {
  //   path: PATH_ROUTE_PANEL_PRODUCTS_EDIT,
  //   element: <ProductEditPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  {
    path: PATH_ROUTE_PANEL_PRODUCTS_DETAIL,
    element: <ProductDetailPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },

  {
    path: PATH_ROUTE_PANEL_USERS,
    element: <UsersPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  // {
  //   path: PATH_ROUTE_PANEL_USERS_CREATE,
  //   element: <UserCreatePanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_USERS_EDIT,
  //   element: <UserEditPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_USERS_DETAIL,
  //   element: <UserDetailPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },

  {
    path: PATH_ROUTE_PANEL_COUPONS,
    element: <CouponsPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  // {
  //   path: PATH_ROUTE_PANEL_COUPONS_CREATE,
  //   element: <CouponCreatePanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_COUPONS_EDIT,
  //   element: <CouponEditPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_COUPONS_DETAIL,
  //   element: <CouponDetailPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },

  {
    path: PATH_ROUTE_PANEL_ORDERS,
    element: <OrdersPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  // {
  //   path: PATH_ROUTE_PANEL_ORDERS_CREATE,
  //   element: <OrderCreatePanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_ORDERS_EDIT,
  //   element: <OrderEditPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_ORDERS_DETAIL,
  //   element: <OrderDetailPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },

  {
    path: PATH_ROUTE_PANEL_CATEGORIES,
    element: <CategoriesPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  // {
  //   path: PATH_ROUTE_PANEL_CATEGORIES_CREATE,
  //   element: <CategoryCreatePanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_CATEGORIES_EDIT,
  //   element: <CategoryEditPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_CATEGORIES_DETAIL,
  //   element: <CategoryDetailPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },

  {
    path: PATH_ROUTE_PANEL_BRANDS,
    element: <BrandsPanelPage />,
    isPrivate: true,
    layout: 'dashboard',
  },
  // {
  //   path: PATH_ROUTE_PANEL_BRANDS_CREATE,
  //   element: <BrandCreatePanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_BRANDS_EDIT,
  //   element: <BrandEditPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
  // {
  //   path: PATH_ROUTE_PANEL_BRANDS_DETAIL,
  //   element: <BrandDetailPanel />,
  //   isPrivate: true,
  //   layout: 'dashboard',
  // },
];
