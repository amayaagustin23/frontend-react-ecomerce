export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  RECOVER_PASSWORD: '/auth/recover-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
};

export const USER_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: (id: string) => `/users/${id}`,
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  EXCHANGE_COUPON: (code: string) => `/users/exchange-coupon-points/${code}`,
  ADDRESS_DEFAULT_UPDATE: (id: string) => `/users/address-default/${id}`,
};

export const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_BY_ID: (id: string) => `/products/${id}`,
  CREATE: '/products',
  UPDATE: (id: string) => `/products/${id}`,
  GET_ALL_BRANDS: '/products/all/brands',
  GET_ALL_COLORS: '/products/variants/colors',
  GET_ALL_SIZES: '/products/variants/sizes',
  GET_ALL_GENDERS: '/products/variants/genders',
};

export const CATEGORY_ENDPOINTS = {
  GET_ALL: '/categories',
  GET_BY_ID: (id: string) => `/categories/${id}`,
  CREATE: '/categories',
  UPDATE: (id: string) => `/categories/${id}`,
  DELETE: (id: string) => `/categories/${id}`,
};

export const CART_ENDPOINTS = {
  CREATE: '/carts',
  GET: '/carts',
  UPDATE: (cartId: string) => `/carts/${cartId}`,
  VERIFY_STOCK: (cartId: string) => `/carts/verify/${cartId}`,
};

export const ORDER_ENDPOINTS = {
  CREATE_FROM_CART: (cartId: string) => `/orders/cart/${cartId}`,
  GET_ALL: '/orders',
  GET_BY_ID: (id: string) => `/orders/${id}`,
};

export const COUPON_ENDPOINTS = {
  GET_ALL: '/coupons',
  GET_BY_ID: (id: string) => `/coupons/${id}`,
  GET_EXCHANGE: '/coupons/general/exchange',
  GET_PROMOTION: '/coupons/general/promotion',
  GET_MY_COUPONS: '/coupons/my/coupons',
};
