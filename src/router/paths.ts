export const PATH_ROUTE_HOME = '/';
export const PATH_ROUTE_LOGIN = '/login';
export const PATH_ROUTE_DASHBOARD = '/dashboard';
export const PATH_ROUTE_PRODUCTS = '/productos';
export const PATH_ROUTE_CONTACT = '/contacto';
export const PATH_ROUTE_PRODUCT_DETAIL = '/producto/:id';
export const PATH_ROUTE_CART = '/carrito';
export const PATH_ROUTE_PROFILE = '/perfil';
export const PATH_ROUTE_ORDER_DETAIL = '/pedido/:id';

export const PRODUCT_ROUTES = {
  DETAIL: PATH_ROUTE_PRODUCT_DETAIL,
  getDetailPath: (id: string) => `/producto/${id}`,
};

export const ORDER_ROUTES = {
  DETAIL: PATH_ROUTE_ORDER_DETAIL,
  getDetailPath: (id: string) => `/pedido/${id}`,
};
