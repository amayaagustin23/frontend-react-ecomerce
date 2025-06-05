export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type CouponType = 'EXCHANGE_POINT' | 'PROMOTION';

export type Coupon = {
  id: string;
  description: string;
  value: number;
  price: number;
  type: CouponType;
  code: string;
  status: CouponStatus;
  expiresAt: string;
  createdAt: string;
};
