export const PATH_ROUTE_HOME = '/';
export const PATH_ROUTE_LOGIN = '/login';
export const PATH_ROUTE_DASHBOARD = '/dashboard';
export const PATH_ROUTE_PRODUCT_DETAIL = '/producto/:id';

export const PRODUCT_ROUTES = {
  DETAIL: PATH_ROUTE_PRODUCT_DETAIL,
  getDetailPath: (id: string) => `/producto/${id}`,
};
