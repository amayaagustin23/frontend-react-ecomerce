export enum CouponType {
  DISCOUNT = 'DISCOUNT',
  EXCHANGE_POINT = 'EXCHANGE_POINT',
}

export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
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

export type CreateCouponDto = {
  description: string;
  value: number;
  price: number;
  type: CouponType;
  code: string;
  status: CouponStatus;
  expiresAt: string;
};
