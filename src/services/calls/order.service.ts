import { api } from '@/services/api';
import { ORDER_ENDPOINTS } from '../endpoints';

export const createOrderFromCart = (cartId: string) => {
  return api.post(ORDER_ENDPOINTS.CREATE_FROM_CART(cartId));
};

export const getUserOrders = () => {
  return api.get(ORDER_ENDPOINTS.GET_ALL);
};

export const getUserOrderById = (id: string) => {
  return api.get(ORDER_ENDPOINTS.GET_BY_ID(id));
};
