import { CreateCartDto, UpdateCartDto } from '@/types/Cart';
import { api } from '../api';
import { CART_ENDPOINTS } from '../endpoints';

export const getCart = () => api.get(CART_ENDPOINTS.GET).then((res) => res);

export const createCart = (body: CreateCartDto) =>
  api.post(CART_ENDPOINTS.CREATE, body).then((res) => res);

export const updateCart = (id: string, body: UpdateCartDto) =>
  api.patch(CART_ENDPOINTS.UPDATE(id), body).then((res) => res);

export const verifyStock = (cartId: string) =>
  api.get(CART_ENDPOINTS.VERIFY_STOCK(cartId)).then((res) => res);
