import { api } from '@/services/api';
import { COUPON_ENDPOINTS } from '../endpoints';

export const getAllCoupons = () => api.get(COUPON_ENDPOINTS.GET_ALL);
export const getCouponById = (id: string) => api.get(COUPON_ENDPOINTS.GET_BY_ID(id));
export const getExchangeCoupons = () => api.get(COUPON_ENDPOINTS.GET_EXCHANGE);
export const getPromotionCoupons = () => api.get(COUPON_ENDPOINTS.GET_PROMOTION);
export const getMyCoupons = () => api.get(COUPON_ENDPOINTS.GET_MY_COUPONS);

export const getAllCouponsPanel = (params: { page: number; size: number }) =>
  api.get(COUPON_ENDPOINTS.GET_ALL, { params });

export const deleteCoupon = (id: string) => api.delete(COUPON_ENDPOINTS.GET_BY_ID(id));

export const createCoupon = (data: any) => api.post(COUPON_ENDPOINTS.GET_ALL, data);

export const updateCoupon = (id: string, data: any) =>
  api.patch(COUPON_ENDPOINTS.GET_BY_ID(id), data);
