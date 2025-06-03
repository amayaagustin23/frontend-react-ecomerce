import React, { createContext, useContext, useState } from 'react';
import { getExchangeCoupons, getMyCoupons } from '@/services/calls/coupon.service';
import { message } from 'antd';
import { Coupon } from '@/types/Coupon';
import { exchangeCoupon } from '@/services/calls/user.service';
import { getMe } from '@/services/calls/auth.service';

export type CouponContextType = {
  generalCoupons: Coupon[];
  userCoupons: Coupon[];
  fetchGeneralCoupons: () => Promise<void>;
  fetchUserCoupons: () => Promise<void>;
  exchangeCouponCode: (code: string) => Promise<void>;
};

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children: React.ReactNode }) => {
  const [generalCoupons, setGeneralCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);

  const fetchGeneralCoupons = async () => {
    try {
      const response = await getExchangeCoupons();
      setGeneralCoupons(response.data);
    } catch (error) {
      console.error('❌ Error al traer cupones generales', error);
    }
  };

  const fetchUserCoupons = async () => {
    try {
      const response = await getMyCoupons();
      setUserCoupons(response.data);
    } catch (error) {
      console.error('❌ Error al traer cupones del usuario', error);
    }
  };

  const exchangeCouponCode = async (code: string) => {
    try {
      await exchangeCoupon(code);
      message.success('🎉 Cupón canjeado con éxito');
      await fetchUserCoupons();
      await getMe();
    } catch (error) {
      message.error('❌ No se pudo canjear el cupón');
      console.error('❌ Error al canjear el cupón', error);
    }
  };

  return (
    <CouponContext.Provider
      value={{
        generalCoupons,
        userCoupons,
        fetchGeneralCoupons,
        fetchUserCoupons,
        exchangeCouponCode,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) throw new Error('useCoupon debe usarse dentro de un CouponProvider');
  return context;
};
