import { api } from '@/services/api';
import { ORDER_ENDPOINTS } from '../endpoints';
import { CreateOrderDto } from '@/types/Order';

export const createOrderFromCart = (cartId: string, body: CreateOrderDto) => {
  return api.post(ORDER_ENDPOINTS.CREATE_FROM_CART(cartId), body);
};

export const getUserOrders = () => {
  return api.get(ORDER_ENDPOINTS.GET_ALL);
};

export const getUserOrderById = (id: string) => {
  return api.get(ORDER_ENDPOINTS.GET_BY_ID(id));
};

export const calculateShippingApi = (code: string) => {
  return api.get(ORDER_ENDPOINTS.GET_CALCULATE_SHIPING(code));
};
