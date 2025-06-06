import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getExchangeCoupons,
  getMyCoupons,
  getAllCouponsPanel,
  deleteCoupon,
  createCoupon,
  updateCoupon,
  getCouponById,
} from '@/services/calls/coupon.service';
import { exchangeCoupon } from '@/services/calls/user.service';
import { getMe } from '@/services/calls/auth.service';
import { Coupon } from '@/types/Coupon';
import { TablePaginationConfig } from 'antd/es/table';
import { useMessageApi } from '../Message/MessageContext';

export type CouponContextType = {
  generalCoupons: Coupon[];
  userCoupons: Coupon[];
  coupons: Coupon[];
  coupon: Coupon | null;
  pagination: TablePaginationConfig;
  loading: boolean;
  fetchGeneralCoupons: () => Promise<void>;
  fetchUserCoupons: () => Promise<void>;
  exchangeCouponCode: (code: string) => Promise<void>;
  fetchCoupons: (params?: { page: number; size: number }) => Promise<void>;
  deleteCouponById: (id: string) => Promise<void>;
  createCouponData: (data: any) => Promise<void>;
  updateCouponData: (id: string, data: any) => Promise<void>;
  fetchCouponById: (id: string) => Promise<void>;
};

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children: React.ReactNode }) => {
  const [generalCoupons, setGeneralCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const message = useMessageApi();

  const fetchGeneralCoupons = async () => {
    try {
      const response = await getExchangeCoupons();
      setGeneralCoupons(response.data);
    } catch (error) {
      message.error('❌ Error al traer cupones generales');
    }
  };

  const fetchUserCoupons = async () => {
    try {
      const response = await getMyCoupons();
      setUserCoupons(response.data);
    } catch (error) {
      message.error('❌ Error al traer cupones del usuario');
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
    }
  };

  const fetchCoupons = async (params = { page: 1, size: 10 }) => {
    setLoading(true);
    try {
      const res = await getAllCouponsPanel(params);
      setCoupons(res.data.data);
      setPagination({
        current: res.data.page,
        pageSize: res.data.size,
        total: res.data.total,
      });
    } catch (error) {
      message.error('❌ Error al obtener cupones');
    } finally {
      setLoading(false);
    }
  };

  const deleteCouponById = async (id: string) => {
    setLoading(true);
    try {
      await deleteCoupon(id);
      message.success('Cupón eliminado');
      await fetchCoupons();
    } catch (error) {
      message.error('❌ No se pudo eliminar el cupón');
    } finally {
      setLoading(false);
    }
  };

  const createCouponData = async (data: any) => {
    setLoading(true);
    try {
      await createCoupon(data);
      message.success('Cupón creado');
      await fetchCoupons();
    } catch (error) {
      message.error('❌ Error al crear cupón');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCouponData = async (id: string, data: any) => {
    setLoading(true);
    try {
      await updateCoupon(id, data);
      message.success('Cupón actualizado');
      await fetchCoupons();
    } catch (error) {
      message.error('❌ Error al actualizar cupón');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponById = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await getCouponById(id);
      setCoupon(data);
    } catch (error) {
      message.error('❌ Error al cargar detalles del cupón');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CouponContext.Provider
      value={{
        generalCoupons,
        userCoupons,
        coupons,
        coupon,
        pagination,
        loading,
        fetchGeneralCoupons,
        fetchUserCoupons,
        exchangeCouponCode,
        fetchCoupons,
        deleteCouponById,
        createCouponData,
        updateCouponData,
        fetchCouponById,
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
