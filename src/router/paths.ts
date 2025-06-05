export const PATH_ROUTE_HOME = '/';
export const PATH_ROUTE_LOGIN = '/login';
export const PATH_ROUTE_REGISTER = '/registro';
export const PATH_ROUTE_RECOVERY_PASSWORD = '/recuperar-contraseña';
export const PATH_ROUTE_RESET_PASSWORD = '/cambiar-contraseña/:token';
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

export const PATH_ROUTE_PANEL_DASHBOARD = '/';

export const PATH_ROUTE_PANEL_PRODUCTS = 'products';
export const PATH_ROUTE_PANEL_PRODUCTS_CREATE = '/products/create';
export const PATH_ROUTE_PANEL_PRODUCTS_DETAIL = '/products/detail/:id';
export const PATH_PANEL_PRODUCT = {
  getDetailPath: (id: string) => `detail/${id}`,
};

export const PATH_ROUTE_PANEL_USERS = 'users';
export const PATH_ROUTE_PANEL_USERS_CREATE = 'users/create';
export const PATH_ROUTE_PANEL_USERS_EDIT = 'users/edit/:id';
export const PATH_ROUTE_PANEL_USERS_DETAIL = 'users/detail/:id';

export const PATH_ROUTE_PANEL_COUPONS = 'coupons';
export const PATH_ROUTE_PANEL_COUPONS_CREATE = 'coupons/create';
export const PATH_ROUTE_PANEL_COUPONS_EDIT = 'coupons/edit/:id';
export const PATH_ROUTE_PANEL_COUPONS_DETAIL = 'coupons/detail/:id';

export const PATH_ROUTE_PANEL_ORDERS = 'orders';
export const PATH_ROUTE_PANEL_ORDERS_DETAIL = 'orders/detail/:id';
export const PATH_ROUTE_PANEL_ORDERS_EDIT = 'orders/edit/:id';
export const PATH_ROUTE_PANEL_ORDERS_CREATE = 'orders/create';

export const PATH_ROUTE_PANEL_CATEGORIES = 'categories';
export const PATH_ROUTE_PANEL_CATEGORIES_CREATE = 'categories/create';
export const PATH_ROUTE_PANEL_CATEGORIES_EDIT = 'categories/edit/:id';
export const PATH_ROUTE_PANEL_CATEGORIES_DETAIL = 'categories/detail/:id';

export const PATH_ROUTE_PANEL_BRANDS = 'brands';
export const PATH_ROUTE_PANEL_BRANDS_CREATE = 'brands/create';
export const PATH_ROUTE_PANEL_BRANDS_EDIT = 'brands/edit/:id';
export const PATH_ROUTE_PANEL_BRANDS_DETAIL = 'brands/detail/:id';
