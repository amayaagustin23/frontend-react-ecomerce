import { api } from '@/services/api';
import { COUPON_ENDPOINTS } from '../endpoints';

export const getAllCoupons = () => api.get(COUPON_ENDPOINTS.GET_ALL);
export const getCouponById = (id: string) => api.get(COUPON_ENDPOINTS.GET_BY_ID(id));
export const getExchangeCoupons = () => api.get(COUPON_ENDPOINTS.GET_EXCHANGE);
export const getPromotionCoupons = () => api.get(COUPON_ENDPOINTS.GET_PROMOTION);
export const getMyCoupons = () => api.get(COUPON_ENDPOINTS.GET_MY_COUPONS);
